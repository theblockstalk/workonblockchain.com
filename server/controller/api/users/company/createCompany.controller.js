const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var Q = require('q');
var mongo = require('mongoskin');
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
            msg : "Please enter your company email"
        })
    }
    else
    {
        const companyDoc = await User.findOne({ email: userParam.email }).lean();
        if(companyDoc){
            const responseMsg = 'Email "' + userParam.email + '" is already taken';
            res.send({
                msg : responseMsg
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
            const companyCreated  =  await newCompanyDoc.save();
        }
    }

    
};
