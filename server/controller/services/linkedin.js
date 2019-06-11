const request = require('request');
const querystring = require('querystring');
const settings = require('../../settings');
const errors = require('./errors');

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
    const profile = await getLinkedinLiteProfile(code);
    const email = await getLinkedinEmailAddress(code);
    const response = {
        linkedin_id: profile.id,
        first_name: profile.localizedFirstName,
        last_name: profile.localizedLastName,
        email: email.elements[0]['handle~'].emailAddress
    }
    return response;
}

async function getLinkedinLiteProfile(code) {
    return new Promise((resolve, reject) => {
        var options = {
            url: "https://api.linkedin.com/v2/me",
            method: 'GET',
            headers: {
                'Host': "api.linkedin.com",
                'Connection': "Keep-Alive",
                'Authorization': 'Bearer ' + code
            },
            json: true
        };

    request.get(options, function(error, res, body) {
        if(error) reject(error);
        resolve(body);
    });
});
}

async function getLinkedinEmailAddress(code) {
    return new Promise((resolve, reject) => {
        var options = {
            url: "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
            method: 'GET',
            headers: {
                'Host': "api.linkedin.com",
                'Connection': "Keep-Alive",
                'Authorization': 'Bearer ' + code
            },
            json: true
        };

    request.get(options, function(error, res, body) {
        if(error) reject(error);
        resolve(body);
    });
});
}
