const Schema = require('mongoose').Schema;
const sendGrid = require('../../services/email/sendGrid');
const settings = require('../../../settings');

module.exports.request = {
    type: 'post',
    path: '/subscribe'
};

const bodySchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports.inputValidation = {
    body: bodySchema
};

module.exports.endpoint = async function (req, res) {
    if (settings.isLiveApplication()) {
        const list = await sendGrid.getList('subscribers');
        const listId = list.id;

        const recipientUpdate = {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        };
        await updateSendGridRecipient(listId, recipientUpdate);
        const updateResponse = await sendgrid.updateRecipient(recipientUpdate);
        if (updateResponse.error_count > 0) {
            throw new Error(JSON.stringify({
                message: "Error updating subscriber",
                update: recipientUpdate,
                response: updateResponse
            }, null, 1))
        }
        const recipientId = updateResponse.persisted_recipients[0];
        await sendgrid.addRecipientToList(listId, recipientId);
    }
    else{
        res.send()
    }
}