const users = require('../model/mongoose/users');
const candidateProfile = require('../model/mongoose/candidate');
const Referral = require('../model/referrals');
const mongoose = require('mongoose');
const logger = require('../controller/services/logger');

let totalDocsToProcess, totalModified = 0, totalProcessed = 0;
function isEmptyObject(obj) {
    for(let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}

function isReal(val) {
    if(val && val !== null && typeof val !== "undefined" && val !== "" && val !== -1) return true;
    return false;
}



module.exports.up = async function() {
    totalDocsToProcess =await candidateProfile.count({});
    logger.debug(totalDocsToProcess);
    await candidateProfile.findAndIterate({}, async function(candidateDoc) {
        totalProcessed++;
        logger.debug("candidate document: ", candidateDoc);
        let unset = {};
        let set = {};
        if(isReal(candidateDoc.terms_id)) set['candidate.terms_id'] = candidateDoc.terms_id;

        if(candidateDoc.marketing_emails) set['marketing_emails'] = candidateDoc.marketing_emails;

        if(candidateDoc.first_name) set['first_name'] = candidateDoc.first_name;

        if(candidateDoc.last_name) set['last_name'] = candidateDoc.last_name;

        if(candidateDoc.github_account) set['candidate.github_account'] = candidateDoc.github_account;
        else unset['candidate.github_account'] = 1;

        if(candidateDoc.stackexchange_account) set['candidate.stackexchange_account'] = candidateDoc.stackexchange_account;
        else unset['candidate.stackexchange_account'] = 1;

        if(candidateDoc.contact_number) set['contact_number'] = candidateDoc.contact_number;

        if(candidateDoc.nationality) set['nationality'] = candidateDoc.nationality;

        if(candidateDoc.image) set['image'] = candidateDoc.image;

        if(candidateDoc.locations && candidateDoc.locations.length >0) set['candidate.locations'] = candidateDoc.locations;

        if(candidateDoc.roles && candidateDoc.roles.length > 0) {
            let roles = [];
            for (let roleValue of candidateDoc.roles ) {
                if(roleValue === 'Researcher ') roles.push('Researcher');
                else roles.push(roleValue);
            }

            set['candidate.roles'] = roles;
        }

        if(candidateDoc.expected_salary_currency && candidateDoc.expected_salary_currency !== "") set['candidate.expected_salary_currency'] = candidateDoc.expected_salary_currency;

        if(isReal(parseInt(candidateDoc.expected_salary))) set['candidate.expected_salary'] = candidateDoc.expected_salary;

        if(candidateDoc.interest_area && candidateDoc.interest_area.length > 0) {
            let interestedArea = [];
            for(let area of candidateDoc.interest_area) {
                if(area === "I don’t know") interestedArea.push("I don't know");
                else interestedArea.push(area);
            }
            set['candidate.interest_areas'] = interestedArea;
        }

        if(candidateDoc.availability_day && candidateDoc.availability_day !== "" ) set['candidate.availability_day'] = candidateDoc.availability_day;

        if(candidateDoc.why_work) set['candidate.why_work'] = candidateDoc.why_work;

        if(candidateDoc.commercial_platform && candidateDoc.commercial_platform.length >0 ) {
            let commercialPlatformsObject = [];
            for(let platform of candidateDoc.commercial_platform) {
                let commercialPlatformInput = {
                    name: platform.platform_name,
                    exp_year: platform.exp_year
                }

                commercialPlatformsObject.push(commercialPlatformInput);
            }
            set['candidate.blockchain.commercial_platforms'] = commercialPlatformsObject;
        }
        else unset['candidate.blockchain.commercial_platforms'] = 1;

        if(candidateDoc.experimented_platform && candidateDoc.experimented_platform.length > 0) {
            let experimentedPlatformObject = [];
            for(let experimented of candidateDoc.experimented_platform ) {
                experimentedPlatformObject.push(experimented.value);
            }
            set['candidate.blockchain.experimented_platforms'] = experimentedPlatformObject;
        }
        else unset['candidate.blockchain.experimented_platforms'] = 1;

        if(candidateDoc.platforms && candidateDoc.platforms.length > 0 ) {
            let platformsObject = [];
            for(let platform of candidateDoc.platforms) {
                let platformsInput = {
                    name: platform.platform_name,
                    exp_year: platform.exp_year
                }

                platformsObject.push(platformsInput);
            }
            set['candidate.blockchain.smart_contract_platforms'] = platformsObject;
        }
        else unset['candidate.blockchain.smart_contract_platforms'] = 1;

        if(candidateDoc.current_currency) {
            if(candidateDoc.current_currency === '' || candidateDoc.current_currency === -1) {
                set['candidate.current_currency'] = candidateDoc.current_currency;
            }
        }
        else unset['candidate.current_currency'] =1;


        if(isReal(parseInt(candidateDoc.current_salary))) set['candidate.current_salary'] = candidateDoc.current_salary;
        else unset['candidate.current_salary'] = 1;

        if(candidateDoc.programming_languages && candidateDoc.programming_languages.length > 0)  set['candidate.programming_languages'] = candidateDoc.programming_languages;
        else unset['candidate.programming_languages'] = 1;

        if(candidateDoc.education_history && candidateDoc.education_history.length > 0  ) {
            let educationHistory = [];
            for (let education of candidateDoc.education_history) {
                if(education.uniname === "") education.uniname = "other";
                if(education.degreename === "") education.degreename = "other";
                if(education.fieldname === "") education.fieldname = "other";
                educationHistory.push(education);
            }
            set['candidate.education_history'] = educationHistory;
        }

        else unset['candidate.education_history'] = 1;

        if(candidateDoc.work_history && candidateDoc.work_history.length > 0) {
            let workHistory = [];
            for (let work of candidateDoc.work_history) {
                if(work.companyname === "") work.companyname = "other";
                if(work.positionname === "") work.positionname = "other";
                if(work.locationname === "") work.locationname = "other";
                workHistory.push(work);
            }
            set['candidate.work_history'] = workHistory;
        }
        else unset['candidate.work_history'] =1;

        if(candidateDoc.description) set['candidate.description'] = candidateDoc.description;

        let updateObj;
        if (!isEmptyObject(set) && !isEmptyObject(unset)) {
            updateObj = {$set: set, $unset: unset}
        } else if (!isEmptyObject(set)) {
            updateObj = {$set: set};
        } else if (!isEmptyObject(unset)) {
            updateObj = {$unset: unset};
        }

        if (updateObj) {
            logger.debug("migrate user doc: ", set);
            await users.update({ _id: candidateDoc._creator }, updateObj);
            await candidateProfile.deleteOne({_id: candidateDoc._id});
            totalModified++;
        }

    });

    console.log('Total candidate document to process: ' + totalProcessed);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);
}

module.exports.down = async function() {
    totalDocsToProcess =await users.count({type:'candidate'});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({type: 'candidate'}, async function(userDoc) {
        totalProcessed++;
        logger.debug("candidate document: ", userDoc);
        let migrateUser ={};
        let unset = {};
        if(userDoc._id) migrateUser['_creator'] = userDoc._id;
        if(userDoc.marketing_emails)  migrateUser['marketing_emails'] = userDoc.marketing_emails;
        if(userDoc.first_name) {
            migrateUser['first_name'] = userDoc.first_name;
            unset['first_name'] = 1;
        }
        if(userDoc.last_name)  {
            migrateUser['last_name'] = userDoc.last_name;
            unset['last_name'] = 1;
        }
        if(userDoc.contact_number) {
            migrateUser['contact_number'] = userDoc.contact_number;
            unset['contact_number'] = 1;
        }
        if(userDoc.nationality) {
            migrateUser['nationality'] = userDoc.nationality;
            unset['nationality'] = 1;
        }
        if(userDoc.image) migrateUser['image'] = userDoc.image;

        if(userDoc.candidate){
            if(userDoc.candidate.terms_id) {
                migrateUser['terms_id'] = userDoc.candidate.terms_id;
                unset['terms_id'] = 1;
            }
            if(userDoc.candidate.github_account) {
                migrateUser['github_account'] = userDoc.candidate.github_account;
                unset['candidate.github_account'] = 1;
            }
            if(userDoc.candidate.stackexchange_account)  {
                migrateUser['stackexchange_account'] = userDoc.candidate.stackexchange_account;
                unset['candidate.stackexchange_account'] = 1;
            }
            if(userDoc.candidate.locations) {
                migrateUser['locations'] = userDoc.candidate.locations;
                unset['candidate.locations'] = 1;
            }
            if(userDoc.candidate.roles) {
                migrateUser['roles'] = userDoc.candidate.roles;
                unset['candidate.roles'] = 1;
            }
            if(userDoc.candidate.expected_salary_currency) {
                migrateUser['expected_salary_currency'] = userDoc.candidate.expected_salary_currency;
                unset['candidate.expected_salary_currency'] = 1;
            }
            if(userDoc.candidate.expected_salary) {
                migrateUser['expected_salary'] = userDoc.candidate.expected_salary;
                unset['candidate.expected_salary'] = 1;
            }
            if(userDoc.candidate.interest_areas) {
                migrateUser['interest_area'] = userDoc.candidate.interest_areas;
                unset['candidate.interest_areas'] = 1;
            }
            if(userDoc.candidate.availability_day) {
                migrateUser['availability_day'] = userDoc.candidate.availability_day;
                unset['candidate.availability_day'] = 1;
            }
            if(userDoc.candidate.why_work) {
                migrateUser['why_work'] = userDoc.candidate.why_work;
                unset['candidate.why_work'] = 1;
            }
            if(userDoc.candidate.blockchain) {
                if(userDoc.candidate.blockchain.commercial_platforms) {
                    let commercialPlatformsObject = [];
                    let commercialPlatformInput={}
                    for(let platform of userDoc.candidate.blockchain.commercial_platforms) {
                        if(platform.name === 'Steem') {
                            commercialPlatformInput = {
                                platform_name: 'Steemit',
                                exp_year: platform.exp_year
                            }
                        }
                        else {
                            commercialPlatformInput = {
                                platform_name: platform.name,
                                exp_year: platform.exp_year
                            }
                        }

                        commercialPlatformsObject.push(commercialPlatformInput);
                    }
                    migrateUser['commercial_platform'] = commercialPlatformsObject;
                    unset['candidate.blockchain.commercial_platforms'] = 1;

                }
                if(userDoc.candidate.blockchain.experimented_platforms) {
                    let experimentedPlatformsObject = [];
                    let experimentedPlatformInput={}
                    for(let platform of userDoc.candidate.blockchain.experimented_platforms) {
                        if(platform.value === 'Steem') {
                            experimentedPlatformInput = {
                                value: 'Steemit',
                                name: 'Steemit',
                                checked: true
                            }
                        }
                        else {
                            experimentedPlatformInput = {
                                value: 'Steemit',
                                name: 'Steemit',
                                checked: true
                            }
                        }

                        experimentedPlatformsObject.push(experimentedPlatformInput);
                    }
                    migrateUser['experimented_platform'] = experimentedPlatformsObject;
                    unset['candidate.blockchain.experimented_platforms'] = 1;
                }
                if(userDoc.candidate.blockchain.smart_contract_platforms) {
                    let platformsObject = [];
                    for(let platform of userDoc.candidate.blockchain.smart_contract_platforms) {
                        let platformsInput = {
                            platform_name: platform.name,
                            exp_year: platform.exp_year
                        }

                        platformsObject.push(platformsInput);
                    }
                    migrateUser['platforms'] = platformsObject;
                    unset['candidate.blockchain.smart_contract_platforms'] = 1;
                }

            }

            if(userDoc.candidate.current_currency) {
                migrateUser['current_currency'] = userDoc.candidate.current_currency;
                unset['candidate.current_currency'] = 1;
            }
            if(userDoc.candidate.current_salary) {
                migrateUser['current_salary'] = userDoc.candidate.current_salary;
                unset['candidate.current_salary'] = 1;
            }
            if(userDoc.candidate.programming_languages) {
                migrateUser['programming_languages'] = userDoc.candidate.programming_languages;
                unset['candidate.programming_languages'] = 1;
            }
            if(userDoc.candidate.education_history) {
                migrateUser['education_history'] = userDoc.candidate.education_history;
                unset['candidate.education_history'] = 1;
            }
            if(userDoc.candidate.work_history) {
                migrateUser['work_history'] = userDoc.candidate.work_history;
                unset['candidate.work_history'] = 1;
            }
            if(userDoc.candidate.description) {
                migrateUser['description'] = userDoc.candidate.description;
                unset['candidate.description'] = 1;
            }

        }

        logger.debug("migrate user doc: ", migrateUser);
        const data = await candidateProfile.insert(migrateUser);
        await users.update({_id: userDoc._id}, { $unset: unset});
        totalModified++;

    });
    console.log('Total candidate document to process: ' + totalProcessed);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);

}