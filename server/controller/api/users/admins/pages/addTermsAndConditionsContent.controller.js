const Pages = require('../../../../../model/pages_content');
const logger = require('../../../../services/logger');
const sanitize = require('../../../../services/sanitize');
const mongoose = require('mongoose');

//////////inserting message in DB ////////////

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    let info = req.body;
    const sanitizedHtml = sanitize.sanitizeHtml(req.unsanitizedBody.html_text);
    let document = new Pages
    ({
        page_title : info.page_title,
        page_content : sanitizedHtml,
        page_name : info.page_name,
        updated_by : userId,
        updated_date: new Date(),
    });
    const result = await document.save();
    res.send(document);
};