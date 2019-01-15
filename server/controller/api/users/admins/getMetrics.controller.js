const users = require('../../../../model/mongoose/users');
const enumerations = require('../../../../model/enumerations');
const settings = require('../../../../settings');
const curr = require('../../../services/currency');

module.exports = async function (req, res) {
    let totalCandidates, emailVerified = 0, approved = 0, dissabled = 0, agreedTerms = 0;

    totalCandidates = await users.count({type : 'candidate'});
    let aggregatedData = {
        nationality: {},
        availabilityDay: {},
        baseCountry: {},
        expectedSalaryUSD: {},
        locations: {},
        roles: {},
        interestAreas: {},
        blockchain: {
            commercial: {},
            smartContract: {},
            experimented: {}
        },
        programmingLanguages: {},
    };

    let locationList = enumerations.workLocations;
    let salaryArray = [];

    let programmingLanguagesCount = {}, programmingLanguagesAggregate = {};
    let blockchainCommercialCount = {}, blockchainCommercialAggregate = {};
    let blockchainSmartCount = {}, blockchainSmartAggregate = {};

    let candidate;
    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        candidate = userDoc.candidate;
        if (userDoc.is_verify) emailVerified++;
        if (userDoc.disable_account) dissabled++;
        if (candidate.status[0].status === 'approved' && !userDoc.disable_account) {
            approved++;
            if (candidate.expected_salary && candidate.expected_salary_currency) salaryList(salaryArray, candidate.expected_salary, candidate.expected_salary_currency)
            aggregateField(aggregatedData.nationality, userDoc.nationality, enumerations.nationalities);
            aggregateField(aggregatedData.availabilityDay, candidate.availability_day, enumerations.workAvailability);
            aggregateField(aggregatedData.baseCountry, candidate.base_country, enumerations.countries);
            aggregateArray(aggregatedData.locations, candidate.locations, locationList);
            aggregateArray(aggregatedData.roles, candidate.roles, enumerations.workRoles);
            aggregateArray(aggregatedData.interestAreas, candidate.interest_areas, enumerations.workBlockchainInterests);
            aggregateArray(aggregatedData.blockchain.experimented, candidate.blockchain.experimented_platforms, enumerations.blockchainPlatforms);
            aggregateObjArray(programmingLanguagesCount, candidate.programming_languages, enumerations.programmingLanguages, "language");
            aggregateObjArrayAggregate(programmingLanguagesAggregate, candidate.programming_languages, enumerations.programmingLanguages, "language", "exp_year");
            aggregateObjArray(blockchainCommercialCount, candidate.blockchain.commercial_platforms, enumerations.blockchainPlatforms, "name");
            aggregateObjArrayAggregate(blockchainCommercialAggregate, candidate.blockchain.commercial_platforms, enumerations.blockchainPlatforms, "name", "exp_year");
            aggregateObjArray(blockchainSmartCount, candidate.blockchain.smart_contract_platforms, enumerations.blockchainPlatforms, "name");
            aggregateObjArrayAggregate(blockchainSmartAggregate, candidate.blockchain.smart_contract_platforms, enumerations.blockchainPlatforms, "name", "exp_year");

        }
        if (userDoc.terms) agreedTerms++;

    });

    countAndAggregate(aggregatedData.programmingLanguages, programmingLanguagesCount, programmingLanguagesAggregate);
    countAndAggregate(aggregatedData.blockchain.commercial, blockchainCommercialCount, blockchainCommercialAggregate);
    countAndAggregate(aggregatedData.blockchain.smartContract, blockchainSmartCount, blockchainSmartAggregate);

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
    })

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