const auth = require('../../../middleware/auth-v2');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');

const users = require('../../../../model/mongoose/users');
const filterReturnData = require('../../../api/users/filterReturnData');
const objects = require('../../../services/objects');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id/candidates'
};
const paramSchema = new Schema({
    user_id: String
});

const querySchema = new Schema({
    admin: Boolean
});

const bodySchema = new Schema({
    first_name: String,
    last_name: String,
    contact_number: String,
    nationality: {
        type:String,
        enum: enumerations.nationalities
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
    }
});

module.exports.inputValidation = {
    params: paramSchema,
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
}


module.exports.endpoint = async function (req, res) {
    let userId;
    let queryBody = req.body;
    let updateCandidateUser = {};
    let userDoc;
    let unset = {};

    console.log(queryBody);

    if (req.query.admin) {
        userId = req.params.user_id;
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
        if (queryBody.github_account) updateCandidateUser['candidate.github_account'] = queryBody.github_account;
        if (queryBody.exchange_account) updateCandidateUser['candidate.stackexchange_account'] = queryBody.exchange_account;
        if (queryBody.linkedin_account) updateCandidateUser['candidate.linkedin_account'] = queryBody.linkedin_account;
        if (queryBody.medium_account) updateCandidateUser['candidate.medium_account'] = queryBody.medium_account;

        if (queryBody.current_currency && queryBody.current_currency !== "-1") updateCandidateUser['candidate.current_currency'] = queryBody.current_currency;
        else unset['candidate.current_currency'] = 1;

        if (queryBody.current_salary) updateCandidateUser['candidate.current_salary'] = queryBody.current_salary;
        else unset['candidate.current_salary'] = 1;

        if(queryBody.employee) updateCandidateUser['candidate.employee'] = queryBody.employee;
        else unset['candidate.employee'] = 1;

        if(queryBody.contractor) updateCandidateUser['candidate.contractor'] = queryBody.contractor;
        else unset['candidate.contractor'] = 1;

        if(queryBody.volunteer) updateCandidateUser['candidate.volunteer'] = queryBody.volunteer;
        else unset['candidate.volunteer'] = 1;

        if (queryBody.why_work) updateCandidateUser['candidate.why_work'] = queryBody.why_work;
        if (queryBody.programming_languages && queryBody.programming_languages.length > 0) updateCandidateUser['candidate.programming_languages'] = queryBody.programming_languages;
        if (queryBody.description) updateCandidateUser['candidate.description'] = queryBody.description;
        if (queryBody.education_history && queryBody.education_history.length > 0) updateCandidateUser['candidate.education_history'] = queryBody.education_history;
        else unset['candidate.education_history'] = 1;

        if (queryBody.work_history && queryBody.work_history.length > 0) updateCandidateUser['candidate.work_history'] = queryBody.work_history;
        else unset['candidate.work_history'] = 1;

        if (queryBody.interest_areas) updateCandidateUser['candidate.interest_areas'] = queryBody.interest_areas;
        if (queryBody.commercial_platforms && queryBody.commercial_platforms.length > 0) updateCandidateUser['candidate.blockchain.commercial_platforms'] = queryBody.commercial_platforms;
        else unset['candidate.blockchain.commercial_platforms'] = 1;

        if (queryBody.description_commercial_platforms && queryBody.commercial_platforms.length > 0) updateCandidateUser['candidate.blockchain.description_commercial_platforms'] = queryBody.description_commercial_platforms;
        else unset['candidate.blockchain.description_commercial_platforms'] = 1;

        if (queryBody.experimented_platforms && queryBody.experimented_platforms.length > 0) updateCandidateUser['candidate.blockchain.experimented_platforms'] = queryBody.experimented_platforms;
        else unset['candidate.blockchain.experimented_platforms'] = 1;

        if (queryBody.description_experimented_platforms && queryBody.experimented_platforms.length > 0) updateCandidateUser['candidate.blockchain.description_experimented_platforms'] = queryBody.description_experimented_platforms;
        else unset['candidate.blockchain.description_experimented_platforms'] = 1;

        if (queryBody.commercial_skills && queryBody.commercial_skills.length > 0) updateCandidateUser['candidate.blockchain.commercial_skills'] = queryBody.commercial_skills;
        else unset['candidate.blockchain.description_experimented_platforms'] = 1;

        if (queryBody.description_commercial_skills && queryBody.commercial_skills.length > 0) updateCandidateUser['candidate.blockchain.description_commercial_skills'] = queryBody.description_commercial_skills;
        else unset['candidate.blockchain.description_commercial_skills'] = 1;

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
        let wizardStatus = candidateHistory.filter(
            (history) => history.status && history.status.status === 'wizard completed'
        );
        if (wizardStatus.length === 0 && queryBody.description) {
            history.status = { status: 'wizard completed' };
        }
        else {
            history.status = { status: 'updated' };
        }
    }

    let latestStatus = objects.copyObject(history.status);
    latestStatus.timestamp = timestamp;
    updateCandidateUser['candidate.latest_status'] = latestStatus;


    await users.update({_id: userId}, {
        $push: {
            'candidate.history': {
                $each: [history],
                $position: 0
            }
        },
        $set : updateCandidateUser,
        $unset: unset
    });


    const filterData = filterReturnData.removeSensativeData(userDoc);
    res.send(filterData);
}