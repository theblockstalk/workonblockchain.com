const auth = require('../../../middleware/auth-v2');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');
const errors = require('../../../services/errors');

const users = require('../../../../model/mongoose/users');
const filterReturnData = require('../../../api/users/filterReturnData');
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
    nationality: {
        type: [{
            type: String,
            enum: enumerations.nationalities
        }]
    },
    image: {
        type: String,
        validate: regexes.url
    },
    candidate: {
        type: {
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
                type: {
                    employment_type :  {
                        type : String,
                        enum: enumerations.employmentTypes
                    },
                    expected_annual_salary: {
                        type: Number,
                        min:0
                    },
                    currency : {
                        type: String,
                        enum: enumerations.currencies
                    },
                    location: {
                        type: [{
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
                        }
                        ]
                    },
                    roles: {
                        type: [{
                            type: String,
                            enum: enumerations.workRoles
                        }]
                    },
                    employment_availability: {
                        type:String,
                        enum: enumerations.workAvailability
                    }
                }
            },
            contractor: {
                type: {
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
                    location: {
                        type: [{
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
                        }]
                    },
                    roles: {
                        type: [{
                            type: String,
                            enum: enumerations.workRoles
                        }]
                    },
                    contractor_type: {
                        type: String,
                        enum: enumerations.contractorTypes
                    },
                    agency_website: {
                        type: String,
                        validate: regexes.url
                    },
                    service_description: {
                        type: String,
                        maxlength: 3000
                    }
                }
            },
            volunteer: {
                type: {
                    location: {
                        type: [{
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
                        }]
                    },
                    roles: {
                        type: [{
                            type: String,
                            enum: enumerations.workRoles
                        }]
                    },
                    max_hours_per_week: {
                        type: Number,
                        min: 0
                    },
                    learning_objectives: {
                        type: String,
                        maxlength: 3000

                    }
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
            programming_languages: {
                type:[{
                    language: {
                        type: String,
                        enum: enumerations.programmingLanguages
                    },
                    exp_year: {
                        type: String,
                        enum: enumerations.experienceYears
                    }
                }]
            },
            description: {
                type:String,
                maxlength: 3000
            },
            education_history: {
                type:[new Schema({
                    uniname: {
                        type: String,
                        required: true
                    },
                    degreename: {
                        type: String,
                        required: true
                    },
                    fieldname: {
                        type: String,
                        required: true
                    },
                    eduyear: Number
                })]
            },
            work_history: {
                type:[new Schema({
                    companyname: {
                        type: String,
                        required: true
                    },
                    positionname: {
                        type: String,
                        required: true
                    },
                    locationname: {
                        type: String,
                        required: true
                    },
                    description: {
                        type: String,
                        maxlength: 3000
                    },
                    startdate: Date,
                    enddate: Date,
                    currentwork: {
                        type: Boolean,
                        required: true
                    }
                })],
            },
            interest_areas: {
                type:[{
                    type: String,
                    enum: enumerations.workBlockchainInterests
                }]
            },
            blockchain: {
                type: {
                    commercial_platforms: {
                        type: [{
                            name: {
                                type: String,
                                enum: enumerations.blockchainPlatforms
                            },
                            exp_year: {
                                type: String,
                                enum: enumerations.experienceYears
                            }
                        }]
                    },
                    description_commercial_platforms:{
                        type: String
                    },
                    experimented_platforms: {
                        type: [{
                            type: String,
                            enum: enumerations.blockchainPlatforms
                        }]
                    },
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
            }
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
    }
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
        if (req.auth.user === 'candidate') {
            await auth.isCandidateType(req);
        }
    }
}


module.exports.endpoint = async function (req, res) {
    let userId;
    let queryBody = req.body;
    let updateCandidateUser = {};
    let userDoc;
    let unset = {};

    console.log(queryBody);

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
        if (queryBody.first_name) updateCandidateUser.first_name = queryBody.first_name;
        if (queryBody.last_name) updateCandidateUser.last_name = queryBody.last_name;
        if (queryBody.contact_number) updateCandidateUser.contact_number = queryBody.contact_number;
        if (queryBody.nationality) updateCandidateUser.nationality = queryBody.nationality;
        if (queryBody.base_city) updateCandidateUser['candidate.base_city'] = queryBody.base_city;
        if (queryBody.base_country) updateCandidateUser['candidate.base_country'] = queryBody.base_country;

        if (queryBody.current_currency && queryBody.current_currency !== "-1") updateCandidateUser['candidate.current_currency'] = queryBody.current_currency;
        else unset['candidate.current_currency'] = 1;

        if (queryBody.current_salary) updateCandidateUser['candidate.current_salary'] = queryBody.current_salary;
        else unset['candidate.current_salary'] = 1;

        if(queryBody.unset_employee) unset['candidate.employee'] = 1;
        else {
            if(queryBody.employee) {
                for(let loc of queryBody.employee.location) {
                    if(loc.city) {
                        const index = queryBody.employee.location.findIndex((obj => obj.city === loc.city));
                        queryBody.employee.location[index].city = mongoose.Types.ObjectId(loc.city);

                    }
                }
                updateCandidateUser['candidate.employee'] = queryBody.employee;
            }
        }

        if(queryBody.unset_contractor) unset['candidate.contractor'] = 1;
        else {
            if(queryBody.contractor) {
                for(let loc of queryBody.contractor.location) {
                    if(loc.city) {
                        const index = queryBody.contractor.location.findIndex((obj => obj.city === loc.city));
                        queryBody.contractor.location[index].city = mongoose.Types.ObjectId(loc.city);
                    }
                }
                updateCandidateUser['candidate.contractor'] = queryBody.contractor;
            }
        }

        if(queryBody.unset_volunteer) unset['candidate.volunteer'] = 1;
        else {
            if(queryBody.volunteer) {
                for(let loc of queryBody.volunteer.location) {
                    if(loc.city) {
                        const index = queryBody.volunteer.location.findIndex((obj => obj.city === loc.city));
                        queryBody.volunteer.location[index].city = mongoose.Types.ObjectId(loc.city);
                    }
                }
                updateCandidateUser['candidate.volunteer'] = queryBody.volunteer;
            }
        }

        if (queryBody.roles) updateCandidateUser['candidate.roles'] = queryBody.roles;
        if (queryBody.expected_salary_currency) updateCandidateUser['candidate.expected_salary_currency'] = queryBody.expected_salary_currency;
        if (queryBody.expected_salary) updateCandidateUser['candidate.expected_salary'] = queryBody.expected_salary;
        if (queryBody.availability_day) updateCandidateUser['candidate.availability_day'] = queryBody.availability_day;
        if (queryBody.why_work) updateCandidateUser['candidate.why_work'] = queryBody.why_work;
        if (queryBody.description) updateCandidateUser['candidate.description'] = queryBody.description;
        if (queryBody.education_history && queryBody.education_history.length > 0) updateCandidateUser['candidate.education_history'] = queryBody.education_history;
        else unset['candidate.education_history'] = 1;

        if (queryBody.work_history && queryBody.work_history.length > 0) updateCandidateUser['candidate.work_history'] = queryBody.work_history;
        else unset['candidate.work_history'] = 1;
        if (queryBody.interest_areas) updateCandidateUser['candidate.interest_areas'] = queryBody.interest_areas;

        if (queryBody.unset_curret_currency) {
            unset['candidate.current_currency'] = 1;
            unset['candidate.current_salary'] = 1;
        }
        else{
            if (queryBody.current_currency && queryBody.current_salary) {
                updateCandidateUser['candidate.current_currency'] = queryBody.current_currency;
                updateCandidateUser['candidate.current_salary'] = queryBody.current_salary;
            }
        }

        if (queryBody.unset_commercial_platforms) {
            unset['candidate.blockchain.commercial_platforms'] = 1;
            unset['candidate.blockchain.description_commercial_platforms'] = 1;
        } else {
            if (queryBody.commercial_platforms && queryBody.commercial_platforms.length > 0) {
                updateCandidateUser['candidate.blockchain.commercial_platforms'] = queryBody.commercial_platforms;
                if(queryBody.description_commercial_platforms) updateCandidateUser['candidate.blockchain.description_commercial_platforms'] = queryBody.description_commercial_platforms;
            }
        }

        if (queryBody.unset_experimented_platforms) {
            unset['candidate.blockchain.experimented_platforms'] = 1;
            unset['candidate.blockchain.description_experimented_platforms'] = 1;
        } else {
            if (queryBody.experimented_platforms && queryBody.experimented_platforms.length > 0) {
                updateCandidateUser['candidate.blockchain.experimented_platforms'] = queryBody.experimented_platforms;
                if(queryBody.description_experimented_platforms) updateCandidateUser['candidate.blockchain.description_experimented_platforms'] = queryBody.description_experimented_platforms;
            }
        }

        if (queryBody.unset_commercial_skills) {
            unset['candidate.blockchain.commercial_skills'] = 1;
            unset['candidate.blockchain.description_commercial_skills'] = 1;
        } else {
            if (queryBody.commercial_skills && queryBody.commercial_skills.length > 0) {
                updateCandidateUser['candidate.blockchain.commercial_skills'] = queryBody.commercial_skills;
                if(queryBody.description_commercial_skills) updateCandidateUser['candidate.blockchain.description_commercial_skills'] = queryBody.description_commercial_skills;
            }
        }

        if (queryBody.unset_language) {
            unset['candidate.programming_languages'] = 1;
        } else {
            if (queryBody.programming_languages && queryBody.programming_languages.length > 0) updateCandidateUser['candidate.programming_languages'] = queryBody.programming_languages;
        }

        if (queryBody.unset_education_history) {
            unset['candidate.education_history'] = 1;
        } else {
            if (queryBody.education_history && queryBody.education_history.length > 0) updateCandidateUser['candidate.education_history'] = queryBody.education_history;
        }

        if (queryBody.unset_work_history) {
            unset['candidate.work_history'] = 1;
        } else {
            if (queryBody.work_history && queryBody.work_history.length > 0) updateCandidateUser['candidate.work_history'] = queryBody.work_history;
        }

        if (queryBody.unset_github_account) {
            unset['candidate.github_account'] = 1;
        } else {
            if (queryBody.github_account) updateCandidateUser['candidate.github_account'] = queryBody.github_account;
        }

        if (queryBody.unset_exchange_account) {
            unset['candidate.stackexchange_account'] = 1;
        } else {
            if (queryBody.exchange_account) updateCandidateUser['candidate.stackexchange_account'] = queryBody.exchange_account;
        }

        if (queryBody.unset_linkedin_account) {
            unset['candidate.linkedin_account'] = 1;
        } else {
            if (queryBody.linkedin_account) updateCandidateUser['candidate.linkedin_account'] = queryBody.linkedin_account;
        }

        if (queryBody.unset_medium_account) {
            unset['candidate.medium_account'] = 1;
        } else {
            if (queryBody.medium_account) updateCandidateUser['candidate.medium_account'] = queryBody.medium_account;
        }
        if (queryBody.unset_stackoverflow_url) {
            unset['candidate.stackoverflow_url'] = 1;
        } else {
            if (queryBody.stackoverflow_url) updateCandidateUser['candidate.stackoverflow_url'] = queryBody.stackoverflow_url;
        }

        if (queryBody.unset_personal_website_url) {
            unset['candidate.personal_website_url'] = 1;
        } else {
            if (queryBody.personal_website_url) updateCandidateUser['candidate.personal_website_url'] = queryBody.personal_website_url;
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
            if(queryBody.wizardNum === 5) history.status = { status: 'wizard completed' };
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