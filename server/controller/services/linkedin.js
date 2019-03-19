const request = require('request');
const querystring = require('querystring');
const settings = require('../../settings');

const linkedinOAuth = settings.linkedinCredentials;
const Linkedin = require('node-linkedin')(linkedinOAuth.clientId, linkedinOAuth.clientSecret, linkedinOAuth.redirectUrl);

module.exports.linkedinAuth = async function (linkedinCode) {

    const response = await getLinkedinAccessToken(linkedinCode);
    const responseData = JSON.parse(response);
    const data = await getLinkedinAccountFromCode(responseData.access_token);
    return data;

}

async function getLinkedinAccessToken(linkedinCode) {
    return new Promise((resolve, reject) => {
        const form = {
            client_id: linkedinOAuth.clientId,
            client_secret: linkedinOAuth.clientSecret,
            redirect_uri: linkedinOAuth.redirectUrl,
            grant_type: 'authorization_code',
            code: linkedinCode
        };

    const formData = querystring.stringify(form);
    const contentLength = formData.length;

    const options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'https://www.linkedin.com/uas/oauth2/accessToken',
        body: formData,
        method: 'POST'
    };
    request.post(options, function(error, res, body) {
        if(error) reject(error);
        resolve(body);
    });
});
}



async function getLinkedinAccountFromCode(code) {
    const linkedin = Linkedin.init(code);
    return new Promise((resolve, reject) => {
        try {
            linkedin.people.me(['id', 'first-name', 'last-name','email-address'], function(error, res) {
                if(error) reject(error);
                const userData = res;
                resolve({
                    email: userData.emailAddress,
                    linkedin_id: userData.id,
                    first_name: userData.firstName,
                    last_name: userData.lastName
                });
            });
        }
        catch (error) {
            throw new Error(error);
        }

    });
}
