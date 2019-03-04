const users = require('../../../model/mongoose/users');
const logger = require('../../services/logger');

module.exports = async function (req, res) {
    const approvedUserCount = await users.count({type: 'candidate', "candidate.history.0.status.status" :'approved',
        disable_account : false, is_verify : 1});
    console.log(approvedUserCount);

    const blockchainExperienceCount = await users.count({type: 'candidate', "candidate.history.0.status.status" :'approved',
        disable_account : false, is_verify : 1 ,
        $or: [{'candidate.blockchain.commercial_platforms': {$exists: true}, 'candidate.blockchain.smart_contract_platforms': {$exists: true}}]});
    console.log(blockchainExperienceCount);
    res.send({
        approvedUsers :approvedUserCount,
        blockchainExperienceUsers : blockchainExperienceCount
    })

}