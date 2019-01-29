const users = require('../../../../model/mongoose/users');
const Chat = require('../../../../model/chat');
const logger = require('../../../services/logger');
const currency = require('../../../services/currency');
const errors = require('../../../services/errors');
const cities = require('../../../../model/mongoose/cities');


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


    let userQuery= [];
    let filteredResult = [];
    let totalProccessed = 0;
    userQuery.push({"type" : 'candidate'});

    if (filters.is_verify === 1 || filters.is_verify === 0) userQuery.push({"is_verify" : filters.is_verify});
    if (filters.status && filters.status !== -1) userQuery.push({'candidate.status.0.status' : filters.status});
    if (filters.disable_account === true || filters.disable_account === false) userQuery.push({"disable_account" :  filters.disable_account});
    if (filters.msg_tags) {
        let userIds = [];
        const chatDocs = await Chat.find({msg_tag : {$in: filters.msg_tags}}, {sender_id: 1, receiver_id: 1}).lean();
        if (!chatDocs) {
            errors.throwError("No users matched the search", 404);
        }
        for (chatDoc of chatDocs) {
            userIds.push(chatDoc.sender_id.toString());
            userIds.push(chatDoc.receiver_id.toString());
        }
        const userIdsDistinct = makeDistinctSet(userIds);
        userQuery.push({_id : {$in : userIdsDistinct}});

    }

    if (filters.firstApprovedDate) {
        const approvedDateFilter = {"first_approved_date" : { $gte : filters.firstApprovedDate}};
        userQuery.push(approvedDateFilter);
    }

    if (search) {
        if(search.name) {
            const nameSearch = { $or: [{ first_name: {'$regex' : search.name, $options: 'i'}},
                {last_name : {'$regex' : search.name, $options: 'i'}}] };
            userQuery.push(nameSearch);
        }
        if(search.word) {
            const wordSearch = { $or: [{ 'candidate.why_work': {'$regex' : search.word, $options: 'i'}},
                {description : {'$regex' : search.word, $options: 'i'}}] };
            userQuery.push(wordSearch);
        }
        if (search.locations && search.locations.length > 0 ) {
            let locationsQuery = [];
            let citiesArray=[];
            let countriesArray = [];
            for(let loc of search.locations) {
                const cityDoc = await cities.findOneById(loc._id);
                if(cityDoc) {
                    citiesArray.push(String(cityDoc._id));
                    countriesArray.push(cityDoc.country);
                }
            }
            if(citiesArray.length > 0 && search.visa_not_needed ) {
                locationsQuery.push({
                    $and: [
                        {"candidate.locations.city": {$in: citiesArray}},
                        {"candidate.locatons.visa_not_needed": true}]
                })

                locationsQuery.push({
                    $and: [
                        {"candidate.locations.country": {$in: countriesArray}},
                        {"candidate.locations.visa_not_needed": true}]
                })
            }
            else {
                locationsQuery.push({ "candidate.locations.city": {$in: citiesArray}});
                locationsQuery.push({"candidate.locations.country" : {$in: countriesArray}});
            }
            if(search.locations.find(x => x.name === "Remote")) {
                const locationRemoteFilter = {"candidate.locations.remote" : true};
                locationsQuery.push(locationRemoteFilter);
            }
            userQuery.push({
                $or:locationsQuery
            });

        }

        if (search.positions && search.positions.length > 0  ) {
            const rolesFilter = {"candidate.roles": {$in: search.positions}};
            userQuery.push(rolesFilter);
        }

        if (search.salary && search.salary.current_currency && search.salary.current_salary) {
            const curr = search.salary.current_currency;
            const salary = search.salary.current_salary;
            const usd = [{'candidate.expected_salary_currency': "$ USD"}, {'candidate.expected_salary': {$lte: salaryFactor*currency.convert(curr, "$ USD", salary)}}];
            const gbp = [{'candidate.expected_salary_currency': "£ GBP"}, {'candidate.expected_salary': {$lte: salaryFactor*currency.convert(curr, "£ GBP", salary)}}];
            const eur = [{'candidate.expected_salary_currency': "€ EUR"}, {'candidate.expected_salary': {$lte: salaryFactor*currency.convert(curr, "€ EUR", salary)}}];
            const currencyFiler = {
                $or : [{ $and : usd }, { $and : gbp }, { $and : eur }]
            };
            userQuery.push(currencyFiler);
        }

        if (search.blockchains && search.blockchains.length > 0 ) {
            const platformFilter = {
                $or: [
                    {"candidate.commercial_platforms.name": {$in: search.blockchains}},
                    {"candidate.blockchain.smart_contract_platforms.name": {$in: search.blockchains}}
                ]
            };
            userQuery.push(platformFilter);
        }

        if (search.skills && search.skills.length > 0) {
            const skillsFilter = {"candidate.programming_languages.language": {$in: search.skills}};
            userQuery.push(skillsFilter);
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
            const availabilityFilter = {"candidate.availability_day": {$in: dayArray}};
            userQuery.push(availabilityFilter);
        }
    }
    const searchQuery = {$and: userQuery};
    await users.findAndIterate(searchQuery, async function(userDoc) {
        filteredResult.push(userDoc);
        totalProccessed++;
    });

    if(filteredResult && filteredResult.length > 0) {
        return {
            count: totalProccessed,
            candidates: filteredResult
        };
    }
    else {
        errors.throwError("No candidates matched this search criteria", 404);
    }
}

function makeDistinctSet(array) {
    return Array.from(new Set(array));
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
