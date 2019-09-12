const tokens = require('../../../model/mongoose/tokens');

module.exports.saveOAuthTokens = async function (token_obj) {
    await tokens.insert({
        token_type: 'zoho',
        zoho: formatTokenObj(token_obj),
        last_modified: Date.now()
    });
}

const formatTokenObj = function (token_obj) {
    let res = {
        accesstoken: token_obj.access_token,
        refreshtoken: token_obj.refresh_token,
        expirytime: token_obj.expires_in,
        useridentifier: token_obj.user_identifier
    };

    if (token_obj.accesstoken) res.accesstoken = token_obj.accesstoken;
    if (token_obj.refreshtoken) res.refreshtoken = token_obj.refreshtoken;
    if (token_obj.expirytime) res.accesstoken = token_obj.expirytime;
    if (token_obj.useridentifier) res.accesstoken = token_obj.useridentifier;

    return res;
};

module.exports.updateOAuthTokens = async function (token_obj) {
    // Irrespective of response, the next execution happens. So care should be taken by the user in handling their module.
    const tokenDoc = await tokens.findOneByType('zoho');
    if (!tokenDoc) {
        await this.saveOAuthTokens(token_obj);
    } else {
        await tokens.updateOne({_id: tokenDoc._id}, {$set: {
                zoho: formatTokenObj(token_obj),
                last_modified: Date.now()
            }
        });
    }
}

module.exports.getOAuthTokens = async function () {
    const tokenDoc = await tokens.findOneByType('zoho');
    return [tokenDoc.zoho];
}