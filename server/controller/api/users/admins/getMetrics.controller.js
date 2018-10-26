const EmployerProfile = require('../../../../model/employer_profile');
const Candidate = require('../../../../model/candidate_profile');
const User = require('../../../../model/users');
const enumerations = require('../../../../model/enumerations');

const logger = require('../../../services/logger');


module.exports = async function (req, res) {
    let totalCandidates, emailVerified = 0, approved = 0, dissabled = 0, agreedTerms = 0;

    let candidateCursor = await Candidate.find({}).cursor();
    totalCandidates = await Candidate.find({}).count();
    let candidateDoc = await candidateCursor.next();

    let aggregatedData = {
        nationality: {},
        availabilityDay: {},
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

    for ( null ; candidateDoc !== null; candidateDoc = await candidateCursor.next()) {
        let userDoc = await User.findOne({_id: candidateDoc._creator});
        if (userDoc.is_verify) emailVerified++;
        if (userDoc.disable_account) dissabled++;
        if (userDoc.is_approved) {
            approved++;
            // TODO: base country...
            // TODO: expected salary (multicurrency)
            aggregateCount(aggregatedData.nationality, candidateDoc.nationality, enumerations.nationalities);
            aggregateCount(aggregatedData.availabilityDay, candidateDoc.availability_day, enumerations.workAvailability);
            aggregateCount2(aggregatedData.locations, candidateDoc.locations, enumerations.workLocations);
            aggregateCount2(aggregatedData.roles, candidateDoc.roles, enumerations.workRoles);
            aggregateCount2(aggregatedData.interestAreas, candidateDoc.interest_area, enumerations.workBlockchainInterests);
            aggregateCount3(aggregatedData.blockchain.commercial, candidateDoc.commercial_platform, enumerations.blockchainPlatforms, "platform_name");
            aggregateCount3(aggregatedData.blockchain.smartContract, candidateDoc.platforms, enumerations.blockchainPlatforms, "platform_name");
            aggregateCount3(aggregatedData.blockchain.experimented, candidateDoc.experimented_platform, enumerations.blockchainPlatforms, "name");
            aggregateCount3(aggregatedData.programmingLanguages, candidateDoc.programming_languages, enumerations.programmingLanguages, "language");

        }
        if (candidateDoc.terms) agreedTerms++;

    }

    res.json({
        candidates: totalCandidates,
        emailVerified: emailVerified,
        dissabled: dissabled,
        agreedTerms: agreedTerms,
        approved: {
            count: approved,
            aggregated: aggregatedData,
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