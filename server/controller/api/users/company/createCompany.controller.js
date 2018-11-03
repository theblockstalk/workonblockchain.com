const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
const Users = require('../../../../model/users');
const crypto = require('crypto');
const EmployerProfile = require('../../../../model/employer_profile');
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../../services/logger');
const jwtToken = require('../../../services/jwtToken');
const filterReturnData = require('../filterReturnData');
const verify_send_email = require('../auth/verify_send_email');

///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {

    const userParam = req.body;

    let count=0;

    let str = userParam.email;
    let email_split = str.split('@');

    for (let i = 0; i < emails.length; i++)
    {
        if(emails[i] == email_split[1])
        {
            count++;
        }

    }
    if(count == 1)
    {
        res.send({
            error : "Please enter your company email"
        })
    }
    else
    {
        const companyDoc = await Users.findOne({ email: userParam.email }).lean();
        if(companyDoc){
            const responseMsg = 'Email "' + userParam.email + '" is already taken';
            res.send({
                error : responseMsg
            })
        }
        else{
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt);
            hash.update(userParam.password);
            let hashedPasswordAndSalt = hash.digest('hex');

            let random = crypto.randomBytes(16).toString('base64');
            let newCompanyDoc = new Users
            ({
                email: userParam.email,
                password_hash: hashedPasswordAndSalt,
                salt : salt,
                type: userParam.type,
                jwt_token:jwt.sign({ sub: random }, settings.EXPRESS_JWT_SECRET),
                created_date: new Date(),

            });
            const companyUserCreated  =  await newCompanyDoc.save();
            if(companyUserCreated)
            {
                let jwtUserToken = jwtToken.createJwtToken(companyUserCreated);
                await Users.update({ _id: companyUserCreated._id },{ $set: { 'jwt_token': jwtUserToken } });
                let employerDetail = new EmployerProfile
                ({
                    _creator : companyUserCreated._id,
                    first_name : userParam.first_name,
                    last_name: userParam.last_name,
                    job_title:userParam.job_title,
                    company_name: userParam.company_name,
                    company_website:userParam.company_website,
                    company_phone:userParam.phone_number,
                    company_country:userParam.country,
                    company_city:userParam.city,
                    company_postcode:userParam.postal_code,
                });
                let employerDoc = await employerDetail.save();
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
                let userData = filterReturnData.removeSensativeData({_creator : companyUserCreated.toObject()})
                res.send({
                    _id:employerDoc.id,
                    _creator: userData._creator._id,
                    type:userData._creator.type,
                    email: userData._creator.email,
                    is_approved : userData._creator.is_approved,
                    jwt_token: jwtUserToken
                });
            }
        }
    }
    
};
