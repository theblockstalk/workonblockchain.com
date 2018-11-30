const CandidateProfile = require('../../../../model/candidate_profile');
const User = require('../../../../model/users');
const Chat = require('../../../../model/chat');
const logger = require('../../../services/logger');
const errors = require('../../../services/errors');

const settings = require('../../../../settings');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;

const salaryFactor = 1.1;

/*
inputSchema = {
    filers: {
        is_verify: {
            type: Number,
            enum: [0, 1],
        },
        status: {
            type: String,
            enum: enumerations.candidateStatus
        },
        disable_account: Boolean,
        msg_tags: {
            type: String,
            enum: enumerations.chatMsgTypes
        },
        onlyAfterDate: Date
    },
    search: {
        name: String,
        word: String,
        locations: [{
            type: String,
            enum: enumerations.workLocations
        }],
        positions: [{
            type: String,
            enum: enumerations.workRoles
        }],
        blockchains: [{
            type: String,
            enum: enumerations.blockchainPlatforms
        }],
        skills: [{
            type: String,
            enum: enumerations.programmingLanguages
        }],
        salary: {
            type: {
                current_currency: {
                    type: String,
                    enum: enumerations.currencies
                },
                current_salary: Number
            }
        },
        availability_day: {
            type: String,
            enum: enumerations.workAvailability
        }
    }
};

outputSchema = {
    count: Number
    candidates: [
        type: candidateDoc
    ]
};
*/

module.exports.candidateSearch = async function candidateSearch(filters, search) {
    logger.debug("Doing new candidate search", {
        filters: filters,
        search: search
    });

    let candidates;
    let userQuery = {
        type : 'candidate'
    };

    if (filters.is_verify) userQuery.is_verify = filters.is_verify;
    if (filters.status && filters.status !== -1) userQuery['candidate.status.0.status'] = filters.status;
    if (filters.disable_account) userQuery.disable_account = filters.disable_account;
    if (filters.msg_tags) {
        let userIds = [];
        const chatDocs = await Chat.find({msg_tag : {$in: filters.msg_tags}}, {sender_id: 1, receiver_id: 1}).lean();
        if (!chatDocs) {
            errors.throwError("No users matched the search", 404);
        }
        for (chatDoc of chatDocs) {
            userIds.push(chatDoc.sender_id);
            userIds.push(chatDoc.receiver_id);
        }
        const userIdsDistinct = makeDistinctNumberSet(userIds);
        userQuery._id = {$in : userIdsDistinct};
    }

    if (filters.firstApprovedDate) {
        userQuery.first_approved_date = { $gte : filters.firstApprovedDate}
    }
    let userDocIds;
    let candidateQuery = [];
    userDocIds = await User.find(userQuery, {_id: 1}).lean();

    if(userDocIds && userDocIds.length > 0) {
        candidateQuery.push({ "_creator": {$in: userDocIds}});
    } else {
        errors.throwError("No users matched the search", 404);
    }

    if (search) {
        if(search.name) {
            const nameSearch = { $or: [{ first_name: {'$regex' : search.name, $options: 'i'}},
                {last_name : {'$regex' : search.name, $options: 'i'}}] };
            candidateQuery.push(nameSearch);
        }
        if(search.word) {
            const wordSearch = { $or: [{ why_work: {'$regex' : search.word, $options: 'i'}},
                {description : {'$regex' : search.word, $options: 'i'}}] };
            candidateQuery.push(wordSearch);
        }
        if (search.locations && search.locations.length > 0 ) {
            const locationFilter = {"locations": {$in: search.locations}};
            candidateQuery.push(locationFilter);
        }

        if (search.positions && search.positions.length > 0  ) {
            const rolesFilter = {"roles": {$in: search.positions}};
            candidateQuery.push(rolesFilter);
        }

        if (search.salary && search.salary.current_currency && search.salary.current_salary) {
            let salaryArray = [];
            let salaryConverterResult;
            if(search.salary.current_currency === '$ USD' && search.salary.current_salary)
            {
                salaryConverterResult = salary_converter(search.salary.current_salary*salaryFactor, USD.GBP , USD.Euro );
                salaryArray= {USD : search.salary.current_salary , GBP : salaryConverterResult[0] , Euro :salaryConverterResult[1]};
            }

            if(search.salary.current_currency === '£ GBP' && search.salary.current_salary)
            {
                salaryConverterResult = salary_converter(search.salary.current_salary*salaryFactor, GBP.USD , GBP.Euro );
                salaryArray= {USD : salaryConverterResult[0] , GBP : search.salary.current_salary , Euro :salaryConverterResult[1]};
            }
            if(search.salary.current_currency === '€ EUR' && search.salary.current_salary)
            {
                salaryConverterResult = salary_converter(search.salary.current_salary*salaryFactor, Euro.USD , Euro.GBP );
                salaryArray= {USD : salaryConverterResult[0] , GBP : salaryConverterResult[1]  , Euro : search.salary.current_salary};
            }

            if(salaryArray.length > 0 && search.salary.current_currency && search.salary.current_salary) {
                const currencyFiler = {
                    $or : [
                        { $and : [ { current_currency : "$ USD" }, { current_salary : {$lte: salaryArray.USD} } ] },
                        { $and : [ { current_currency : "£ GBP" }, { current_salary : {$lte: salaryArray.GBP} } ] },
                        { $and : [ { current_currency : "€ EUR" }, { current_salary : {$lte: salaryArray.Euro} } ] }
                    ]
                };
                candidateQuery.push(currencyFiler);
            }
        }

        if (search.blockchains && search.blockchains.length > 0 ) {
            const platformFilter = {
                $or: [
                    {"commercial_platform.platform_name": {$in: search.blockchains}},
                    {"platforms.platform_name": {$in: search.blockchains}}
                ]
            };
            candidateQuery.push(platformFilter);
        }

        if (search.skills && search.skills.length > 0) {
            const skillsFilter = {"programming_languages.language": search.skills};
            candidateQuery.push(skillsFilter);
        }
        if (search.availability_day && search.availability_day !== -1 && search.availability_day !== 'Longer than 3 months') {
            let dayArray;
            if (search.availability_day === 'Now') {
                dayArray = ['Now'];
            } else if (search.availability_day === '1 month') {
                dayArray = ['Now', '1 month'];
            } else if (search.availability_day === '2 months') {
                dayArray = ['Now', '1 month', '2 months'];
            } else if (search.availability_day === '3 months') {
                dayArray = ['Now', '1 month', '2 months', '3 months'];
            }
            const availabilityFilter = {"availability_day": {$in: dayArray}};
            candidateQuery.push(availabilityFilter);
        }
    }
    const searchQuery = {$and: candidateQuery};
    candidates = await CandidateProfile.find(searchQuery).populate('_creator').lean();
    if (!candidates) {
        errors.throwError("No candidates matched the search", 404);
    }

    return {
        count: candidates.length,
        candidates: candidates
    };

}

function makeDistinctNumberSet(numberArray) {
    return Array.from(new Set(userIds));
}

function salary_converter(salary_value, currency1, currency2)
{

    let value1 = (salary_value / currency1).toFixed();
    let value2 = (salary_value/currency2).toFixed();
    let array = [];

    array.push(value1);
    array.push(value2);

    return array;
}
