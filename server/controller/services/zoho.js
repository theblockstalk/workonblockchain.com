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

module.exports.contacts = {
    get: async function (inputs) {
        const response = await zcrm.API.MODULES.get({
            module: "Contacts",
            params: {
                page: 0,
                per_page: 5
            }
        });

        const result = JSON.parse(response.body);

        console.log(result);

        // let result = "<html><body><b> Top 5 Leads</b>";
        // let data = response.body;
        // data = JSON.parse(data);
        // data = data.data;
        // for (i in data){
        //
        //     let record = data[i];
        //     let name = record.Full_Name;
        //
        //     result+="<br><span>"+name+"</span>";
        //
        // }
        //
        // result+="</body></html>";

    }
};


module.exports.saveOAuthTokens = async function (token_obj) {
    console.log("saveOAuthTokens", token_obj)

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
    console.log("updateOAuthTokens", token_obj)
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
    console.log("getOAuthTokens", tokenDoc)
    // let zoho_token = tokenDoc.zoho;
    // zoho_token.expirytime = zoho_token.expires_in;
    // zoho_token.refreshtoken = zoho_token.refresh_token;
    return [tokenDoc.zoho];
}