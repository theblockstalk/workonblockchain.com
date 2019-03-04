const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');

const users = require('../../../../model/mongoose/users');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id/candidates'
};
const paramSchema = new Schema({
    user_id: String
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
            terms_id: {
                type: Schema.Types.ObjectId,
                ref: 'pages_content'
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
            },
            status:{ //DELETE ME
                type:[{
                    status: {
                        type: String,
                        enum: enumerations.candidateStatus,
                        required:true,
                    },
                    reason: {
                        type: String,
                        enum: enumerations.statusReasons
                    },
                    timestamp: {
                        type: Date,
                        required:true,
                    }
                }]
            },
            history : {
                type : [{
                    status:{
                        type:[{
                            status: {
                                type: String,
                                enum: enumerations.candidateStatus,
                                required:true,
                            },
                            reason: {
                                type: String,
                                enum: enumerations.statusReasons
                            }
                        }],
                        required: false
                    },
                    note : String,
                    email_text : String,
                    timestamp: {
                        type: Date,
                        required:true,
                    }
                }]

            }

        }
    }
});

module.exports.inputValidation = {
    params: paramSchema,
    body: bodySchema
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "company_logo");
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
}


module.exports.endpoint = async function (req, res) {
    let userId = req.auth.user._id;
    let requestId = req.params.user_id;
    let queryBody = req.body;
    console.log(queryBody);
    let updateCandidateUser = {};
    let unset = {};
    if (queryBody.first_name) updateCandidateUser.first_name = queryBody.first_name;
    if (queryBody.last_name) updateCandidateUser.last_name = queryBody.last_name;
    if (queryBody.github_account) updateCandidateUser['candidate.github_account'] = queryBody.github_account;
    else unset['candidate.github_account'] = 1;

    if (queryBody.exchange_account) updateCandidateUser['candidate.stackexchange_account'] = queryBody.exchange_account;
    else unset['candidate.stackexchange_account'] = 1;

    if (queryBody.linkedin_account) updateCandidateUser['candidate.linkedin_account'] = queryBody.linkedin_account;
    else unset['candidate.linkedin_account'] = 1;

    if (queryBody.medium_account) updateCandidateUser['candidate.medium_account'] = queryBody.medium_account;
    else unset['candidate.medium_account'] = 1;

    if (queryBody.contact_number) updateCandidateUser.contact_number = queryBody.contact_number;
    if (queryBody.nationality) updateCandidateUser.nationality = queryBody.nationality;
    if (queryBody.country) {
        for(let loc of queryBody.country) {
            if(loc.city) {
                const index = queryBody.country.findIndex((obj => obj.city === loc.city));
                queryBody.country[index].city = mongoose.Types.ObjectId(loc.city);
            }
        }
        updateCandidateUser['candidate.locations'] = queryBody.country;
    }
    if (queryBody.roles) updateCandidateUser['candidate.roles'] = queryBody.roles;
    if (queryBody.interest_areas) updateCandidateUser['candidate.interest_areas'] = queryBody.interest_areas;
    if (queryBody.base_currency) updateCandidateUser['candidate.expected_salary_currency'] = queryBody.base_currency;
    if (queryBody.expected_salary) updateCandidateUser['candidate.expected_salary'] = queryBody.expected_salary;
    if (queryBody.availability_day) updateCandidateUser['candidate.availability_day'] = queryBody.availability_day;
    if (queryBody.why_work) updateCandidateUser['candidate.why_work'] = queryBody.why_work;
    if (queryBody.commercial_platforms && queryBody.commercial_platforms.length > 0) updateCandidateUser['candidate.blockchain.commercial_platforms'] = queryBody.commercial_platforms;
    else unset['candidate.blockchain.commercial_platforms'] = 1;
    if (queryBody.experimented_platforms && queryBody.experimented_platforms.length > 0) updateCandidateUser['candidate.blockchain.experimented_platforms'] = queryBody.experimented_platforms;
    else unset['candidate.blockchain.experimented_platforms'] = 1;
    if (queryBody.smart_contract_platforms && queryBody.smart_contract_platforms.length > 0) updateCandidateUser['candidate.blockchain.smart_contract_platforms'] = queryBody.smart_contract_platforms;
    else unset['candidate.blockchain.smart_contract_platforms'] = 1;
    if (queryBody.salary ) updateCandidateUser['candidate.current_salary'] = queryBody.salary;
    else unset['candidate.current_salary'] = 1;
    if (queryBody.current_currency && queryBody.current_currency !== "-1") updateCandidateUser['candidate.current_currency'] = queryBody.current_currency;
    else unset['candidate.current_currency'] = 1;
    if (queryBody.language_experience_year && queryBody.language_experience_year.length > 0) updateCandidateUser['candidate.programming_languages'] = queryBody.language_experience_year;
    else unset['candidate.programming_languages'] = 1;
    if (queryBody.intro) updateCandidateUser['candidate.description'] = queryBody.intro;
    if (queryBody.educationHistory && queryBody.educationHistory.length > 0) updateCandidateUser['candidate.education_history'] = queryBody.educationHistory;
    else unset['candidate.education_history'] = 1;
    if (queryBody.workHistory && queryBody.workHistory.length > 0) updateCandidateUser['candidate.work_history'] = workHistory;
    else unset['candidate.work_history'] = 1;
    if(queryBody.commercial_skills && queryBody.commercial_skills.length >0) updateCandidateUser['candidate.blockchain.commercial_skills'] = queryBody.commercial_skills;
    else unset['candidate.blockchain.commercial_skills'] = 1;
    if(queryBody.formal_skills && queryBody.formal_skills.length > 0 ) updateCandidateUser['candidate.blockchain.formal_skills'] = queryBody.formal_skills;
    else unset['candidate.blockchain.formal_skills'] = 1;
    if(queryBody.city) updateCandidateUser['candidate.base_city'] = queryBody.city;
    if(queryBody.base_country) updateCandidateUser['candidate.base_country'] = queryBody.base_country;
    if(queryBody.status) {
        /*let status = {status: 'updated'};
        if (requestId && requestId !== userId) {
            status = {status: 'updated by admin'};
        }
        await users.update({ _id: userId }, {
                $set: updateCandidateUser,
                $push: {
                    'candidate.history' : {
                        $each: [{ history: status,
                            timestamp: new Date()}],
                        $position: 0
                    }
                }
            }
        );*/
    }

    if (!filterReturnData.isEmptyObject(unset)) {
        await users.update({ _id: userId},{$unset: unset});
    }
}