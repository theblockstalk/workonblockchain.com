const profile = require('./profile');

///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    await profile.update(userId, req.body.detail, req.body.education, req.body.work, userId);

    res.send({
        success: true
    });
}