const users = require('../../../model/mongoose/users');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../model/enumerations');
const curr = require('../../services/currency');
const auth = require('../../middleware/auth-v2');

module.exports.request = {
    type: 'get',
    path: '/statistics'
};

const querySchema = new Schema({
    admin: {
        type: String,
        enum: ['true']
    }
});

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    if(req.query.admin) auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    if(req.query.admin){
        let totalCandidates, emailVerified = 0, approved = 0, dissabled = 0, agreedTerms = 0;

        totalCandidates = await users.count({type : 'candidate'});
        let aggregatedData = {
            nationality: {},
            employmentAvailability: {},
            baseCountry: {},
            expectedSalaryUSD: {},
            employee: {
                location:{},
                roles:{}
            },
            contractor: {
                location: {},
                roles: {}
            },
            volunteer: {
                location:{},
                roles: {}
            },
            interestAreas: {},
            blockchain: {
                commercial_platforms: {},
                experimented_platforms: {},
                commercial_skills: {}
            },
            programmingLanguages: {},
        };

        let locationList = enumerations.workLocations;
        let salaryArray = [];

        let programmingLanguagesCount = {}, programmingLanguagesAggregate = {};
        let blockchainCommercialCount = {}, blockchainCommercialAggregate = {};
        let blockchainSmartCount = {}, blockchainSmartAggregate = {} ;
        let employeeLocationsCount = {} , employeeLocationAggregate = {};
        let contractorLocationsCount = {} , contractorLocationAggregate = {};
        let volunteerLocationsCount = {} , volunteerLocationAggregate = {};

        let candidate;
        await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
            candidate = userDoc.candidate;
            if (userDoc.is_verify) emailVerified++;
            if (userDoc.disable_account) dissabled++;

            if (userDoc.candidate.latest_status.status === 'approved' && !userDoc.disable_account) {
                approved++;
                if(candidate.employee) {
                    salaryList(salaryArray, candidate.employee.expected_annual_salary, candidate.employee.currency)
                    aggregateArray(aggregatedData.employee.roles, candidate.employee.roles, enumerations.workRoles);
                    aggregateObjArray(employeeLocationsCount, candidate.employee.location, enumerations.countries, "country");
                    aggregateObjArrayAggregate(employeeLocationAggregate, candidate.employee.location, enumerations.countries, "country", "visa_needed");
                    aggregateField(aggregatedData.employmentAvailability, candidate.employee.employment_availability, enumerations.workAvailability);
                }
                if(candidate.contractor) {
                    salaryList(salaryArray, candidate.contractor.expected_hourly_rate, candidate.contractor.currency)
                    aggregateArray(aggregatedData.contractor.roles, candidate.contractor.roles, enumerations.workRoles);
                    aggregateObjArray(contractorLocationsCount, candidate.contractor.location, enumerations.countries, "country");
                    aggregateObjArrayAggregate(contractorLocationAggregate, candidate.contractor.location, enumerations.countries, "country", "visa_needed");


                }

                if(candidate.volunteer) {
                    aggregateArray(aggregatedData.volunteer.roles, candidate.volunteer.roles, enumerations.workRoles);
                    aggregateObjArray(volunteerLocationsCount, candidate.volunteer.location, enumerations.countries, "country");
                    aggregateObjArrayAggregate(volunteerLocationAggregate, candidate.volunteer.location, enumerations.countries, "country", "visa_needed");

                }
                aggregateArray(aggregatedData.nationality, userDoc.nationality, enumerations.nationalities);
                aggregateField(aggregatedData.baseCountry, candidate.base_country, enumerations.countries);
                if(candidate.interest_areas)aggregateArray(aggregatedData.interestAreas, candidate.interest_areas, enumerations.workBlockchainInterests);
                if(candidate.blockchain && candidate.blockchain.experimented_platforms) {
                    aggregateArray(aggregatedData.blockchain.experimented_platforms, candidate.blockchain.experimented_platforms, enumerations.blockchainPlatforms);
                }
                if(candidate.programming_languages) {
                    aggregateObjArray(programmingLanguagesCount, candidate.programming_languages, enumerations.programmingLanguages, "language");
                    aggregateObjArrayAggregate(programmingLanguagesAggregate, candidate.programming_languages, enumerations.programmingLanguages, "language", "exp_year");
                }
                if(candidate.blockchain && candidate.blockchain.commercial_platforms) {
                    aggregateObjArray(blockchainCommercialCount, candidate.blockchain.commercial_platforms, enumerations.blockchainPlatforms, "name");
                    aggregateObjArrayAggregate(blockchainCommercialAggregate, candidate.blockchain.commercial_platforms, enumerations.blockchainPlatforms, "name", "exp_year");
                }
                if(candidate.blockchain && candidate.blockchain.commercial_skills) {
                    aggregateObjArray(blockchainSmartCount, candidate.blockchain.commercial_skills, enumerations.blockchainPlatforms, "name");
                    aggregateObjArrayAggregate(blockchainSmartAggregate, candidate.blockchain.commercial_skills, enumerations.blockchainPlatforms, "name", "exp_year");
                }
            }
            if (userDoc.terms) agreedTerms++;

        });

        console.log("aggregatedData");
        console.log(aggregatedData)
        if(employeeLocationsCount) countAndAggregate(aggregatedData.employee.location, employeeLocationsCount, employeeLocationAggregate);
        if(contractorLocationsCount) countAndAggregate(aggregatedData.contractor.location, contractorLocationsCount, contractorLocationAggregate);
        if(volunteerLocationsCount) countAndAggregate(aggregatedData.volunteer.location, volunteerLocationsCount, volunteerLocationAggregate);

        countAndAggregate(aggregatedData.programmingLanguages, programmingLanguagesCount, programmingLanguagesAggregate);
        countAndAggregate(aggregatedData.blockchain.commercial_skills, blockchainCommercialCount, blockchainCommercialAggregate);
        countAndAggregate(aggregatedData.blockchain.experimented_platforms, blockchainSmartCount, blockchainSmartAggregate);

        aggregatedData.expectedSalaryUSD = {
            min: Math.min.apply(null, salaryArray),
            max: Math.max.apply(null, salaryArray),
            average: average(salaryArray),
            median: median(salaryArray)
        };

        res.json({
            candidates: totalCandidates,
            emailVerified: emailVerified,
            dissabled: dissabled,
            agreedTerms: agreedTerms,
            approvedEnabled: {
                count: approved,
                aggregated: aggregatedData
            }
        });
    }
    else {
        const approvedUserCount = await
        users.count({
            type: 'candidate', "candidate.latest_status.status": 'approved',
            disable_account: false, is_verify: 1
        });

        const blockchainExperienceCount = await
        users.count({
            type: 'candidate', "candidate.latest_status.status": 'approved',
            disable_account: false, is_verify: 1,
            'candidate.blockchain.commercial_platforms': {$exists: true, $ne: []}
        });

        /*res.send({
            approvedUsers: approvedUserCount,
            blockchainExperienceUsers: blockchainExperienceCount
        });*/

        res.send({
            approvedEnabled: {
                count: approvedUserCount,
                aggregated: {
                    blockchain: {
                        commercial: blockchainExperienceCount
                    }
                }
            }
        })
    }
}

function aggregateField(aggregateObj, field, aggregateOver) {
    for (const aggFild of aggregateOver) {
        if (field === aggFild) {
            if (!aggregateObj[aggFild]) aggregateObj[aggFild] = 1;
            else aggregateObj[aggFild]++;
        }
    }
}

function aggregateArray(aggregateObj, array, aggregateOver) {
    for (const aggField of aggregateOver) {
        if (array.includes && array.includes(aggField)) {
            if (!aggregateObj[aggField]) aggregateObj[aggField] = 1;
            else aggregateObj[aggField]++;
        }
    }
}

function aggregateObjArray(aggregateObj, objArray, aggregateOver, objFieldName) {
    for (const aggField of aggregateOver) {
        if (objArray && objArray.length) {
            for (const obj of objArray) {
                if (obj[objFieldName] === aggField) {
                    if (!aggregateObj[aggField]) aggregateObj[aggField] = 1;
                    else aggregateObj[aggField]++;
                    break;
                }
            }
        }
    }
}

function aggregateObjArrayAggregate(aggregateObj, objArray, aggregateOver, objFieldName1, objFieldName2) {
    for (const aggField of aggregateOver) {
        if (objArray && objArray.length) {
            for (const obj of objArray) {
                if (obj[objFieldName1] === aggField) {
                    if (!aggregateObj[aggField]) aggregateObj[aggField] = {};
                    let aggregateObj2 = aggregateObj[aggField];
                    if (!aggregateObj2[obj[objFieldName2]]) aggregateObj2[obj[objFieldName2]] = 1;
                    else aggregateObj2[obj[objFieldName2]]++;
                    break;
                }
            }
        }
    }
}

function countAndAggregate(final, count, aggregate) {
    for (let property in count) {
        if (count.hasOwnProperty(property)) {
            final[property] = {
                count: count[property],
                aggregate: aggregate[property]
            }
        }
    }
}

function salaryList(salaryArray, expectedSalary, currency) {
    const priceUsd = curr.convert(currency, "$ USD", expectedSalary);
    salaryArray.push(priceUsd);
}

function average(arr) {
    return arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
}

function median(numbers) {
    let median = 0, numsLen = numbers.length;
    numbers.sort(function(a,b){
        return a-b;
    });

    if (numsLen % 2 === 0) {
        median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else {
        median = numbers[(numsLen - 1) / 2];
    }

    return median;
}