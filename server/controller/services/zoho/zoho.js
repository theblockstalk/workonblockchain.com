const zcrm = require('zcrmsdk');
const objects = require('../objects');
const logger = require('../logger');
const settings = require('../../../settings');
// https://www.npmjs.com/package/@trifoia/zcrmsdk

const user_identifier = "zcrm_default_user";

const config = {
    client_id: settings.ZOHO.client_id,
    client_secret: settings.ZOHO.client_secret,
    redirect_url: settings.ZOHO.redirect_url,
    refresh_token: settings.ZOHO.refresh_token,
    mysql_module: "../../../../controller/services/zoho/mysql_module"
};

module.exports.initialize = async function () {
    await zcrm.initialize(config);
}

module.exports.generateAuthTokens = async function () {
    const grant_token = "1000.ba59c76cc16887ae9d474dfe8a73234f.7ce1091d0c78affad4daae908316f444"; // valid for max 10 mins
    const auth_response = await  zcrm.generateAuthTokens(user_identifier, grant_token);

    console.log(auth_response);
    // 1. Generate a grant token https://accounts.zoho.com/developerconsole
    // Scope = ZohoCRM.users.all,ZohoCRM.modules.all
    // 2. Call this function to get a refresh token
    // 3. Add the refresh token as an envirenmont variable
}

module.exports.generateAuthTokenfromRefreshToken = async function() {
    await zcrm.generateAuthTokenfromRefreshToken(user_identifier,  config.refresh_token);
}

const zohoAPIparse = async function (zcrmFn, module, input) {
    if (module) input.module = module;
    let response = await zcrmFn(input);
    if (typeof response === "string") {
        response = JSON.parse(response);
        logger.warn("No body in response from Zoho CRM", {response: response});
    } else {
        const body = JSON.parse(response.body);
        if (body) {
            if (body.status === "error") {
                let err = new Error();
                err.code = body.code;
                err.message = "Zoho CRM message: " + body.message;
                if (!objects.isEmpty(body.details)) err.message = err.message + ", details: " + JSON.stringify(body.details);
                throw err;
            }
            return body;
        }
    }
}

// https://www.zoho.com/crm/developer/docs/nodejs-sdk/module-samples.html?src=get_single_record
const zohoModuleAPI = function (module) {

    return {
        // https://www.zoho.com/crm/developer/docs/api/get-records.html
        getMany: async function (input) {
            if (input.id) throw new Error("Cannot provide record id");
            return await zohoAPIparse(module, input);
        },

        // https://www.zoho.com/crm/developer/docs/api/get-specific-record.html
        getOne: async function (input) {
            if (!input.id) throw new Error("Must provide record id")
            return await zohoAPIparse(zcrm.API.MODULES.get, module, input)
        },

        // https://www.zoho.com/crm/developer/docs/api/insert-records.html
        postMany: async function (input) {
            return await zohoAPIparse(zcrm.API.MODULES.post, module, input);
        },

        // https://www.zoho.com/crm/developer/docs/api/upsert-records.html
        upsert: async function (input) {
            return await zohoAPIparse(zcrm.API.MODULES.post, module+"/upsert", input)
        },

        // https://www.zoho.com/crm/developer/docs/api/update-records.html
        putMany: async function (input) {
            if (input.id) throw new Error("Cannot provide record id");
            return await zohoAPIparse(zcrm.API.MODULES.put, module, input);
        },

        // https://www.zoho.com/crm/developer/docs/api/update-specific-record.html
        putOne: async function (input) {
            if (!input.id) throw new Error("Must provide record id");
            return await zohoAPIparse(zcrm.API.MODULES.put, module, input);
        },

        // https://www.zoho.com/crm/developer/docs/api/delete-records.html
        deleteMany: async function (input) {
            if (input.id) throw new Error("Cannot provide record id");
            return await zohoAPIparse(zcrm.API.MODULES.delete, module, input);
        },

        // https://www.zoho.com/crm/developer/docs/api/delete-specific-record.html
        deleteOne: async function (input) {
            if (!input.id) throw new Error("Must provide record id");
            return await zohoAPIparse(zcrm.API.MODULES.delete, module, input);
        },

        // https://www.zoho.com/crm/developer/docs/api/search-records.html
        search: async function (input) {
            return await zohoAPIparse(zcrm.API.MODULES.search, module, input);
        }
    }
};

module.exports.contacts = zohoModuleAPI("Contacts");
module.exports.accounts = zohoModuleAPI("Accounts");
module.exports.users = {
    getCurrentUser: async function() {
        return await zohoAPIparse(zcrm.API.USERS.get, null, {
            params: {
                type: "CurrentUser"
            }
        });
    }
}
