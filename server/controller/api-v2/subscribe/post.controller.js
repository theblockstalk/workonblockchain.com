const Schema = require('mongoose').Schema;
const sendGrid = require('../../services/email/sendGrid');

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

async function getList(listName) {
    let lists = await sendGrid.getAllLists();
    console.log(lists);

    for (const list of lists.lists) {
        if (list.name === listName) {
            return list;
        }
    }
}

module.exports.endpoint = async function (req, res) {
    console.log('in endpoint');
    let added = 0, updated = 0, errors = 0;
    const list = await getList('subscriber');
    console.log(list);
    const listId = list.id;
    const updateResponse = await sendGrid.updateRecipient({
        email: req.body.email,
        user: "false"
    });

    const recipientUpdate = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name};
    await updateSendGridRecipient(listId, recipientUpdate);

    async function updateSendGridRecipient(listId, recipientUpdate) {
        try {
            logger.debug('Updating sendgrid recipient', recipientUpdate);

            const updateResponse = await sendGrid.updateRecipient(recipientUpdate);

            added = added + updateResponse.new_count;
            updated = updated + updateResponse.updated_count;
            errors = errors + updateResponse.error_count;

            if (updateResponse.error_count > 0) {
                logger.error("Error updating user", {
                    update: recipientUpdate,
                    response: updateResponse
                });
            }

            const recipientId = updateResponse.persisted_recipients[0];
            await sendGrid.addRecipientToList(listId, recipientId);
        } catch (error) {
            logger.error(error.message, {
                stack: error.stack,
                name: error.name
            });
            errors = errors + 1;
        }
    }

    res.send({
        added: added,
        updated: updated,
        errors: errors
    });
}