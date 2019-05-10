const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');
const objects = require('../../../services/objects');
const companies = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');

module.exports.request = {
    type: 'patch',
    path: '/users/companies'
};

const querySchema = new Schema({
    admin: Boolean,
    user_id: String
});

const bodySchema = new Schema({
    first_name: {
        type:String
    },
    last_name: {
        type:String
    },
    job_title: {
        type:String
    },
    company_name: {
        type:String
    },
    company_website: {
        type:String,
        validate: regexes.url
    },
    company_phone: {
        type:String
    },
    company_country: {
        type: String,
        enum: enumerations.countries
    },
    company_city: {
        type:String
    },
    company_postcode: {
        type:String
    },
    company_founded: {
        type:Number,
        min: 1800
    },
    no_of_employees: {
        type:Number,
        min: 1
    },
    company_funded: {
        type:String
    },
    company_logo: {
        type: String,
        validate: regexes.url
    },
    company_description: {
        type: String,
        maxlength: 3000
    },

    saved_searches: {
        type:[new Schema({
            search_name: String,
            work_type : {
                type: String,
                enum: enumerations.workTypes
            },
            location: {
                type: [{
                    city: {
                        type : Schema.Types.ObjectId,
                        ref: 'Cities'
                    },
                    remote: Boolean,

                }]
            },
            visa_needed: {
                type: Boolean,
                default:false,
            },
            job_type: {
                type: [{
                    type: String,
                    enum: enumerations.employmentTypes
                }]

            },
            position: {
                type: [{
                    type: String,
                    enum: enumerations.workRoles
                }]
            },
            current_currency: {
                type: String,
                enum: enumerations.currencies
            },
            current_salary: {
                type:Number,
                min: 0
            },
            expected_hourly_rate: {
                type:Number,
                min: 0
            },
            blockchain: {
                type: [{
                    type: String,
                    enum: enumerations.blockchainPlatforms
                }]
            },
            skills: {
                type: [{
                    type: String,
                    enum: enumerations.programmingLanguages
                }]
            },
            years_exp_min: {
                type: Number,
                min: 1,
                max: 20
            },
            residence_country: {
                type : [{
                    type: String,
                    enum: enumerations.countries
                }]
            },
            other_technologies : {
                type : String
            },

            order_preferences : {
                type: [{
                    type: String,
                    enum: enumerations.blockchainPlatforms
                }]
            }

        })]
    },
    when_receive_email_notitfications : {
        type : String ,
        enum : enumerations.email_notificaiton
    },
});

module.exports.inputValidation = {
    query: querySchema,
    body: bodySchema
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "company_logo");
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if (req.query.admin) {
        await auth.isAdmin(req);
    }
    else if (req.auth.user.type !== 'company') {
        errors.throwError("Can only be called by a company");
    }
    else {}
}


module.exports.endpoint = async function (req, res) {
    let userId;
    let employerDoc;
    if (req.query.admin) {
        userId = req.query.user_id;
        employerDoc = await companies.findOne({ _creator: userId });
    }
    else {
        userId = req.auth.user._id;
        employerDoc = await companies.findOne({ _creator: userId });
    }
    if(employerDoc){
        const queryBody = req.body;
        let employerUpdate = {};
        if(req.file && req.file.path) employerUpdate.company_logo = req.file.path;
        else {
            if (queryBody.first_name) employerUpdate.first_name = queryBody.first_name;
            if (queryBody.last_name) employerUpdate.last_name = queryBody.last_name;
            if (queryBody.job_title) employerUpdate.job_title = queryBody.job_title;
            if (queryBody.company_name) employerUpdate.company_name = queryBody.company_name;
            if (queryBody.company_website) employerUpdate.company_website = queryBody.company_website;
            if (queryBody.phone_number) employerUpdate.company_phone = queryBody.phone_number;
            if (queryBody.country) employerUpdate.company_country = queryBody.country;
            if (queryBody.city) employerUpdate.company_city = queryBody.city;
            if (queryBody.postal_code) employerUpdate.company_postcode = queryBody.postal_code;
            if (queryBody.company_founded) employerUpdate.company_founded = queryBody.company_founded;
            if (queryBody.no_of_employees) employerUpdate.no_of_employees = queryBody.no_of_employees;
            if (queryBody.company_funded) employerUpdate.company_funded = queryBody.company_funded;
            if (queryBody.company_description) employerUpdate.company_description = queryBody.company_description;
            if (queryBody.when_receive_email_notitfications) employerUpdate.when_receive_email_notitfications = queryBody.when_receive_email_notitfications;
            if (queryBody.saved_searches) {
                let patchSearches = queryBody.saved_searches;
                let currentSearches = employerDoc.saved_searches;
                const timestamp = new Date();
                for (let patchSearch of patchSearches) {
                    if(currentSearches) {

                        const currentSearch = currentSearches.filter( function (currentSearch) {
                            if(patchSearch._id) {
                                if(currentSearch._id.toString() === patchSearch._id.toString())
                                    return currentSearch;
                            }
                        });

                        if (currentSearch && currentSearch.length === 1) {
                            if (!objects.compareObjects(currentSearch[0], patchSearch)) {
                                // This is a modified search
                                patchSearch.timestamp = timestamp;
                            }

                        } else {
                            // This is a new search
                            patchSearch.timestamp = timestamp;
                        }
                    }
                    else {
                        patchSearch.timestamp = timestamp;

                    }

                }
                employerUpdate.saved_searches = queryBody.saved_searches;
            }

        }

        await companies.update({ _id: employerDoc._id },{ $set: employerUpdate});

        const updatedEmployerDoc = await companies.findOneAndPopulate(userId);
        res.send(updatedEmployerDoc);
    }
    else {
        errors.throwError("Company account not found", 404);
    }
}