const skills = require('../../../model/mongoose/skills');
const enumerations = require('../../../model/enumerations');
const random = require('../../helpers/random');

module.exports.createJob = async function(userId) {
    const newjob = {
        name: random.string(),
        type: random.enum(enumerations.skillsTpes),
        added_by: userId,
        created_date: new Date()
    }
    return await skills.insert(newjob);

}