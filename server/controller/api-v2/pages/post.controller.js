const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../model/enumerations');
const sanitize = require('../../services/sanitize');
const Pages = require('../../../model/pages_content');
const logger = require('../../services/logger');

module.exports.request = {
    type: 'post',
    path: '/pages/'
};

const bodySchema = new Schema({
    name:{
        type:String,
        enum: enumerations.pages,
        required:true,
    },
    title:{
        type:String,
        required: true,
    },
    content: {
        type:String,
        required:true,
    }
});

module.exports.inputValidation = {
    body: bodySchema
};

module.exports.auth = async function (req) {
    await auth.isAdmin(req);
}

const insertNewPage = async function (name, content, title, user_id) {
    let addNewPage = new Pages
    ({
        page_name : name,
        page_content: content,
        page_title: title,
        updated_by: user_id,
        updated_date: new Date(),
    });
    const newPageDoc = await addNewPage.save();
    return newPageDoc;
}

module.exports.endpoint = async function (req, res) {
    const userId = req.auth.user._id;
    let queryBody = req.body;
    logger.info(req.body);
    const sanitizedHtml = sanitize.sanitizeHtml(req.unsanitizedBody.content, true);
    if(queryBody.name === 'Terms and Condition for company' || queryBody.name === 'Terms and Condition for candidate'){
        const pageData = await insertNewPage(queryBody.name, sanitizedHtml, queryBody.title,userId);
        res.send({
            success : true,
            information : pageData
        })
    }
    else{
        const pagesDoc = await Pages.findOne({ page_name: queryBody.name}).lean();
        if(pagesDoc) {
            let updatePage =
                {
                    page_content : sanitizedHtml,
                    page_title : queryBody.title,
                    updated_by : userId,
                    updated_date: new Date(),
                };

            await Pages.update({ _id: pagesDoc._id },{ $set: updatePage });
            res.send({
                success : true
            })
        }
        else {
            const pageData = await insertNewPage(queryBody.name, sanitizedHtml, queryBody.title,userId);
            res.send(pageData);
        }
    }
}