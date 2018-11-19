const settings = require('../../../settings');
var Q = require('q');
const User = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const EmployerProfile = require('../../../model/employer_profile');

module.exports = async function (req, res) {

    const userDoc = await User.find({is_verify : 1 , is_approved : 1 , disable_account : true , type : 'company' });
    console.log(userDoc);


}