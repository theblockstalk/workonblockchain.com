const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const errors = require('../../../services/errors');
const crypto = require('../../../services/crypto');
const jwtToken = require('../../../services/jwtToken');

const companies = require('../../../../model/mongoose/company');
const Users = require('../../../../model/mongoose/users');
const referral = require('../../../../model/mongoose/referral');
const verify_send_email = require('../auth/verify_send_email');
const referedCompanyEmail = require('../../../services/email/emails/youReferredACompany');

module.exports.request = {
    type: 'post',
    path: '/users/companies'
};

const bodySchema = new Schema({
    email: {
        type:String,
        validate: regexes.email,
        lowercase: true,
    },
    password: {
        type:String,
        validate: regexes.password
    },
    confirm_password:{
        type:String,
        validate: regexes.password
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
    country_code: {
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
    type:{
        type: String,
        enum: enumerations.userTypes
    },
    referred_email:{
        type: String,
        validate: regexes.email,
    }
});

module.exports.inputValidation = {
    body: bodySchema
};

module.exports.endpoint = async function (req, res) {
    const queryBody = req.body;

    const companyDoc = await Users.findOneByEmail(queryBody.email);
    if(companyDoc){
        errors.throwError('Email "' + queryBody.email + '" is already taken', 400)
    }
    else{
        const salt = crypto.getRandomString(128);
        const hashedPasswordAndSalt = crypto.createPasswordHash(queryBody.password, salt);

        let newCompanyDoc = {
            email: queryBody.email,
            password_hash: hashedPasswordAndSalt,
            salt : salt,
            type: queryBody.type,
            created_date: new Date(),
            referred_email : queryBody.referred_email,
            is_approved: 1
        };
        const companyUserCreated =  await Users.insert(newCompanyDoc);
        if(companyUserCreated)
        {
            const refDoc = await referral.findOneByEmail(queryBody.referred_email);

            let employerDetail = {
                _creator : companyUserCreated._id,
                first_name : queryBody.first_name,
                last_name: queryBody.last_name,
                job_title:queryBody.job_title,
                company_name: queryBody.company_name,
                company_website:queryBody.company_website,
                company_phone:queryBody.company_phone,
                company_country:queryBody.company_country,
                company_city:queryBody.company_city,
                company_postcode:queryBody.company_postcode
            };

            if(refDoc && refDoc.discount)
                employerDetail.discount = refDoc.discount;

            let employerDoc = await companies.insert(employerDetail);

            let signOptions = {
                expiresIn:  "1h",
            };
            let verifyEmailToken = jwtToken.createJwtToken(companyUserCreated, signOptions);
            let jwtUserToken = jwtToken.createJwtToken(companyUserCreated);

            var set = {
                verify_email_key: verifyEmailToken,
                jwt_token: jwtUserToken,
                session_started: new Date()
            };

            await Users.update({ _id: companyUserCreated._id },{ $set: set });
            verify_send_email(companyUserCreated.email, verifyEmailToken);

            //sending email to referee

            if(refDoc){
                const companyDoc = await companies.findOne({_creator : companyUserCreated._id});
                let data;
                if(companyDoc && companyDoc.first_name)
                {
                    data = {
                        fname: companyDoc.first_name,
                        email: refDoc.email,
                        fname_referred: queryBody.first_name,
                        lname_referred: queryBody.last_name,
                        company_name: queryBody.company_name
                    }
                }
                else
                {
                    data = {
                        email: refDoc.email,
                        fname_referred: queryBody.first_name,
                        lname_referred: queryBody.last_name,
                        company_name: queryBody.company_name
                    }

                }
                referedCompanyEmail.sendEmail(data, false);
            }
            //end
            res.send({
                company_id:employerDoc._id,
                _id: companyUserCreated._id,
                type:companyUserCreated.type,
                email: companyUserCreated.email,
                jwt_token: jwtUserToken
            });
        }
    }
}