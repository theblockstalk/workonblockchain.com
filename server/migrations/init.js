const users = require('../model/mongoose/users');
const pages = require('../model/mongoose/pages');
const { pages: pageEnumerations } = require('../model/enumerations');
const logger = require('../controller/services/logger');

// This function will perform the migration
module.exports.up = async function() {
    const userDoc = await users.findOne({});
    const userId = userDoc._id;
    console.log("User found: " + userId.toString());

    const now = new Date()

    for (let pageName of pageEnumerations) {
        const doc = {
            page_name: pageName,
            page_title: "Dummy",
            page_content: "Dummy",
            updated_by: userId,
            updated_date: now
        }
        await pages.insert(doc);

        console.log('added: ', pageName)
    }

    await users.updateOne({ _id: userId }, {
        $set: { is_admin: 1, is_verify: 1 }
    })

    console.log("Updated user to verified admin")
}

// This function will undo the migration
module.exports.down = async function() {}