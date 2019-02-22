const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');

const companies = require('../../../../model/mongoose/company');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id/companies'
};
const paramSchema = new Schema({
    user_id: String
});

const bodySchema = new Schema({
    terms_id: {
        type: Schema.Types.ObjectId,
        ref: 'pages_content'
    },
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
                    required : true,
                    enum: enumerations.jobTypes
                }]

            },
            position: {
                type: [{
                    type: String,
                    required : true,
                    enum: enumerations.workRoles
                }]
            },
            current_currency: {
                type: String,
                required : true,
                enum: enumerations.currencies
            },
            current_salary: {
                type:Number,
                required : true,
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
            residence_country: {
                type: String,
                enum: enumerations.countries

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
    params: paramSchema,
    body: bodySchema
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "company_logo");
}

module.exports.auth = async function (req) {
    console.log("auth validation");
    await auth.isValidCompany(req);
}


module.exports.endpoint = async function (req, res) {
    console.log("company endpoint");
    let userId = req.auth.user._id;
    const employerDoc = await companies.findOne({ _creator: userId });

    if(employerDoc){
        console.log("if");
        const queryBody = req.body;
        console.log(queryBody);

        res.send(true);
    }

    else {
        errors.throwError("Company account not found", 404);
    }
}