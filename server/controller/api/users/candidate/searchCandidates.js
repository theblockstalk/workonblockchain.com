const CandidateProfile = require('../../../../model/candidate_profile');
const User = require('../../../../model/users');
const Chat = require('../../../../model/chat');
const logger = require('../../../services/logger');
const errors = require('../../../services/errors');

const settings = require('../../../../settings');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;

const reduceSalaryFactor = 0.9;

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
    if (filters.disable_account === false) userQuery.disable_account = filters.disable_account;
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

        userQuery._id = {$in : userIds};
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
                salaryConverterResult = salary_converter(search.salary.current_salary*reduceSalaryFactor, USD.GBP , USD.Euro );
                salaryArray= {USD : search.salary.current_salary , GBP : salaryConverterResult[0] , Euro :salaryConverterResult[1]};
            }

            if(search.salary.current_currency === '£ GBP' && search.salary.current_salary)
            {
                salaryConverterResult = salary_converter(search.salary.current_salary*reduceSalaryFactor, GBP.USD , GBP.Euro );
                salaryArray= {USD : salaryConverterResult[0] , GBP : search.salary.current_salary , Euro :salaryConverterResult[1]};
            }
            if(search.salary.current_currency === '€ EUR' && search.salary.current_salary)
            {
                salaryConverterResult = salary_converter(search.salary.current_salary*reduceSalaryFactor, Euro.USD , Euro.GBP );
                salaryArray= {USD : salaryConverterResult[0] , GBP : salaryConverterResult[1]  , Euro : search.salary.current_salary};
            }

            if(search.salary.current_currency && search.salary.current_salary) {
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
        if (search.availability_day && search.availability_day !== -1) {
            const availabilityFilter = {"availability_day": search.availability_day};
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


function salary_converter(salary_value, currency1, currency2)
{

    let value1 = (salary_value / currency1).toFixed();
    let value2 = (salary_value/currency2).toFixed();
    let array = [];

    array.push(value1);
    array.push(value2);

    return array;
}
