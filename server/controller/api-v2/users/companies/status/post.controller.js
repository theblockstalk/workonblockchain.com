const auth = require('../../../../middleware/auth-v2');
const users = require('../../../../../model/mongoose/users');
const companies = require('../../../../../model/mongoose/company');
const Schema = require('mongoose').Schema;
const errors = require('../../../../services/errors');
const companyApprovedEmail = require('../../../../services/email/emails/companyApproved');


module.exports.request = {
    type: 'post',
    path: '/users/companies/status'
};
const querySchema = new Schema({
    user_id: String,
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
    query: querySchema,
    body: bodySchema
};

module.exports.auth = async function (req) {
    await auth.isAdmin(req);
    if(!req.auth.admin) throw new Error("User is not an admin");
}

module.exports.endpoint = async function (req, res) {
    const queryBody = req.body;
    const userId = req.query.user_id;
    const employerDoc = await companies.findOne({ _creator: userId });

    await users.update({ _id:  userId },{ $set: {'is_approved': queryBody.is_approved} });
    companyApprovedEmail.sendEmail(employerDoc._creator.email, employerDoc.first_name, employerDoc._creator.disable_account);
    res.send({
        success : true
    })
}

