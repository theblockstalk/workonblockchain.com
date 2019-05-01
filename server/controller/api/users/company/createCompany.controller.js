const settings = require('../../../../settings');
const jwt = require('jsonwebtoken');
const Users = require('../../../../model/mongoose/users');
const crypto = require('../../../services/crypto');
const companies = require('../../../../model/mongoose/company');

const jwtToken = require('../../../services/jwtToken');
const filterReturnData = require('../filterReturnData');
const verify_send_email = require('../auth/verify_send_email');
const referral = require('../../../../model/mongoose/referral');
const referedCompanyEmail = require('../../../services/email/emails/youReferredACompany');
const errors = require('../../../services/errors');

///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {

    const queryBody = req.body;

    const companyDoc = await Users.findOneByEmail(queryBody.email);
    if(companyDoc){
        const responseMsg = 'Email "' + queryBody.email + '" is already taken';
        errors.throwError(responseMsg, 400)
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
            referred_email : queryBody.referred_email

        };
        const companyUserCreated  =  await Users.insert(newCompanyDoc);
        if(companyUserCreated)
        {
            let jwtUserToken = jwtToken.createJwtToken(companyUserCreated);
            await Users.update({ _id: companyUserCreated._id },{ $set: { 'jwt_token': jwtUserToken } });
            let employerDetail = {
                _creator : companyUserCreated._id,
                first_name : queryBody.first_name,
                last_name: queryBody.last_name,
                job_title:queryBody.job_title,
                company_name: queryBody.company_name,
                company_website:queryBody.company_website,
                company_phone:queryBody.country_code +' '+queryBody.phone_number,
                company_country:queryBody.country,
                company_city:queryBody.city,
                company_postcode:queryBody.postal_code,
            };

            let employerDoc = await companies.insert(employerDetail);

            let signOptions = {
                expiresIn:  "1h",
            };
            let verifyEmailToken = jwtToken.createJwtToken(companyUserCreated, signOptions);
            var set =
                {
                    verify_email_key: verifyEmailToken,

                };

            const userDoc = await Users.update({ _id: companyUserCreated._id },{ $set: set });
            verify_send_email(companyUserCreated.email, verifyEmailToken);

            //sending email to referee
            const refDoc = await referral.findOneByEmail(queryBody.referred_email);
            if(refDoc){
                const userDoc = await Users.findOneByEmail(refDoc.email);
                if(userDoc && userDoc.type){
                    const companyDoc = await companies.findOne({_creator : userDoc._id});
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
                    referedCompanyEmail.sendEmail(data, userDoc.disable_account);
                }
                else
                {

                    let data = {
                        email: refDoc.email,
                        fname_referred: queryBody.first_name,
                        lname_referred: queryBody.last_name,
                        company_name: queryBody.company_name
                    }
                    referedCompanyEmail.sendEmail(data, false);
                }
            }
            //end
            let userData = filterReturnData.removeSensativeData(companyUserCreated)
            res.send({
                company_id:employerDoc._id,
                _id: userData._id,
                type:userData.type,
                email: userData.email,
                jwt_token: jwtUserToken
            });
        }
    }

};
