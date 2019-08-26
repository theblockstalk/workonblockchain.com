const zcrm = require('zcrmsdk');
const tokens = require('../../model/mongoose/tokens');

const user_identifier = "zcrm_default_user";

const config = {
    client_id: "1000.GP605I5C44F549062Y0ILIZMN9C79H",
    client_secret: "ac997b24a847c640c0a136b636714617247f97c9d8",
    redirect_url: "https://workonblockchain.com/test2callback",
    refresh_token: "1000.7213c235eef5884a2ebb530b5ea1047c.774f03692be9d98bec22c039b218ca41",
    mysql_module: "../../../../controller/services/zoho"
};

module.exports.initialize = async function () {
    await zcrm.initialize(config);
}

module.exports.generateAuthTokens = async function () {
    const grant_token = "1000.5bff64880077cb59116ba31b0bf7b8df.1f95cfcb62c6f860e39f1b706a498044";
    const auth_response = await  zcrm.generateAuthTokens(user_identifier, grant_token);

    // 1. Generate a grant token https://accounts.zoho.com/developerconsole
    // 2. Call this function to get a refresh token
    // 3. Save the refresh token as an envirenmont variable
    // Incorrect grant_token will throw unhandled promise rejection
}

module.exports.generateAuthTokenfromRefreshToken = async function() {
    await zcrm.generateAuthTokenfromRefreshToken(user_identifier,  config.refresh_token);
}

zcrm.API.MODULES.put({})


module.exports.saveOAuthTokens = async function (token_obj) {
    console.log("saveOAuthTokens", token_obj)

    await tokens.insert({
        token_type: 'zoho',
        zoho: token_obj,
        last_modified: Date.now()
    });

}

module.exports.updateOAuthTokens = async function (token_obj) {
    // Irrespective of response, the next execution happens. So care should be taken by the user in handling their module.
    console.log("updateOAuthTokens", token_obj)
    const tokenDoc = await tokens.findOneByType('zoho');
    if (!tokenDoc) {
        await this.saveOAuthTokens(token_obj);
    } else {
        await tokens.updateOne({_id: tokenDoc._id}, {$set: {
                zoho: token_obj,
                last_modified: Date.now()
            }
        });
    }
}

module.exports.getOAuthTokens = async function () {
    const tokenDoc = await tokens.findOneByType('zoho');
    console.log("getOAuthTokens", tokenDoc)

    return tokenDoc.zoho;
}