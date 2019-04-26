const auth = require('../../../../middleware/auth-v2');
const users = require('../../../../../model/mongoose/users');
const companies = require('../../../../../model/mongoose/company');
const Schema = require('mongoose').Schema;
const errors = require('../../../../services/errors');
const companyApprovedEmail = require('../../../../services/email/emails/companyApproved');


module.exports.request = {
    type: 'post',
    path: '/users/:user_id/companies/status'
};
const paramSchema = new Schema({
    user_id: String
});
const querySchema = new Schema({
    admin: Boolean
});
const bodySchema = new Schema({
    is_approved: {
        type:Number, // 0 = false, 1 = true
        enum: [0, 1],
        required:true,
    }
});

module.exports.inputValidation = {
    params: paramSchema,
    query: querySchema,
    body: bodySchema
};

module.exports.auth = async function (req) {
    if (req.query.admin) {
        await auth.isAdmin(req);
    }
    else {
        await auth.isLoggedIn(req);
        const authUser = req.auth.user;
        if(authUser.type !== 'company') {
            errors.throwError("Unauthorize user", 401)
        }
    }
}

module.exports.endpoint = async function (req, res) {
    let userId;
    let employerDoc;
    let queryBody = req.body;
    if (req.query.admin) {
        userId = req.params.user_id;
        employerDoc = await companies.findOne({ _creator: userId });
    }
    else {
        userId = req.auth.user._id;
        employerDoc = await companies.findOne({ _creator: userId });
    }
    await users.update({ _id:  userId },{ $set: {'is_approved': queryBody.is_approved} });
    companyApprovedEmail.sendEmail(employerDoc._creator.email, employerDoc.first_name, employerDoc._creator.disable_account);
    res.send({
        success : true
    })
}

