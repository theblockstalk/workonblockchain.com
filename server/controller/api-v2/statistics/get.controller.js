const users = require('../../../model/mongoose/users');
const Schema = require('mongoose').Schema;

module.exports.request = {
    type: 'get',
    path: '/statistics'
};

const querySchema = new Schema({
    name: String
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.endpoint = async function (req, res) {
    const approvedUserCount = await users.count({type: 'candidate', "candidate.latest_status.status" :'approved',
        disable_account : false, is_verify : 1});

    const blockchainExperienceCount = await users.count({type: 'candidate', "candidate.latest_status.status" :'approved',
        disable_account : false, is_verify : 1 ,
        'candidate.blockchain.commercial_platforms': {$exists: true, $ne : []}
    });

    res.send({
        approvedUsers :approvedUserCount,
        blockchainExperienceUsers : blockchainExperienceCount
    })
}