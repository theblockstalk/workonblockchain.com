const User = require('../../../../model/mongoose/users');
const Chat = require('../../../../model/chat');
const logger = require('../../../services/logger');
const currency = require('../../../services/currency');
const errors = require('../../../services/errors');


const salaryFactor = 1.1;

module.exports.candidateSearch = async function candidateSearch(filters, search) {
    logger.debug("Doing new candidate search", {
        filters: filters,
        search: search
    });

    let candidates;
    let userQuery = {
        type : 'candidate'
    };

    if (filters.is_verify === 1 || filters.is_verify === 0) userQuery.is_verify = filters.is_verify;
    if (filters.status && filters.status !== -1) userQuery['candidate.status.0.status'] = filters.status;
    if (filters.disable_account === true || filters.disable_account === false) userQuery.disable_account = filters.disable_account;
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
        userQuery._id = {$in : userIdsDistinct};
    }

    if (filters.firstApprovedDate) {
        userQuery.first_approved_date = { $gte : filters.firstApprovedDate}
    }
    let userDocIds;
    let candidateQuery = [];
    let filteredResult = [];
    let totalProccessed = 0;
    await User.findAndIterate(userQuery, async function(userDoc) {
        candidateQuery.push({ "_id": userDoc._id});
        if (search) {
            if(search.name) {
                const nameSearch = { $or: [{ first_name: {'$regex' : search.name, $options: 'i'}},
                        {last_name : {'$regex' : search.name, $options: 'i'}}] };
                candidateQuery.push(nameSearch);
            }
            if(search.word) {
                const wordSearch = { $or: [{ "candidate.why_work": {'$regex' : search.word, $options: 'i'}},
                        {description : {'$regex' : search.word, $options: 'i'}}] };
                candidateQuery.push(wordSearch);
            }
            if (search.locations && search.locations.length > 0 ) {
                const locationFilter = {"candidate.locations": {$in: search.locations}};
                candidateQuery.push(locationFilter);
            }

            if (search.positions && search.positions.length > 0  ) {
                const rolesFilter = {"candidate.roles": {$in: search.positions}};
                candidateQuery.push(rolesFilter);
            }

            if (search.salary && search.salary.current_currency && search.salary.current_salary) {
                const curr = search.salary.current_currency;
                const salary = search.salary.current_salary;
                const usd = [{"candidate.expected_salary_currency": "$ USD"}, {"candidate.expected_salary": {$lte: salaryFactor*currency.convert(curr, "$ USD", salary)}}];
                const gbp = [{"candidate.expected_salary_currency": "£ GBP"}, {"candidate.expected_salary": {$lte: salaryFactor*currency.convert(curr, "£ GBP", salary)}}];
                const eur = [{"candidate.expected_salary_currency": "€ EUR"}, {"candidate.expected_salary": {$lte: salaryFactor*currency.convert(curr, "€ EUR", salary)}}];
                const currencyFiler = {
                    $or : [{ $and : usd }, { $and : gbp }, { $and : eur }]
                };
                candidateQuery.push(currencyFiler);
            }

            if (search.blockchains && search.blockchains.length > 0 ) {
                const platformFilter = {
                    $or: [
                        {"candidate.blockchain.commercial_platform.name": {$in: search.blockchains}},
                        {"candidate.blockchain.smart_contract_platforms.name": {$in: search.blockchains}}
                    ]
                };
                candidateQuery.push(platformFilter);
            }

            if (search.skills && search.skills.length > 0) {
                const skillsFilter = {"candidate.programming_languages.language": {$in: search.skills}};
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
                const availabilityFilter = {"candidate.availability_day": {$in: dayArray}};
                candidateQuery.push(availabilityFilter);
            }
        }
        console.log(candidateQuery);
        const searchQuery = {$and: candidateQuery};
        candidates = await User.findOne(searchQuery);
        if(candidates) {
            filteredResult.push(candidates);
            totalProccessed++;
        }

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
