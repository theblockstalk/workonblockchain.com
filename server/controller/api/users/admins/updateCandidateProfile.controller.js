const profile = require('../candidate/profile');

///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    const candidateId = req.body.user_id;

    await profile.update(candidateId, req.body.detail, req.body.education, req.body.work, userId);

    res.send({
        success: true
    });
}