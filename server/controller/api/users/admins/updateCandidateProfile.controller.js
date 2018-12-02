const profile = require('../candidate/profile');

///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {
    const userId = req.body.user_id;

    await profile.update(userId, req.body.detail, req.body.education, req.body.work);

    res.send({
        success: true
    });
}