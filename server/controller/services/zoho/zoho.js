const zcrm = require('zcrmsdk');

// https://www.npmjs.com/package/@trifoia/zcrmsdk
// TODO:
// 1. write WOB userDoc to zoho parser
// 2. github sdk upsert

const user_identifier = "zcrm_default_user";

const config = {
    client_id: "1000.GP605I5C44F549062Y0ILIZMN9C79H",
    client_secret: "ac997b24a847c640c0a136b636714617247f97c9d8",
    redirect_url: "https://workonblockchain.com/test2callback",
    refresh_token: "1000.7213c235eef5884a2ebb530b5ea1047c.774f03692be9d98bec22c039b218ca41",
    mysql_module: "../../../../controller/services/zoho/zohoTokens"
};

module.exports.initialize = async function () {
    await zcrm.initialize(config);
}

module.exports.generateAuthTokens = async function () {
    const grant_token = "1000.5bff64880077cb59116ba31b0bf7b8df.1f95cfcb62c6f860e39f1b706a498044"; // valid for max 10 mins
    const auth_response = await  zcrm.generateAuthTokens(user_identifier, grant_token);

    console.log(auth_response);
    // 1. Generate a grant token https://accounts.zoho.com/developerconsole
    // 2. Call this function to get a refresh token
    // 3. Add the refresh token as an envirenmont variable
    // Incorrect grant_token will throw unhandled promise rejection
}

module.exports.generateAuthTokenfromRefreshToken = async function() {
    await zcrm.generateAuthTokenfromRefreshToken(user_identifier,  config.refresh_token);
}

const zohoAPIparse = async function (module, type, input) {
    input.module = module;
    const response = await zcrm.API.MODULES[type](input);
    return JSON.parse(response.body).data;
}

// https://www.zoho.com/crm/developer/docs/nodejs-sdk/module-samples.html?src=get_single_record
const zohoModuleAPI = function (module) {

    return {
        // https://www.zoho.com/crm/developer/docs/api/get-records.html
        getMany: async function (input) {
            if (input.id) throw new Error("Cannot provide record id");
            return await zohoAPIparse(module, "get", input);
        },

        // https://www.zoho.com/crm/developer/docs/api/get-specific-record.html
        getOne: async function (input) {
            if (!input.id) throw new Error("Must provide record id")
            return await zohoAPIparse(module, "get", input)
        },

        // https://www.zoho.com/crm/developer/docs/api/insert-records.html
        postMany: async function (input) {
            return await zohoAPIparse(module, "post", input);
        },

        // https://www.zoho.com/crm/developer/docs/api/upsert-records.html
        // upsert: async function (input) {
        //     return await zohoAPIparse(module, "post", input)
        // },

        // https://www.zoho.com/crm/developer/docs/api/update-records.html
        putMany: async function (input) {
            if (input.id) throw new Error("Cannot provide record id");
            return await zohoAPIparse(module, "put", input);
        },

        // https://www.zoho.com/crm/developer/docs/api/update-specific-record.html
        putOne: async function (input) {
            if (!input.id) throw new Error("Must provide record id");
            return await zohoAPIparse(module, "put", input);
        },

        // https://www.zoho.com/crm/developer/docs/api/delete-records.html
        deleteMany: async function (input) {
            if (input.id) throw new Error("Cannot provide record id");
            return await zohoAPIparse(module, "delete", input);
        },

        // https://www.zoho.com/crm/developer/docs/api/delete-specific-record.html
        deleteOne: async function (input) {
            if (!input.id) throw new Error("Must provide record id");
            return await zohoAPIparse(module, "delete", input);
        },

        // https://www.zoho.com/crm/developer/docs/api/search-records.html
        search: async function (input) {
            return await zohoAPIparse(module, "search", input);
        }
    }
};

module.exports.contacts = zohoModuleAPI("Contacts");
module.exports.accounts = zohoModuleAPI("Accounts");