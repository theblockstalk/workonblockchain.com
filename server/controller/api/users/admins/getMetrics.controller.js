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
        programmingLanguages: {}
    };

    let locationList = enumerations.workLocations;
    locationList.push("remote");
    let salaryArray = [];

    for ( null ; candidateDoc !== null; candidateDoc = await candidateCursor.next()) {
        let userDoc = await User.findOne({_id: candidateDoc._creator});
        if (userDoc.is_verify) emailVerified++;
        if (userDoc.disable_account) dissabled++;
        if (userDoc.is_approved) {
            approved++;
            // TODO: base country...
            if (candidateDoc.expected_salary && candidateDoc.expected_salary_currency) salaryList(salaryArray, candidateDoc.expected_salary, candidateDoc.expected_salary_currency)
            aggregateCount(aggregatedData.nationality, candidateDoc.nationality, enumerations.nationalities);
            aggregateCount(aggregatedData.availabilityDay, candidateDoc.availability_day, enumerations.workAvailability);
            if (userDoc.candidate) aggregateCount(aggregatedData.baseCountry, userDoc.candidate.base_country, enumerations.countries);
            aggregateCount2(aggregatedData.locations, candidateDoc.locations, locationList);
            aggregateCount2(aggregatedData.roles, candidateDoc.roles, enumerations.workRoles);
            aggregateCount2(aggregatedData.interestAreas, candidateDoc.interest_area, enumerations.workBlockchainInterests);
            aggregateCount3(aggregatedData.blockchain.commercial, candidateDoc.commercial_platform, enumerations.blockchainPlatforms, "platform_name");
            aggregateCount3(aggregatedData.blockchain.smartContract, candidateDoc.platforms, enumerations.blockchainPlatforms, "platform_name");
            aggregateCount3(aggregatedData.blockchain.experimented, candidateDoc.experimented_platform, enumerations.blockchainPlatforms, "name");
            aggregateCount3(aggregatedData.programmingLanguages, candidateDoc.programming_languages, enumerations.programmingLanguages, "language");

        }
        if (candidateDoc.terms) agreedTerms++;

    }

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
        approved: {
            count: approved,
            aggregated: aggregatedData
        }
    })

}

function aggregateCount(aggregateObj, value, fieldValues) {
    for (const field of fieldValues) {
        if (value === field) {
            if (!aggregateObj[field]) aggregateObj[field] = 1;
            else aggregateObj[field]++;
        }
    }
}

function aggregateCount2(aggregateObj, value, fieldValues) {
    for (const field of fieldValues) {
        if (value.includes && value.includes(field)) {
            if (!aggregateObj[field]) aggregateObj[field] = 1;
            else aggregateObj[field]++;
        }
    }
}

function aggregateCount3(aggregateObj, values, fieldValues, fieldName) {
    for (const field of fieldValues) {
        if (values && values.length) {
            for (const value of values) {
                if (value[fieldName] === field) {
                    if (!aggregateObj[field]) aggregateObj[field] = 1;
                    else aggregateObj[field]++;
                    break;
                }
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