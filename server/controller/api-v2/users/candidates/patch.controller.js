const auth = require('../../../middleware/auth-v2');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');

const users = require('../../../../model/mongoose/users');
const filterReturnData = require('../../../api/users/filterReturnData');

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
            locations: {
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
            expected_salary_currency: {
                type: String,
                enum: enumerations.currencies
            },
            expected_salary: {
                type:Number,
                min: 0
            },
            current_currency: {
                type: String,
                enum: enumerations.currencies
            },
            current_salary: {
                type:Number,
                min: 0
            },
            availability_day: {
                type:String,
                enum: enumerations.workAvailability
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
                    experimented_platforms: {
                        type: [{
                            type: String,
                            enum: enumerations.blockchainPlatforms
                        }]
                    },
                    smart_contract_platforms: {
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

                    formal_skills : [new Schema({
                        skill: {
                            type: String,
                            enum: enumerations.otherSkills
                        },
                        exp_year: {
                            type: String,
                            enum: enumerations.exp_years
                        }
                    })],
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

    if (req.query.admin) {
        userId = req.params.user_id;
    }
    else {
        userId = req.auth.user._id;
    }

    if(req.file && req.file.path) updateCandidateUser.image = req.file.path;

    if (queryBody.first_name) updateCandidateUser.first_name = queryBody.first_name;
    if (queryBody.last_name) updateCandidateUser.last_name = queryBody.last_name;
    if (queryBody.contact_number) updateCandidateUser.contact_number = queryBody.contact_number;
    if (queryBody.nationality) updateCandidateUser.nationality = queryBody.nationality;
    if(queryBody.base_city) updateCandidateUser['candidate.base_city'] = queryBody.base_city;
    if(queryBody.base_country) updateCandidateUser['candidate.base_country'] = queryBody.base_country;
    if (queryBody.github_account) updateCandidateUser['candidate.github_account'] = queryBody.github_account;
    if (queryBody.exchange_account) updateCandidateUser['candidate.stackexchange_account'] = queryBody.exchange_account;
    if (queryBody.linkedin_account) updateCandidateUser['candidate.linkedin_account'] = queryBody.linkedin_account;
    if (queryBody.medium_account) updateCandidateUser['candidate.medium_account'] = queryBody.medium_account;
    if (queryBody.locations) {
        for(let loc of queryBody.locations) {
            if(loc.city) {
                const index = queryBody.locations.findIndex((obj => obj.city === loc.city));
                queryBody.locations[index].city = mongoose.Types.ObjectId(loc.city);
            }
        }
        updateCandidateUser['candidate.locations'] = queryBody.locations;
    }
    if (queryBody.roles) updateCandidateUser['candidate.roles'] = queryBody.roles;
    if (queryBody.expected_salary_currency) updateCandidateUser['candidate.expected_salary_currency'] = queryBody.expected_salary_currency;
    if (queryBody.expected_salary) updateCandidateUser['candidate.expected_salary'] = queryBody.expected_salary;
    if (queryBody.current_currency && queryBody.current_currency !== "-1") updateCandidateUser['candidate.current_currency'] = queryBody.current_currency;
    if (queryBody.current_salary ) updateCandidateUser['candidate.current_salary'] = queryBody.current_salary;
    if (queryBody.availability_day) updateCandidateUser['candidate.availability_day'] = queryBody.availability_day;
    if (queryBody.why_work) updateCandidateUser['candidate.why_work'] = queryBody.why_work;
    if (queryBody.programming_languages && queryBody.programming_languages.length > 0) updateCandidateUser['candidate.programming_languages'] = queryBody.programming_languages;
    if (queryBody.description) updateCandidateUser['candidate.description'] = queryBody.description;
    if (queryBody.education_history && queryBody.education_history.length > 0) updateCandidateUser['candidate.education_history'] = queryBody.education_history;
    if (queryBody.work_history && queryBody.work_history.length > 0) updateCandidateUser['candidate.work_history'] = queryBody.work_history;
    if (queryBody.interest_areas) updateCandidateUser['candidate.interest_areas'] = queryBody.interest_areas;
    if (queryBody.commercial_platforms && queryBody.commercial_platforms.length > 0) updateCandidateUser['candidate.blockchain.commercial_platforms'] = queryBody.commercial_platforms;
    if (queryBody.experimented_platforms && queryBody.experimented_platforms.length > 0) updateCandidateUser['candidate.blockchain.experimented_platforms'] = queryBody.experimented_platforms;
    if (queryBody.smart_contract_platforms && queryBody.smart_contract_platforms.length > 0) updateCandidateUser['candidate.blockchain.smart_contract_platforms'] = queryBody.smart_contract_platforms;
    if(queryBody.commercial_skills && queryBody.commercial_skills.length >0) updateCandidateUser['candidate.blockchain.commercial_skills'] = queryBody.commercial_skills;
    if(queryBody.formal_skills && queryBody.formal_skills.length > 0 ) updateCandidateUser['candidate.blockchain.formal_skills'] = queryBody.formal_skills;

    await users.update({ _id: userId},{$set: updateCandidateUser});

    const updatedProfile = await users.findOneById(userId);
    const filterData = filterReturnData.removeSensativeData(updatedProfile);
    res.send(filterData);
}