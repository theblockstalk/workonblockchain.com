const auth = require('../../../middleware/auth-v2');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');
const users = require('../../../../model/mongoose/users');
const filterReturnData = require('../filterReturnData');
const objects = require('../../../services/objects');

module.exports.request = {
    type: 'patch',
    path: '/users/candidates'
};

const querySchema = new Schema({
    admin: Boolean,
    user_id: String
});

const bodySchema = new Schema({
    first_name: String,
    last_name: String,
    contact_number: String,
    nationality: [{
        type: String,
        enum: enumerations.nationalities
    }],
    image: {
        type: String,
        validate: regexes.url
    },
    hear_about_wob:{
        type: String,
        enum: enumerations.hearAboutWob
    },
    hear_about_wob_other_info: String,
    candidate: {
        job_activity_status:{
            new_work_opportunities: {
                type: String,
                enum: enumerations.jobActivityStatus
            },
            currently_employed:{
                type:String,
                enum: ['Yes','No']
            },
            leaving_current_employ_reasons:{
                type: [{
                    type: String,
                    enum: enumerations.leavingCurrentEmployReasons
                }]
            },
            other_reasons:{
                type: String
            },
            counter_offer:{
                type:String,
                enum: ['Yes','No']
            }
        },
        base_city: String,
        base_country: {
            type: String,
            enum: enumerations.countries
        },
        github_account: {
            type:String,
            validate: regexes.url
        },
        stackexchange_account: {
            type:String,
            validate: regexes.url
        },
        linkedin_account: {
            type:String,
            validate: regexes.url
        },
        medium_account: {
            type:String,
            validate: regexes.url
        },
        stackoverflow_url: {
            type:String,
            validate: regexes.url
        },
        personal_website_url: {
            type:String,
            validate: regexes.url
        },
        employee: {
            employment_type :  [{
                type : String,
                enum: enumerations.employmentTypes
            }],
            expected_annual_salary: {
                type: Number,
                min:0
            },
            currency : {
                type: String,
                enum: enumerations.currencies
            },
            location: [{
                city: {
                    type : String,
                    // ref: 'Cities'
                },
                country: enumerations.countries,
                remote: Boolean,
                visa_needed: {
                    type: Boolean,
                    required: true,
                }
            }],
            roles: [{
                type: String,
                enum: enumerations.workRoles
            }],
            employment_availability: {
                type:String,
                enum: enumerations.workAvailability
            }
        },
        contractor: {
            expected_hourly_rate:  {
                type : Number,
                min:0,
            },
            currency: {
                type: String,
                enum: enumerations.currencies
            },
            max_hour_per_week : {
                type : Number,
                min:0,
            },
            location: [{
                city: {
                    type : Schema.Types.ObjectId,
                    ref: 'Cities'
                },
                country: enumerations.countries,
                remote: Boolean,
                visa_needed: {
                    type: Boolean,
                    required: true,
                }
            }],
            roles: [{
                type: String,
                enum: enumerations.workRoles

            }],
            contractor_type: [{
                type: String,
                enum: enumerations.contractorTypes
            }],
            agency_website: {
                type: String,
                validate: regexes.url
            },
            service_description: {
                type: String,
                maxlength: 3000
            }

        },
        volunteer: {
            location: [{
                city: {
                    type : Schema.Types.ObjectId,
                    ref: 'Cities'
                },
                country: enumerations.countries,
                remote: Boolean,
                visa_needed: {
                    type: Boolean,
                    required: true,
                }
            }],
            roles: [{
                type: String,
                enum: enumerations.workRoles
            }],
            max_hours_per_week: {
                type: Number,
                min: 0
            },
            learning_objectives: {
                type: String,
                maxlength: 3000

            }

        },
        current_currency: {
            type: String,
            enum: enumerations.currencies
        },
        current_salary: {
            type:Number,
            min: 0
        },
        why_work: String,
        programming_languages: [{
            language: {
                type: String,
                enum: enumerations.programmingLanguages
            },
            exp_year: {
                type: String,
                enum: enumerations.experienceYears
            }
        }],
        description: {
            type:String,
            maxlength: 3000
        },
        education_history: [{
            uniname: {
                type: String
            },
            degreename: {
                type: String
            },
            fieldname: {
                type: String
            },
            eduyear: Number
        }],
        work_history: [{
            companyname: {
                type: String
            },
            positionname: {
                type: String
            },
            locationname: {
                type: String
            },
            description: {
                type: String,
                maxlength: 3000
            },
            startdate: Date,
            enddate: Date,
            currentwork: {
                type: Boolean
            }
        }],
        interest_areas: [{
            type: String,
            enum: enumerations.workBlockchainInterests
        }],
        blockchain: {
            commercial_platforms: [{
                name: {
                    type: String,
                    enum: enumerations.blockchainPlatforms
                },
                exp_year: {
                    type: String,
                    enum: enumerations.experienceYears
                }

            }],
            description_commercial_platforms:{
                type: String
            },
            experimented_platforms: [{
                type: String,
                enum: enumerations.blockchainPlatforms
            }],
            description_experimented_platforms:{
                type: String
            },
            commercial_skills : [new Schema({
                skill: {
                    type: String,
                    enum: enumerations.otherSkills
                },
                exp_year: {
                    type: String,
                    enum: enumerations.exp_years
                }
            })],
            description_commercial_skills:{
                type: String
            },

        }

    },
    unset_commercial_platforms: Boolean,
    unset_experimented_platforms: Boolean,
    unset_commercial_skills: Boolean,
    unset_language: Boolean,
    unset_language: Boolean,
    unset_education_history: Boolean,
    unset_work_history: Boolean,
    unset_github_account: Boolean,
    unset_exchange_account: Boolean,
    unset_linkedin_account: Boolean,
    unset_medium_account: Boolean,
    unset_stackoverflow_url: Boolean,
    unset_personal_website_url: Boolean,
    unset_employee: Boolean,
    unset_contractor: Boolean,
    unset_volunteer: Boolean,
    unset_curret_currency: Boolean,
    wizardNum : {
        type: Number,
        enum: [1,2,3,4,5]
    },
    unset_currently_employed: Boolean,
    unset_leaving_current_employ_reasons: Boolean,
    unset_other_reasons: Boolean,
    unset_counter_offer: Boolean,
    unset_description_commercial_platforms: Boolean,
    unset_description_experimented_platforms: Boolean,
    unset_description_commercial_skills: Boolean
});

module.exports.inputValidation = {
    query: querySchema,
    body: bodySchema
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "image");
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if (req.query.admin) {
        await auth.isAdmin(req);
    }
    else {
        await auth.isCandidateType(req);
    }
}


module.exports.endpoint = async function (req, res) {
    let userId;
    let queryBody;
    let blockchainQuery,blockChainCheck = 0;
    let updateCandidateUser = {};
    let userDoc;
    let unset = {};

    if (req.query.admin) {
        userId = req.query.user_id;
        userDoc = await users.findOneById(userId);
    }
    else {
        userId = req.auth.user._id;
        userDoc = req.auth.user;
    }

    if(req.file && req.file.path) {
        updateCandidateUser.image = req.file.path;
    }
    else {
        queryBody = req.body;
        let candidateQuery = queryBody.candidate;
        if(candidateQuery.blockchain && !objects.isEmpty(candidateQuery.blockchain)) {
            blockChainCheck = 1;
            blockchainQuery = candidateQuery.blockchain;
        }

        if (queryBody.first_name) updateCandidateUser.first_name = queryBody.first_name;
        if (queryBody.last_name) updateCandidateUser.last_name = queryBody.last_name;
        if (queryBody.contact_number) updateCandidateUser.contact_number = queryBody.contact_number;
        if (queryBody.nationality) updateCandidateUser.nationality = queryBody.nationality;
        if (candidateQuery.base_city) updateCandidateUser['candidate.base_city'] = candidateQuery.base_city;
        if (candidateQuery.base_country) updateCandidateUser['candidate.base_country'] = candidateQuery.base_country;
        if (queryBody.hear_about_wob) updateCandidateUser.hear_about_wob = queryBody.hear_about_wob;
        if (queryBody.hear_about_wob_other_info) updateCandidateUser.hear_about_wob_other_info = queryBody.hear_about_wob_other_info;

        if (candidateQuery.current_currency && candidateQuery.current_currency !== "-1") {
            updateCandidateUser['candidate.current_currency'] = candidateQuery.current_currency;
        }
        else unset['candidate.current_currency'] = 1;

        if (candidateQuery.current_salary) updateCandidateUser['candidate.current_salary'] = candidateQuery.current_salary;
        else unset['candidate.current_salary'] = 1;

        if(queryBody.unset_employee) unset['candidate.employee'] = 1;
        else {
            if(candidateQuery.employee) {
                for(let loc of candidateQuery.employee.location) {
                    if(loc.city) {
                        const index = candidateQuery.employee.location.findIndex((obj => obj.city === loc.city));
                        candidateQuery.employee.location[index].city = mongoose.Types.ObjectId(loc.city);
                    }
                }
                updateCandidateUser['candidate.employee'] = candidateQuery.employee;
            }
        }

        if(queryBody.unset_contractor) unset['candidate.contractor'] = 1;
        else {
            if(candidateQuery.contractor) {
                for(let loc of candidateQuery.contractor.location) {
                    if(loc.city) {
                        const index = candidateQuery.contractor.location.findIndex((obj => obj.city === loc.city));
                        candidateQuery.contractor.location[index].city = mongoose.Types.ObjectId(loc.city);
                    }
                }
                updateCandidateUser['candidate.contractor'] = candidateQuery.contractor;
            }
        }

        if(queryBody.unset_volunteer) unset['candidate.volunteer'] = 1;
        else {
            if(candidateQuery.volunteer) {
                for(let loc of candidateQuery.volunteer.location) {
                    if(loc.city) {
                        const index = candidateQuery.volunteer.location.findIndex((obj => obj.city === loc.city));
                        candidateQuery.volunteer.location[index].city = mongoose.Types.ObjectId(loc.city);
                    }
                }
                updateCandidateUser['candidate.volunteer'] = candidateQuery.volunteer;
            }
        }

        if (candidateQuery.why_work) updateCandidateUser['candidate.why_work'] = candidateQuery.why_work;
        if (candidateQuery.description) updateCandidateUser['candidate.description'] = candidateQuery.description;

        if (queryBody.unset_education_history) unset['candidate.education_history'] = 1;
        else{
            if (candidateQuery.education_history && candidateQuery.education_history.length > 0) {
                updateCandidateUser['candidate.education_history'] = candidateQuery.education_history;
            }
        }

        if(queryBody.unset_work_history) unset['candidate.work_history'] = 1;
        else{
            if (candidateQuery.work_history && candidateQuery.work_history.length > 0) {
                updateCandidateUser['candidate.work_history'] = candidateQuery.work_history;
            }
        }

        if(candidateQuery.job_activity_status) {
            let job_activity_status = candidateQuery.job_activity_status;
            if (job_activity_status.new_work_opportunities) updateCandidateUser['candidate.job_activity_status.new_work_opportunities'] = job_activity_status.new_work_opportunities;

            if(queryBody.unset_currently_employed) unset['candidate.job_activity_status.currently_employed'] = 1;
            else{
                if (job_activity_status.currently_employed) updateCandidateUser['candidate.job_activity_status.currently_employed'] = job_activity_status.currently_employed;
            }

            if(queryBody.unset_leaving_current_employ_reasons) unset['candidate.job_activity_status.leaving_current_employ_reasons'] = 1;
            else{
                if (job_activity_status.leaving_current_employ_reasons) updateCandidateUser['candidate.job_activity_status.leaving_current_employ_reasons'] = job_activity_status.leaving_current_employ_reasons;
            }

            if(queryBody.unset_other_reasons) unset['candidate.job_activity_status.other_reasons'] = 1;
            else{
                if (job_activity_status.other_reasons) updateCandidateUser['candidate.job_activity_status.other_reasons'] = job_activity_status.other_reasons;
            }

            if(queryBody.unset_counter_offer) unset['candidate.job_activity_status.counter_offer'] = 1;
            else{
                if (job_activity_status.counter_offer) updateCandidateUser['candidate.job_activity_status.counter_offer'] = job_activity_status.counter_offer;
            }
        }

        if (candidateQuery.interest_areas) updateCandidateUser['candidate.interest_areas'] = candidateQuery.interest_areas;

        if (queryBody.unset_curret_currency) {
            unset['candidate.current_currency'] = 1;
            unset['candidate.current_salary'] = 1;
        }
        else{
            if (candidateQuery.current_currency && candidateQuery.current_salary) {
                updateCandidateUser['candidate.current_currency'] = candidateQuery.current_currency;
                updateCandidateUser['candidate.current_salary'] = candidateQuery.current_salary;
            }
        }

        if (queryBody.unset_commercial_platforms) {
            unset['candidate.blockchain.commercial_platforms'] = 1;
            unset['candidate.blockchain.description_commercial_platforms'] = 1;
        } else {
            if (blockChainCheck && blockchainQuery.commercial_platforms && blockchainQuery.commercial_platforms.length > 0) {
                updateCandidateUser['candidate.blockchain.commercial_platforms'] = blockchainQuery.commercial_platforms;
                if(queryBody.unset_description_commercial_platforms) unset['candidate.blockchain.description_commercial_platforms'] = 1;
                if(blockchainQuery.description_commercial_platforms) updateCandidateUser['candidate.blockchain.description_commercial_platforms'] = blockchainQuery.description_commercial_platforms;
            }
        }

        if (queryBody.unset_experimented_platforms) {
            unset['candidate.blockchain.experimented_platforms'] = 1;
            unset['candidate.blockchain.description_experimented_platforms'] = 1;
        } else {
            if (blockChainCheck && blockchainQuery.experimented_platforms && blockchainQuery.experimented_platforms.length > 0) {
                updateCandidateUser['candidate.blockchain.experimented_platforms'] = blockchainQuery.experimented_platforms;
                if(queryBody.unset_description_experimented_platforms) unset['candidate.blockchain.description_experimented_platforms'] = 1;
                if(blockchainQuery.description_experimented_platforms) updateCandidateUser['candidate.blockchain.description_experimented_platforms'] = blockchainQuery.description_experimented_platforms;
            }
        }

        if (queryBody.unset_commercial_skills) {
            unset['candidate.blockchain.commercial_skills'] = 1;
            unset['candidate.blockchain.description_commercial_skills'] = 1;
        } else {
            if (blockChainCheck && blockchainQuery.commercial_skills && blockchainQuery.commercial_skills.length > 0) {
                updateCandidateUser['candidate.blockchain.commercial_skills'] = blockchainQuery.commercial_skills;
                if(queryBody.unset_description_commercial_skills) unset['candidate.blockchain.description_commercial_skills'] = 1;
                if(blockchainQuery.description_commercial_skills) updateCandidateUser['candidate.blockchain.description_commercial_skills'] = blockchainQuery.description_commercial_skills;
            }
        }
        if (queryBody.unset_language) {
            unset['candidate.programming_languages'] = 1;
        } else {
            if (candidateQuery.programming_languages && candidateQuery.programming_languages.length > 0) updateCandidateUser['candidate.programming_languages'] = candidateQuery.programming_languages;
        }

        if (queryBody.unset_education_history) {
            unset['candidate.education_history'] = 1;
        } else {
            if (candidateQuery.education_history && candidateQuery.education_history.length > 0) updateCandidateUser['candidate.education_history'] = candidateQuery.education_history;
        }

        if (queryBody.unset_work_history) {
            unset['candidate.work_history'] = 1;
        } else {
            if (candidateQuery.work_history && candidateQuery.work_history.length > 0) updateCandidateUser['candidate.work_history'] = candidateQuery.work_history;
        }

        if (queryBody.unset_github_account) {
            unset['candidate.github_account'] = 1;
        } else {
            if (candidateQuery.github_account) updateCandidateUser['candidate.github_account'] = candidateQuery.github_account;
        }

        if (queryBody.unset_exchange_account) {
            unset['candidate.stackexchange_account'] = 1;
        } else {
            if (candidateQuery.stackexchange_account) updateCandidateUser['candidate.stackexchange_account'] = candidateQuery.stackexchange_account;
        }

        if (queryBody.unset_linkedin_account) {
            unset['candidate.linkedin_account'] = 1;
        } else {
            if (candidateQuery.linkedin_account) updateCandidateUser['candidate.linkedin_account'] = candidateQuery.linkedin_account;
        }

        if (queryBody.unset_medium_account) {
            unset['candidate.medium_account'] = 1;
        } else {
            if (candidateQuery.medium_account) updateCandidateUser['candidate.medium_account'] = candidateQuery.medium_account;
        }
        if (queryBody.unset_stackoverflow_url) {
            unset['candidate.stackoverflow_url'] = 1;
        } else {
            if (candidateQuery.stackoverflow_url) updateCandidateUser['candidate.stackoverflow_url'] = candidateQuery.stackoverflow_url;
        }

        if (queryBody.unset_personal_website_url) {
            unset['candidate.personal_website_url'] = 1;
        } else {
            if (candidateQuery.personal_website_url) updateCandidateUser['candidate.personal_website_url'] = candidateQuery.personal_website_url;
        }
    }

    let timestamp = new Date();
    let history = {
        timestamp : timestamp
    }
    if(req.query.admin) {
        history.status = { status: 'updated by admin' };
    }
    else {
        const candidateHistory = userDoc.candidate.history;
            let wizardCompletedStatus = candidateHistory.filter(
                (history) => history.status && history.status.status === 'wizard completed'
        );

        if (wizardCompletedStatus.length === 0) {
            if(queryBody && queryBody.wizardNum === 5) history.status = { status: 'wizard completed' };
            else history.status = { status: 'wizard' };
        }
        else {
            history.status = { status: 'updated' };
        }
    }

    let latestStatus = objects.copyObject(history.status);
    latestStatus.timestamp = timestamp;
    updateCandidateUser['candidate.latest_status'] = latestStatus;

    let updateObj = {
        $push: {
            'candidate.history': {
                $each: [history],
                $position: 0
            }
        },
        $set : updateCandidateUser,
    }

    if(!objects.isEmpty(unset)){
        updateObj.$unset=  unset
    }

    await users.update({_id: userId}, updateObj);

    const filterData = filterReturnData.removeSensativeData(userDoc);
    res.send(filterData);
}