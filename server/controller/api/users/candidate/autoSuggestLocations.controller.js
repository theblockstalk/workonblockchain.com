const cities = require('../../../../model/mongoose/cities');
const enumerations = require('../../../../model/enumerations');
const logger = require('../../../services/logger');

module.exports = async function (req, res) {
    console.log("endpoint");
    let queryInput = req.body;
    let regex = new RegExp(queryInput.autosuggest, 'i');
    let outputOptions = [];

    if(regex.test('Remote') || regex.test('Global')) {
        outputOptions.push({remote : true});
    }

    let citiesDoc = await cities.findAndLimit2({city: {$regex: regex}});
    if(citiesDoc) {
        for(let cityLoc of citiesDoc) {
            outputOptions.push({city : cityLoc});
        }

        if(queryInput.countries === true) {
            for(let countryLoc of citiesDoc) {
                outputOptions.push({country : countryLoc.country});
            }
        }


    }

    if(queryInput.countries === true) {
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