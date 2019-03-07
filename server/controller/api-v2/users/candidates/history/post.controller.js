const auth = require('../../../../middleware/auth-v2');
const users = require('../../../../../model/mongoose/users');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../../model/enumerations');
const errors = require('../../../../services/errors');
const sanitize = require('../../../../services/sanitize');
const objects = require('../../../../services/objects');
const candidateHistoryEmail = require('../../../../services/email/emails/candidateHistory');
const filterReturnData = require('../../../../api/users/filterReturnData');


module.exports.request = {
    type: 'post',
    path: '/users/:user_id/candidates/history'
};
const paramSchema = new Schema({
    user_id: String
});
const querySchema = new Schema({
    admin: Boolean
});
const bodySchema = new Schema({
    status: {
        type: String,
        enum: enumerations.candidateStatus,
        required:true,
    },
    reason: {
        type: String,
        enum: enumerations.statusReasons
    },
    note : String,
    email_html : String
});

module.exports.inputValidation = {
    params: paramSchema,
    query: querySchema,
    body: bodySchema
};

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);

    if (req.query.admin) {
        await auth.isAdmin(req);
    }
}

module.exports.endpoint = async function (req, res) {
    let userId;
    if (req.query.admin) {
        userId = req.params.user_id;
    }
    else {
        userId = req.auth.user._id;
    }

    let userDoc = await users.findOneById(userId);
    if(userDoc) {
        let queryInput = req.body;
        let timestamp = new Date();
        let history = {
            timestamp: timestamp
        }
        let set = {};
        if(queryInput.note) history.note = queryInput.note;
        if(queryInput.email_html) history.email_html = queryInput.email_html;
        if(queryInput.status) {
            let status = {
                status : queryInput.status
            }
            if(queryInput.reason) status.reason = queryInput.reason;
            history.status = status;

            let latestStatus = objects.copyObject(status);
            latestStatus.timestamp = timestamp;

            set['candidate.latest_status'] = latestStatus;
        }

        if(!userDoc.first_approved_date) set.first_approved_date = timestamp;
        await users.update({_id: userId}, {
            $push: {
                'candidate.history': {
                    $each: [history],
                    $position: 0
                }
            },
            $set : set
        });

        if(queryInput.email_html) {
            candidateHistoryEmail.sendEmail(userDoc.email, userDoc.first_name, sanitize.sanitizeHtml(queryInput.email_html), userDoc.disable_account);
        }

        userDoc = await users.findOneById(userId);
        const filterData = filterReturnData.removeSensativeData(userDoc);
        res.send(filterData);

    }
    else {
        errors.throwError("User not found", 404)
    }

}

