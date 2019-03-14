const request = require('request');
const settings = require('../../../../settings');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const linkedinOAuth = settings.linkedinCredentials;
const Linkedin = require('node-linkedin')(linkedinOAuth.clientId, linkedinOAuth.clientSecret, linkedinOAuth.redirectUrl);
const FormData = require('form-data');

const googleAuth = module.exports.googleAuth = async function googleAuth(googleCode) {
    const googleConfig = settings.googleCredentials;
    const oauth = new OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirectUrl
    );
    const plus = google.plus('v1');
    const data = await getGoogleAccountFromCode(googleCode, oauth, plus);
    return data;

}

const linkedinAuth = module.exports.linkedinAuth = async function linkedinAuth(linkedinCode) {
    let urlBody = {};
    let form = new FormData();


    form.append('clientId' , linkedinOAuth.clientId);
    form.append('clientSecret' , linkedinOAuth.clientSecret);
    form.append('redirectUrl' , linkedinOAuth.redirectUrl);
    form.append('grant_type' , 'authorization_code');
    form.append('code' , linkedinCode);
    request.post({url:'https://www.linkedin.com/uas/oauth2/accessToken', formData: form}, function(err, httpResponse, body) {
        if (err) {
            return console.log('upload failed:');
        }
        console.log('Upload successful!  Server responded with:');
    });

    /*request.post({
            url: 'https://www.linkedin.com/uas/oauth2/accessToken',
            formData: form,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            method: 'POST'
        },

        function (e, r, body) {
            console.log(body);
        });*/
}

async function getGoogleAccountFromCode(googleCode, oauth, plus) {
    try {
        const {tokens} = await oauth.getToken(googleCode);
        // add the tokens to the google api so we have access to the account
        oauth.setCredentials(tokens);


        const response = await plus.people.get({userId: 'me', auth: oauth});
        const emailAddress = response.data.emails[0].value;
        return {
            email: emailAddress,
            google_id: response.data.id,
            first_name: response.data.name.familyName,
            last_name: response.data.name.givenName
        }
    }
    catch (error) {
        console.log("error");
        return {error: error};
    }
}