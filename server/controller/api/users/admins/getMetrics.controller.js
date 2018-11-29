const Candidate = require('../../../../model/candidate_profile');
const User = require('../../../../model/users');
const enumerations = require('../../../../model/enumerations');
const settings = require('../../../../settings');

module.exports = async function (req, res) {
    let totalCandidates, emailVerified = 0, approved = 0, dissabled = 0, agreedTerms = 0;

    let candidateCursor = await Candidate.find({}).cursor();
    totalCandidates = await Candidate.find({}).count();
    let candidateDoc = await candidateCursor.next();

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
    locationList.push("remote");
    let salaryArray = [];

    let programmingLanguagesCount = {}, programmingLanguagesAggregate = {};
    let blockchainCommercialCount = {}, blockchainCommercialAggregate = {};
    let blockchainSmartCount = {}, blockchainSmartAggregate = {};

    for ( null ; candidateDoc !== null; candidateDoc = await candidateCursor.next()) {
        let userDoc = await User.findOne({_id: candidateDoc._creator});
        if (userDoc.is_verify) emailVerified++;
        if (userDoc.disable_account) dissabled++;
        if (userDoc.candidate.status[0].status === 'approved' && !userDoc.disable_account) {
            approved++;

            if (candidateDoc.expected_salary && candidateDoc.expected_salary_currency) salaryList(salaryArray, candidateDoc.expected_salary, candidateDoc.expected_salary_currency)
            aggregateField(aggregatedData.nationality, candidateDoc.nationality, enumerations.nationalities);
            aggregateField(aggregatedData.availabilityDay, candidateDoc.availability_day, enumerations.workAvailability);
            if (userDoc.candidate) aggregateField(aggregatedData.baseCountry, userDoc.candidate.base_country, enumerations.countries);
            aggregateArray(aggregatedData.locations, candidateDoc.locations, locationList);
            aggregateArray(aggregatedData.roles, candidateDoc.roles, enumerations.workRoles);
            aggregateArray(aggregatedData.interestAreas, candidateDoc.interest_area, enumerations.workBlockchainInterests);
            // aggregateObjArray(aggregatedData.blockchain.commercial, candidateDoc.commercial_platform, enumerations.blockchainPlatforms, "platform_name");
            // aggregateObjArray(aggregatedData.blockchain.smartContract, candidateDoc.platforms, enumerations.blockchainPlatforms, "platform_name");
            aggregateObjArray(aggregatedData.blockchain.experimented, candidateDoc.experimented_platform, enumerations.blockchainPlatforms, "name");
            aggregateObjArray(programmingLanguagesCount, candidateDoc.programming_languages, enumerations.programmingLanguages, "language");
            aggregateObjArrayAggregate(programmingLanguagesAggregate, candidateDoc.programming_languages, enumerations.programmingLanguages, "language", "exp_year");
            aggregateObjArray(blockchainCommercialCount, candidateDoc.commercial_platform, enumerations.blockchainPlatforms, "platform_name");
            aggregateObjArrayAggregate(blockchainCommercialAggregate, candidateDoc.commercial_platform, enumerations.blockchainPlatforms, "platform_name", "exp_year");
            aggregateObjArray(blockchainSmartCount, candidateDoc.platforms, enumerations.blockchainPlatforms, "platform_name");
            aggregateObjArrayAggregate(blockchainSmartAggregate, candidateDoc.platforms, enumerations.blockchainPlatforms, "platform_name", "exp_year");

        }
        if (candidateDoc.terms) agreedTerms++;

    }
    
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
    let salaryUSD = expectedSalary;
    if (currency === "€ EUR") {
        salaryUSD = expectedSalary * settings.CURRENCY_RATES.USD.Euro;
    } else if (currency === "£ GBP") {
        salaryUSD = expectedSalary * settings.CURRENCY_RATES.USD.GBP;
    }
    salaryArray.push(salaryUSD);
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