const Pages = require('../../../../../model/pages_content');
const logger = require('../../../../services/logger');
const sanitize = require('../../../../services/sanitize');

//////////inserting message in DB ////////////

module.exports = async function (req,res) {
    console.log("add content");
    let userId = req.auth.user._id;
    let queryBody = req.body;
    logger.info(req.body);
    console.log(queryBody.page_name);
    const sanitizedHtml = sanitize.sanitizeHtml(req.unsanitizedBody.html_text);
    const pagesDoc = await Pages.findOne({ page_name: queryBody.page_name}).lean();
    if(pagesDoc) {
        let updatePage =
            {
                page_content : sanitizedHtml,
                page_title : queryBody.page_title,
                updated_by : userId,
                updated_date: new Date(),
            };

        await Pages.update({ _id: pagesDoc._id },{ $set: updatePage });
        res.send({
            success : true
        })
    }
    else {
        let addNewPage = new Pages
        ({
            page_name : queryBody.page_name,
            page_content: sanitizedHtml,
            page_title: queryBody.page_title,
            updated_by: userId,
            updated_date: new Date(),
        });
        const newPageDoc = await addNewPage.save();
        res.send({
            success : true,
            information : newPageDoc
        })
    }


}
