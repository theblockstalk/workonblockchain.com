const Users = require('../model/mongoose/users');
const candidateProfile = require('../model/mongoose/candidate');
const Referral = require('../model/referrals');
const mongoose = require('mongoose');
const logger = require('../controller/services/logger');

let totalDocsToProcess, totalModified = 0, totalProcessed = 0;
module.exports.up = async function() {
    totalDocsToProcess =await candidateProfile.count({});
    logger.debug(totalDocsToProcess);
    await candidateProfile.findAndIterate({}, async function(candidateDoc) {
        totalProcessed++;
        logger.debug("candidate document: ", candidateDoc);
       let migrateUser ={};
        if(candidateDoc.terms_id) migrateUser['candidate.terms_id'] = candidateDoc.terms_id;
        if(candidateDoc.marketing_emails)  migrateUser['marketing_emails'] = candidateDoc.marketing_emails;
        if(candidateDoc.first_name) migrateUser['first_name'] = candidateDoc.first_name;
        if(candidateDoc.last_name) migrateUser['last_name'] = candidateDoc.last_name;
        if(candidateDoc.github_account) migrateUser['candidate.github_account'] = candidateDoc.github_account;
        if(candidateDoc.stackexchange_account)  migrateUser['candidate.stackexchange_account'] = candidateDoc.stackexchange_account;
        if(candidateDoc.contact_number) migrateUser['contact_number'] = candidateDoc.contact_number;
        if(candidateDoc.nationality) migrateUser['nationality'] = candidateDoc.nationality;
        if(candidateDoc.image) migrateUser['image'] = candidateDoc.image;
        if(candidateDoc.locations) migrateUser['candidate.locations'] = candidateDoc.locations;
        if(candidateDoc.roles) migrateUser['candidate.roles'] = candidateDoc.roles;
        if(candidateDoc.expected_salary_currency) migrateUser['candidate.expected_salary_currency'] = candidateDoc.expected_salary_currency;
        if(candidateDoc.expected_salary) migrateUser['candidate.expected_salary'] = candidateDoc.expected_salary;
        if(candidateDoc.interest_area) migrateUser['candidate.interest_areas'] = candidateDoc.interest_area;
        if(candidateDoc.availability_day) migrateUser['candidate.availability_day'] = candidateDoc.availability_day;
        if(candidateDoc.why_work) migrateUser['candidate.why_work'] = candidateDoc.why_work;
        if(candidateDoc.commercial_platform) {
            let commercialPlatformsObject = [];
            for(let platform of candidateDoc.commercial_platform) {
                let commercialPlatformInput = {
                    name: platform.platform_name,
                    exp_year: platform.exp_year
                }

                commercialPlatformsObject.push(commercialPlatformInput);
            }
            migrateUser['candidate.blockchain.commercial_platforms'] = commercialPlatformsObject;
        }
        if(candidateDoc.experimented_platform) {
            let experimentedPlatformObject = [];
            for(let experimented of userDoc.experimented_platform ) {
                experimentedPlatformObject.push(experimented.value);
            }
            migrateUser['candidate.blockchain.experimented_platforms'] = experimentedPlatformObject;
        }
        if(candidateDoc.platforms) {
            let platformsObject = [];
            for(let platform of candidateDoc.platforms) {
                let platformsInput = {
                    name: platform.platform_name,
                    exp_year: platform.exp_year
                }

                platformsObject.push(platformsInput);
            }
            migrateUser['candidate.blockchain.smart_contract_platforms'] = platformsObject;
        }
        if(candidateDoc.current_currency) migrateUser['candidate.current_currency'] = candidateDoc.current_currency;
        if(candidateDoc.current_salary) migrateUser['candidate.current_salary'] = candidateDoc.current_salary;
        if(candidateDoc.programming_languages) migrateUser['candidate.programming_languages'] = candidateDoc.programming_languages;
        if(candidateDoc.education_history) migrateUser['candidate.education_history'] = candidateDoc.education_history;
        if(candidateDoc.work_history) migrateUser['candidate.work_history'] = candidateDoc.work_history;
        if(candidateDoc.description) migrateUser['candidate.description'] = candidateDoc.description;

        logger.debug("migrate user doc: ", migrateUser);
        const update = await Users.update({ _id: candidateDoc._creator },{ $set: migrateUser });
        if (update && update.nModified) {
            totalModified++;
            candidateProfile.deleteOne({_id: candidateDoc._id})
        }

    });

    console.log('Total candidate document to process: ' + totalProcessed);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);
}

module.exports.down = async function() {
    totalDocsToProcess =await Users.count({type:'candidate'});
    logger.debug(totalDocsToProcess);
    await Users.findAndIterate({type: 'candidate'}, async function(userDoc) {
        totalProcessed++;
        logger.debug("candidate document: ", userDoc);
        let migrateUser ={};
        if(userDoc.marketing_emails)  migrateUser['marketing_emails'] = userDoc.marketing_emails;
        if(userDoc.first_name) migrateUser['first_name'] = userDoc.first_name;
        if(userDoc.last_name) migrateUser['last_name'] = userDoc.last_name;
         if(userDoc.contact_number) migrateUser['contact_number'] = userDoc.contact_number;
        if(userDoc.nationality) migrateUser['nationality'] = userDoc.nationality;
        if(userDoc.image) migrateUser['image'] = userDoc.image;
          if(userDoc.candidate){
            if(userDoc.candidate.terms_id) migrateUser['terms_id'] = userDoc.candidate.terms_id;
            if(userDoc.candidate.github_account) migrateUser['github_account'] = userDoc.candidate.github_account;
            if(userDoc.candidate.stackexchange_account)  migrateUser['stackexchange_account'] = userDoc.candidate.stackexchange_account;
            if(userDoc.candidate.locations) migrateUser['locations'] = userDoc.candidate.locations;
            if(userDoc.candidate.roles) {
                let roles = [];
                for( let roleValue of userDoc.candidate.roles) {
                    if(roleValue === 'Researcher ') {
                        roles.push('Researcher');

                    }
                    else {
                        roles.push(roleValue);
                    }
                }
                migrateUser['roles'] = roles;

            }
            if(userDoc.candidate.expected_salary_currency) migrateUser['expected_salary_currency'] = userDoc.candidate.expected_salary_currency;
            if(userDoc.candidate.expected_salary) migrateUser['expected_salary'] = userDoc.candidate.expected_salary;
            if(userDoc.candidate.interest_areas) migrateUser['interest_area'] = userDoc.candidate.interest_areas;
            if(userDoc.candidate.availability_day) migrateUser['availability_day'] = userDoc.candidate.availability_day;
            if(userDoc.candidate.why_work) migrateUser['why_work'] = userDoc.candidate.why_work;
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
                }
            }

              if(userDoc.candidate.current_currency) {

                  if(userDoc.candidate.current_currency === "-1") {
                      migrateUser['current_currency'] = "";
                  }
                  else {
                      migrateUser['current_currency'] = userDoc.candidate.current_currency;
                  }

              }
              if(userDoc.candidate.current_salary) {
                  if(userDoc.candidate.current_salary === -1) {
                      migrateUser['current_salary'] = 0;
                  }
                  else {
                      migrateUser['current_salary'] = userDoc.candidate.current_salary;
                  }
              }
              if(userDoc.candidate.programming_languages) migrateUser['programming_languages'] = userDoc.candidate.programming_languages;
              if(userDoc.candidate.education_history) migrateUser['education_history'] = userDoc.candidate.education_history;
              if(userDoc.candidate.work_history) migrateUser['work_history'] = userDoc.candidate.work_history;
              if(userDoc.candidate.description) migrateUser['description'] = userDoc.candidate.description;

          }

        logger.debug("migrate user doc: ", migrateUser);
        const update = await candidateProfile.update({ _creator: userDoc._id },{ $set: migrateUser });
        if (update && update.nModified) {
            await Users.update({_id: userDoc._creator}, { $unset: ['terms_id', 'marketing_emails', 'first_name' , 'last_name', 'candidate.github_account',
                    'candidate.stackexchange_account' , 'contact_number' , 'nationality' , 'image' , 'candidate.locations' , 'candidate.roles' , 'candidate.expected_salary_currency' ,
                    'candidate.expected_salary' , 'candidate.interest_areas' , 'candidate.availability_day' , 'candidate.why_work' , 'candidate.blockchain.commercial_platforms' ,
                    'candidate.blockchain.experimented_platform' , 'candidate.blockchain.smart_contract_platforms' , 'candidate.current_currency' , 'candidate.current_salary',
                    'candidate.programming_languages', 'candidate.education_history' , 'candidate.work_history' , 'candidate.description']})
            totalModified++;
        }

    });
    console.log('Total candidate document to process: ' + totalProcessed);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);

}