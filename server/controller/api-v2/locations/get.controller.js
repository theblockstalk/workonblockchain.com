const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const cities = require('../../../model/mongoose/cities');
const enumerations = require('../../../model/enumerations');

module.exports.request = {
    type: 'get',
    path: '/locations/'
};

const querySchema = new Schema({
    autosuggest: String,
    options: {
        countries: Boolean
    }
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
}

module.exports.endpoint = async function (req, res) {
    let queryInput = req.query;
    const filteredExp = queryInput.autosuggest.replace(/[#^*~?{}|&;$%',.-_@"<>()+]/g, "");
    let regex = new RegExp(filteredExp, 'i');
    let outputOptions = [];

    if(regex.test('Remote') || regex.test('Global')) {
        outputOptions.push({remote : true});
    }

    let citiesDoc = await cities.findAndLimit4({city: {$regex: regex}});
    if(citiesDoc) {
        for(let cityLoc of citiesDoc) {
            outputOptions.push({city : cityLoc});
        }

        if(queryInput.options && queryInput.options.countries) {
            for(let countryLoc of citiesDoc) {
                outputOptions.push({country : countryLoc.country});
            }
        }

    }
    if(queryInput.options && queryInput.options.countries) {
        const countriesEnum = enumerations.countries;
        let count = 0;
        for(let countryEnum of countriesEnum) {
            if(regex.test(countryEnum) && count < 2) {
                outputOptions.push({country : countryEnum});
                count++;
            }
        }
    }

    res.send({
        locations: outputOptions
    });
}