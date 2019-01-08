const Users = require('../model/mongoose/users');
const candidateProfile = require('../model/mongoose/candidate');
const Referral = require('../model/referrals');
const mongoose = require('mongoose');

let totalDocsToProcess, totalModified = 0;
module.exports.up = async function() {
    totalDocsToProcess =await candidateProfile.count({});
    console.log('Total document to process: ' + totalDocsToProcess);
    await candidateProfile.findAndIterate({}, async function(userDoc) {
        console.log("candidate document: " + userDoc);
       let migrateUser ={};
        if(userDoc.terms_id) migrateUser['candidate.terms_id'] = userDoc.terms_id;
        if(userDoc.marketing_emails)  migrateUser['marketing_emails'] = userDoc.marketing_emails;
        if(userDoc.first_name) migrateUser['first_name'] = userDoc.first_name;
        if(userDoc.last_name) migrateUser['last_name'] = userDoc.last_name;
        if(userDoc.github_account) migrateUser['candidate.github_account'] = userDoc.github_account;
        if(userDoc.stackexchange_account)  migrateUser['candidate.stackexchange_account'] = userDoc.stackexchange_account;
        if(userDoc.contact_number) migrateUser['contact_number'] = userDoc.contact_number;
        if(userDoc.nationality) migrateUser['nationality'] = userDoc.nationality;
        if(userDoc.image) migrateUser['image'] = userDoc.image;
        if(userDoc.locations) migrateUser['candidate.locations'] = userDoc.locations;
        if(userDoc.roles) migrateUser['candidate.roles'] = userDoc.roles;
        if(userDoc.expected_salary_currency) migrateUser['candidate.expected_salary_currency'] = userDoc.expected_salary_currency;
        if(userDoc.expected_salary) migrateUser['candidate.expected_salary'] = userDoc.expected_salary;
        if(userDoc.interest_area) migrateUser['candidate.interest_areas'] = userDoc.interest_area;
        if(userDoc.availability_day) migrateUser['candidate.availability_day'] = userDoc.availability_day;
        if(userDoc.why_work) migrateUser['candidate.why_work'] = userDoc.why_work;
        if(userDoc.commercial_platform) {
            let commercialPlatformsObject = [];
            for(let platform of userDoc.commercial_platform) {
                let commercialPlatformInput = {
                    name: platform.platform_name,
                    exp_year: platform.platform
                }

                commercialPlatformsObject.push(commercialPlatformInput);
            }
            migrateUser['candidate.blockchain.commercial_platforms'] = commercialPlatformsObject;
        }
        if(userDoc.experimented_platform) migrateUser['candidate.blockchain.experimented_platforms'] = userDoc.experimented_platform;
        if(userDoc.platforms) {
            let platformsObject = [];
            for(let platform of userDoc.platforms) {
                let platformsInput = {
                    name: platform.platform_name,
                    exp_year: platform.platform
                }

                platformsObject.push(platformsInput);
            }
            migrateUser['candidate.blockchain.smart_contract_platforms'] = platformsObject;
        }
        if(userDoc.current_currency) migrateUser['candidate.current_currency'] = userDoc.current_currency;
        if(userDoc.current_salary) migrateUser['candidate.current_salary'] = userDoc.current_salary;
        if(userDoc.programming_languages) migrateUser['candidate.programming_languages'] = userDoc.programming_languages;
        if(userDoc.education_history) migrateUser['candidate.education_history'] = userDoc.education_history;
        if(userDoc.work_history) migrateUser['candidate.work_history'] = userDoc.work_history;
        if(userDoc.description) migrateUser['candidate.description'] = userDoc.description;

        console.log("Migrate input data: " + migrateUser );
        await Users.update({ _id: userDoc._creator },{ $set: migrateUser });
        totalModified++;


    });

    console.log('Total modified document: ' + totalModified);


}

module.exports.down = async function() {

}