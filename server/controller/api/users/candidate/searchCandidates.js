const users = require('../../../../model/mongoose/users');
const messages = require('../../../../model/messages');
const logger = require('../../../services/logger');
const currency = require('../../../services/currency');
const errors = require('../../../services/errors');
const cities = require('../../../../model/mongoose/cities');
const objects = require('../../../services/objects');


const salaryFactor = 1.1;

module.exports.candidateSearch = async function (filters, search, orderPreferences) {
    logger.debug("Doing new candidate search", {
        filters: filters,
        search: search
    });

    let userQuery = [];
    userQuery.push({"type" : 'candidate'});

    if (filters.is_verify === 1 || filters.is_verify === 0) userQuery.push({"is_verify" : filters.is_verify});

    if (filters.status && filters.status !== -1) userQuery.push({'candidate.latest_status.status' : filters.status});
    if (filters.updatedAfter) userQuery.push({'candidate.latest_status.timestamp' : {$gte: filters.updatedAfter}});

    if (filters.disable_account === true || filters.disable_account === false) userQuery.push({"disable_account" :  filters.disable_account});
    if (filters.msg_tags) {
        let userIds = [];
        const messageDocs = await messages.find({msg_tag : {$in: filters.msg_tags}}, {sender_id: 1, receiver_id: 1}).lean();
        if (!messageDocs) {
            errors.throwError("No users matched the search", 404);
        }
        for (messageDoc of messageDocs) {
            userIds.push(messageDoc.sender_id.toString());
            userIds.push(messageDoc.receiver_id.toString());
        }
        const userIdsDistinct = makeDistinctSet(userIds);
        userQuery.push({_id : {$in : userIdsDistinct}});

    }

    if (filters.blacklist) {
        userQuery.push({_id: {$nin: filters.blacklist}});
    }

    if (search) {
        let locationQuery;
        let roleQuery;

        if(search.work_type === 'employee') {
            locationQuery= "candidate.employee.location";
            roleQuery = "candidate.employee.roles";
            userQuery.push({'candidate.employee': {$exists: true}});
        }
        if(search.work_type === 'contractor') {
            locationQuery= "candidate.contractor.location";
            roleQuery = "candidate.contractor.roles";
            userQuery.push({'candidate.contractor': {$exists: true}});
        }
        if(search.work_type === 'volunteer') {
            locationQuery= "candidate.volunteer.location";
            roleQuery = "candidate.volunteer.roles";
            userQuery.push({'candidate.volunteer': {$exists: true}});
        }

        if(search.name) {
            const nameSearch = { $or: [{ first_name: {'$regex' : search.name, $options: 'i'}},
                {last_name : {'$regex' : search.name, $options: 'i'}}] };
            userQuery.push(nameSearch);
        }
        if(search.why_work) {
            const wordSearch = { $or: [{ 'candidate.why_work': {'$regex' : search.why_work, $options: 'i'}},
                {description : {'$regex' : search.why_work, $options: 'i'}}] };
            userQuery.push(wordSearch);
        }
        if (search.locations && search.locations.length > 0 ) {
            logger.debug("locations: " ,search.locations);
            let locationsQuery = [];
            let citiesArray=[];
            let countriesArray = [];
            for(let loc of search.locations) {
                const cityDoc = await cities.findOneById(loc.city);
                if(cityDoc) {
                    citiesArray.push(cityDoc._id);
                    countriesArray.push(cityDoc.country);
                }
            }
            if(citiesArray.length > 0 ) {
                countriesArray = removeDups(countriesArray);
                if (search.visa_needed) {
                    for (let city of citiesArray) {
                        const setCityLocationQuery = function (locationQuery){
                            const cityQuery = {
                                [locationQuery]: {
                                    $elemMatch: {
                                        city: city,
                                        visa_needed: true
                                    }
                                }
                            }
                            locationsQuery.push(cityQuery)
                        };
                        if(locationQuery) setCityLocationQuery(locationQuery);
                        else {
                            setCityLocationQuery("candidate.employee.location");
                            setCityLocationQuery("candidate.contractor.location");
                            setCityLocationQuery("candidate.volunteer.location");
                        }
                    }

                    for (let country of countriesArray) {
                        const setCountryLocationQuery = function (locationQuery){
                            const countryQuery = {
                                [locationQuery]: {
                                    $elemMatch: {
                                        country: country,
                                        visa_needed: true
                                    }
                                }
                            }
                            locationsQuery.push(countryQuery)
                        };
                        if(locationQuery) setCountryLocationQuery(locationQuery);
                        else {
                            setCountryLocationQuery("candidate.employee.location");
                            setCountryLocationQuery("candidate.contractor.location");
                            setCountryLocationQuery("candidate.volunteer.location");
                        }

                    }
                }
                else {
                    for (let city of citiesArray) {
                        const setCityLocationQuery = function (locationQuery){
                            const cityQuery = {
                                [locationQuery]: {
                                    $elemMatch: {
                                        city: city,
                                        visa_needed: false
                                    }
                                }
                            }
                            locationsQuery.push(cityQuery)
                        };
                        if(locationQuery) setCityLocationQuery(locationQuery);
                        else {
                            setCityLocationQuery("candidate.employee.location");
                            setCityLocationQuery("candidate.contractor.location");
                            setCityLocationQuery("candidate.volunteer.location");
                        }
                    }

                    for (let country of countriesArray) {
                        const setCountryLocationQuery = function (locationQuery){
                            const countryQuery = {
                                [locationQuery]: {
                                    $elemMatch: {
                                        country: country,
                                        visa_needed: false
                                    }
                                }
                            }
                            locationsQuery.push(countryQuery)
                        };
                        if(locationQuery) setCountryLocationQuery(locationQuery);
                        else {
                            setCountryLocationQuery("candidate.employee.location");
                            setCountryLocationQuery("candidate.contractor.location");
                            setCountryLocationQuery("candidate.volunteer.location");
                        }

                    }

                }

            }
            if(search.locations.find(x => x.remote === true)) {
                let locationRemote;
                if(search.work_type === 'employee') locationRemote = {"candidate.employee.location.remote" : true};
                else if(search.work_type === 'contractor') locationRemote = {"candidate.contractor.location.remote" : true};
                else if(search.work_type === 'volunteer') locationRemote = {"candidate.volunteer.location.remote" : true};
                else {
                    locationRemote = {
                        $or: [
                            {"candidate.employee.location.remote" : true},
                            {"candidate.contractor.location.remote" : true},
                            {"candidate.volunteer.location.remote" : true}
                        ]
                    };
                }
                const locationRemoteFilter = locationRemote;
                locationsQuery.push(locationRemoteFilter);
            }
            if(locationsQuery && locationsQuery.length > 0) {
                userQuery.push({
                    $or:locationsQuery
                });
            }

        }

        if (search.roles && search.roles.length > 0  ) {
            let rolesQuery =[];
            const setRoleQuery = function (roleQuery){
                const rolesFilter = {[roleQuery]: {$in: search.roles}};
                rolesQuery.push(rolesFilter);
            };
            if(roleQuery) setRoleQuery(roleQuery);
            else {
                setRoleQuery("candidate.employee.roles");
                setRoleQuery("candidate.contractor.roles");
                setRoleQuery("candidate.volunteer.roles");
            }

            if(rolesQuery && rolesQuery.length > 0) {
                userQuery.push({
                    $or: rolesQuery
                });
            }

        }
        if (search.blockchains && search.blockchains.length > 0 ) {
            const platformFilter = {
                $or: [
                    {"candidate.blockchain.commercial_platforms.name": {$in: search.blockchains}},
                    {"candidate.blockchain.smart_contract_platforms.name": {$in: search.blockchains}}
                ]
            };
            userQuery.push(platformFilter);
        }

        if (search.salary && search.salary.current_currency && search.salary.current_salary) {
            const curr = search.salary.current_currency;
            const salary = search.salary.current_salary;
            const usd = [{'candidate.employee.currency' : "$ USD"}, {'candidate.employee.expected_annual_salary': {$lte: salaryFactor*currency.convert(curr, "$ USD", salary)}}];
            const gbp = [{'candidate.employee.currency': "£ GBP"}, {'candidate.employee.expected_annual_salary': {$lte: salaryFactor*currency.convert(curr, "£ GBP", salary)}}];
            const eur = [{'candidate.employee.currency': "€ EUR"}, {'candidate.employee.expected_annual_salary': {$lte: salaryFactor*currency.convert(curr, "€ EUR", salary)}}];

            const currencyFiler = {
                $or : [{ $and : usd }, { $and : gbp }, { $and : eur }]
            };
            userQuery.push(currencyFiler);
        }

        if (search.hourly_rate && search.hourly_rate.expected_hourly_rate && search.hourly_rate.current_currency) {
            const curr = search.hourly_rate.currency;
            const hourly_rate = search.hourly_rate.expected_hourly_rate;
            const usd = [{'candidate.contractor.currency' : "$ USD"}, {'candidate.contractor.expected_hourly_rate': {$lte: salaryFactor*currency.convert(curr, "$ USD", hourly_rate)}}];
            const gbp = [{'candidate.contractor.currency': "£ GBP"}, {'candidate.contractor.expected_hourly_rate': {$lte: salaryFactor*currency.convert(curr, "£ GBP", hourly_rate)}}];
            const eur = [{'candidate.contractor.currency': "€ EUR"}, {'candidate.contractor.expected_hourly_rate': {$lte: salaryFactor*currency.convert(curr, "€ EUR", hourly_rate)}}];

            const hourlyRateFilter = {
                $or : [{ $and : usd }, { $and : gbp }, { $and : eur }]
            };
            userQuery.push(hourlyRateFilter);
        }

        if (search.programming_languages && search.programming_languages.length > 0) {
            let skillsFilterNew;
            if (search.years_exp_min) {
                let skillsAndExpFilter = [];
                for (let skills of search.programming_languages) {
                    skillsAndExpFilter = {
                        "candidate.programming_languages": {
                            $elemMatch: {
                                "language": skills,
                                "exp_year": {$in: minExpToArray(search.years_exp_min)}
                            }
                        }
                    };
                    skillsFilterNew = {$or: [skillsAndExpFilter]}
                }
            }
            else{
                const skillsFilter = {"candidate.programming_languages.language": {$in: search.skills}};
                userQuery.push(skillsFilter);
            }
            if(skillsFilterNew){
                userQuery.push(skillsFilterNew);
            }
        }



        if (search.base_country && search.base_country.length > 0) {
            const residenceCountryFilter = {"candidate.base_country": {$in: search.base_country}};
            userQuery.push(residenceCountryFilter);
        }

    }

    let orderBy;

    if(orderPreferences) {
        if (orderPreferences.blockchainOrder && orderPreferences.blockchainOrder.length > 0 ) {
            orderBy = {
                $or: [
                    {"candidate.blockchain.commercial_platforms.name": {$in: orderPreferences.blockchainOrder}},
                    {"candidate.blockchain.smart_contract_platforms.name": {$in: orderPreferences.blockchainOrder}}
                ]
            };
        }
    }
    logger.debug("query", {query: userQuery});
    let searchQuery = {$and: userQuery};
    const userDocs = await users.find(searchQuery);
    if(userDocs && userDocs.length > 0) {
        if(orderBy) {
            userQuery.push(orderBy);
            searchQuery = {$and: userQuery};
            const userDocsOrderBy = await users.find(searchQuery);
            let sortedDocs = userDocsOrderBy.concat(userDocs);
            sortedDocs = objects.removeDuplicates(sortedDocs , '_id');
            return {
                count: sortedDocs.length,
                candidates: sortedDocs
            };
        }
        else {
            return {
                count: userDocs.length,
                candidates: userDocs
            };
        }

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

//Remove duplicates from one dimension array
function removeDups(names) {
    let unique = {};
    names.forEach(function(i) {
        if(!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}

const minExpToArray  = function(expYears) {
    switch (expYears) {
        case 1:
            return ['0-1', '1-2', '2-4', '4-6', '6+'];
            break;
        case 2:
            return ['1-2', '2-4', '4-6', '6+'];
            break;
        case 3:
            return ['2-4', '4-6', '6+'];
            break;
        case 4:
        case 5:
        case 6:
            return ['4-6', '6+'];
            break;
        default:
            return ['6+'];
            break;
    }
}