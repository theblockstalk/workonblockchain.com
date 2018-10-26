const EmployerProfile = require('../../../../model/employer_profile');
const Candidate = require('../../../../model/candidate_profile');
const User = require('../../../../model/users');


const logger = require('../../../services/logger');


module.exports = async function (req, res) {
    const availability_day = await Candidate.aggregate([
        { $group: {_id:{source:"$availability_day"}, count:{$sum:1}} }
    ]);

    res.json({
        availability_day: availability_day
    })

}