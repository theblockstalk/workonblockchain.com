const Schema = require('mongoose').Schema;
const errors = require('../../services/errors');
const enumerations = require('../../../model/enumerations');
const pages = require('../../../model/mongoose/pages');

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

module.exports.endpoint = async function (req, res) {
    let queryBody = req.query;
    let pagesDoc;
    if(queryBody.name === 'Privacy Notice' || queryBody.name === 'Terms and Condition for candidate' || queryBody.name === 'Terms and Condition for company')
        pagesDoc = await pages.findOneAndSort({page_name: queryBody.name});
    else pagesDoc = await pages.findOne({page_name: queryBody.name});

    if(pagesDoc) {
        res.send(pagesDoc);
    }
    else {
        errors.throwError("Pages doc not found", 404);
    }
}