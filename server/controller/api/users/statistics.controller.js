const users = require('../../../model/mongoose/users');
const logger = require('../../services/logger');

module.exports = async function (req, res) {
    const approvedUserCount = await users.count({type: 'candidate', "candidate.latest_status.status" :'approved',
        disable_account : false, is_verify : 1});

    const blockchainExperienceCount = await users.count({type: 'candidate', "candidate.latest_status.status" :'approved',
        disable_account : false, is_verify : 1 ,
        $or: [{'candidate.blockchain.commercial_platforms': {$exists: true}, 'candidate.blockchain.commercial_platforms': {$exists: true}}]});

    res.send({
        approvedUsers :approvedUserCount,
        blockchainExperienceUsers : blockchainExperienceCount
    })
}