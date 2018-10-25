const Candidate = require('../model/candidate_profile');

module.exports.up = async function up() {
    console.log('Up')
    let allCandidates = await Candidate.find({}).lean();
    console.log(allCandidates);
}


module.exports.down = async function down() {
    console.log('Down')
}