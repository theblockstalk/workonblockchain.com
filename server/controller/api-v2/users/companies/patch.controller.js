const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');
const objects = require('../../../services/objects');
const companies = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');
const users = require('../../../../model/mongoose/users');

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
    country_code: {
        type:String
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
    pricing_plan: {
        type: String,
        enum: enumerations.pricingPlans
    },
    saved_searches: {
        type:[new Schema({
            work_type : {
                type: String,
                enum: enumerations.workTypes
            },
            location: {
                type: [new Schema({
                    city: {
                        type : Schema.Types.ObjectId
                    },
                    visa_needed: Boolean,
                    remote: Boolean,
                })]
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
            },
            name: {
                type: String
            },
            timestamp : {
                type : Date
            }
        })]
    },
    when_receive_email_notitfications : {
        type : String ,
        enum : enumerations.email_notificaiton
    },
    hear_about_wob: {
        type: String,
        enum: enumerations.hearAboutWob
    },
    hear_about_wob_other_info:  String,
    unset_hear_about_wob_other_info: Boolean
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
    else {
        await auth.isCompanyType(req);
    }

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
        let userUpdate = {};
        let unset = {};
        if(req.file && req.file.path) employerUpdate.company_logo = req.file.path;
        else {
            if(queryBody.hear_about_wob) userUpdate.hear_about_wob = queryBody.hear_about_wob;
            if(queryBody.hear_about_wob_other_info) userUpdate.hear_about_wob_other_info = queryBody.hear_about_wob_other_info;
            if(queryBody.unset_hear_about_wob_other_info) unset['hear_about_wob_other_info'] = 1;
            if (queryBody.first_name) employerUpdate.first_name = queryBody.first_name;
            if (queryBody.last_name) employerUpdate.last_name = queryBody.last_name;
            if (queryBody.job_title) employerUpdate.job_title = queryBody.job_title;
            if (queryBody.company_name) employerUpdate.company_name = queryBody.company_name;
            if (queryBody.company_website) employerUpdate.company_website = queryBody.company_website;
            if (queryBody.company_phone) employerUpdate.company_phone = queryBody.company_phone;
            if (queryBody.company_country) employerUpdate.company_country = queryBody.company_country;
            if (queryBody.company_city) employerUpdate.company_city = queryBody.company_city;
            if (queryBody.company_postcode) employerUpdate.company_postcode = queryBody.company_postcode;
            if (queryBody.company_founded) employerUpdate.company_founded = queryBody.company_founded;
            if (queryBody.no_of_employees) employerUpdate.no_of_employees = queryBody.no_of_employees;
            if (queryBody.company_funded) employerUpdate.company_funded = queryBody.company_funded;
            if (queryBody.company_description) employerUpdate.company_description = queryBody.company_description;
            if (queryBody.when_receive_email_notitfications) employerUpdate.when_receive_email_notitfications = queryBody.when_receive_email_notitfications;
            if(queryBody.pricing_plan) employerUpdate.pricing_plan = queryBody.pricing_plan;

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

        let updateObj = {};
        if(!objects.isEmpty(userUpdate))
            updateObj.$set = userUpdate;
        if(!objects.isEmpty(unset))
            updateObj.$unset=  unset;
        if(!objects.isEmpty(updateObj))
            await users.update({_id: userId}, updateObj);

        await companies.update({ _id: employerDoc._id },{ $set: employerUpdate});

        const updatedEmployerDoc = await companies.findOneAndPopulate(userId);
        res.send(updatedEmployerDoc);
    }
    else {
        errors.throwError("Company account not found", 404);
    }
}