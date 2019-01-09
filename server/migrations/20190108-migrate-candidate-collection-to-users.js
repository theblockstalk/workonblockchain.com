const Users = require('../model/mongoose/users');
const candidateProfile = require('../model/mongoose/candidate');
const Referral = require('../model/referrals');
const mongoose = require('mongoose');
const logger = require('../controller/services/logger');

let totalDocsToProcess, totalModified = 0, totalProcessed = 0;
module.exports.up = async function() {
    totalDocsToProcess =await candidateProfile.count({});
    logger.debug(totalDocsToProcess);
    await candidateProfile.findAndIterate({}, async function(userDoc) {
        totalProcessed++;
        logger.debug("candidate document: ", userDoc);
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
                    exp_year: platform.exp_year
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
                    exp_year: platform.exp_year
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

        logger.debug("migrate user doc: ", migrateUser);
        const update = await Users.update({ _id: userDoc._creator },{ $set: migrateUser });
        if (update && update.nModified) totalModified++;

    });

    console.log('Total candidate document to process: ' + totalProcessed);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);
}

module.exports.down = async function() {
    totalDocsToProcess =await Users.count({type:'candidate'});
    logger.debug(totalDocsToProcess);
    await Users.findAndIterate({type: 'candidate'}, async function(candidateDoc) {
        totalProcessed++;
        logger.debug("candidate document: ", candidateDoc);
        let migrateUser ={};
        if(candidateDoc.marketing_emails)  migrateUser['marketing_emails'] = candidateDoc.marketing_emails;
        if(candidateDoc.first_name) migrateUser['first_name'] = candidateDoc.first_name;
        if(candidateDoc.last_name) migrateUser['last_name'] = candidateDoc.last_name;
         if(candidateDoc.contact_number) migrateUser['contact_number'] = candidateDoc.contact_number;
        if(candidateDoc.nationality) migrateUser['nationality'] = candidateDoc.nationality;
        if(candidateDoc.image) migrateUser['image'] = candidateDoc.image;
          if(candidateDoc.candidate){
            if(candidateDoc.candidate.terms_id) migrateUser['terms_id'] = candidateDoc.candidate.terms_id;
            if(candidateDoc.candidate.github_account) migrateUser['github_account'] = candidateDoc.candidate.github_account;
            if(candidateDoc.candidate.stackexchange_account)  migrateUser['stackexchange_account'] = candidateDoc.candidate.stackexchange_account;
            if(candidateDoc.candidate.locations) migrateUser['locations'] = candidateDoc.candidate.locations;
            if(candidateDoc.candidate.roles) {
                let roles = [];
                for( let roleValue of candidateDoc.candidate.roles) {
                    if(roleValue === 'Researcher ') {
                        roles.push('Researcher');

                    }
                    else {
                        roles.push(roleValue);
                    }
                }
                migrateUser['roles'] = roles;

            }
            if(candidateDoc.candidate.expected_salary_currency) migrateUser['expected_salary_currency'] = candidateDoc.candidate.expected_salary_currency;
            if(candidateDoc.candidate.expected_salary) migrateUser['expected_salary'] = candidateDoc.candidate.expected_salary;
            if(candidateDoc.candidate.interest_areas) migrateUser['interest_area'] = candidateDoc.candidate.interest_areas;
            if(candidateDoc.candidate.availability_day) migrateUser['availability_day'] = candidateDoc.candidate.availability_day;
            if(candidateDoc.candidate.why_work) migrateUser['why_work'] = candidateDoc.candidate.why_work;
            if(candidateDoc.candidate.blockchain) {
                if(candidateDoc.candidate.blockchain.commercial_platforms) {
                    let commercialPlatformsObject = [];
                    let commercialPlatformInput={}
                    for(let platform of candidateDoc.candidate.blockchain.commercial_platforms) {
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
                }
                if(candidateDoc.candidate.blockchain.experimented_platforms) {
                    let experimentedPlatformsObject = [];
                    let experimentedPlatformInput={}
                    for(let platform of candidateDoc.candidate.blockchain.experimented_platforms) {
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
                }
                if(candidateDoc.candidate.blockchain.smart_contract_platforms) {
                    let platformsObject = [];
                    for(let platform of candidateDoc.candidate.blockchain.smart_contract_platforms) {
                        let platformsInput = {
                            platform_name: platform.name,
                            exp_year: platform.exp_year
                        }

                        platformsObject.push(platformsInput);
                    }
                    migrateUser['platforms'] = platformsObject;
                }
            }

              if(candidateDoc.candidate.current_currency) {

                  if(candidateDoc.candidate.current_currency === "-1") {
                      migrateUser['current_currency'] = "";
                  }
                  else {
                      migrateUser['current_currency'] = candidateDoc.candidate.current_currency;
                  }

              }
              if(candidateDoc.candidate.current_salary) {
                  if(candidateDoc.candidate.current_salary === -1) {
                      migrateUser['current_salary'] = 0;
                  }
                  else {
                      migrateUser['current_salary'] = candidateDoc.candidate.current_salary;
                  }
              }
              if(candidateDoc.candidate.programming_languages) migrateUser['programming_languages'] = candidateDoc.candidate.programming_languages;
              if(candidateDoc.candidate.education_history) migrateUser['education_history'] = candidateDoc.candidate.education_history;
              if(candidateDoc.candidate.work_history) migrateUser['work_history'] = candidateDoc.candidate.work_history;
              if(candidateDoc.candidate.description) migrateUser['description'] = candidateDoc.candidate.description;

          }

        logger.debug("migrate user doc: ", migrateUser);
        const update = await candidateProfile.update({ _creator: candidateDoc._id },{ $set: migrateUser });
        if (update && update.nModified) totalModified++;

    });
    console.log('Total candidate document to process: ' + totalProcessed);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);

}