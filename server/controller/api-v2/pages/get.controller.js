const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const errors = require('../../services/errors');
const enumerations = require('../../../model/enumerations');
const Pages = require('../../../model/pages_content');

module.exports.request = {
    type: 'get',
    path: '/pages/'
};

const querySchema = new Schema({
    name: enumerations.pages,
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    await auth.isValidUser(req);
}

module.exports.endpoint = async function (req, res) {
    let queryBody = req.query;
    if(queryBody.name === 'Privacy Notice' || queryBody.name === 'Terms and Condition for candidate' || queryBody.name === 'Terms and Condition for company'){
        const pagesDoc = await Pages.findOne({page_name: queryBody.name}).sort({updated_date: 'descending'}).lean();
        if(pagesDoc) {
            res.send(pagesDoc);
        }
        else {
            errors.throwError("Pages doc not found", 404);
        }
    }
    else {
        const pagesDoc = await Pages.find({page_name: queryBody.name}).lean();
        if(pagesDoc) {
            res.send(pagesDoc);
        }
        else {
            errors.throwError("Pages doc not found", 404);
        }
    }
}