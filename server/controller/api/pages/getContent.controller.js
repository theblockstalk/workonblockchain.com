const Pages = require('../../../model/pages_content');
const errors = require('../../services/errors');

module.exports = async function (req,res) {
    let queryBody = req.params;
    if(queryBody.title === 'Privacy Notice' || queryBody.title === 'Terms and Condition for candidate' || queryBody.title === 'Terms and Condition for company'){
        const pagesDoc = await Pages.findOne({page_name: queryBody.title}).sort({updated_date: 'descending'}).lean();
        if(pagesDoc) {
            res.send(pagesDoc);
        }
        else {
            errors.throwError("Pages doc not found", 404);
        }
    }
    else {
        const pagesDoc = await Pages.find({page_name: queryBody.title}).lean();
        if(pagesDoc) {
            res.send(pagesDoc);
        }
        else {
            errors.throwError("Pages doc not found", 404);
        }
    }
}
