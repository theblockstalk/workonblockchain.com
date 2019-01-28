const cities = require('../../../../model/mongoose/cities');
const enumerations = require('../../../../model/enumerations');
module.exports = async function (req, res) {
    console.log("endpoint");
    console.log(req.params);
    let queryInput = req.params.query_input;
    let regex = new RegExp(queryInput, 'i');
    let outputOptions = [];

    if(regex.test('Remote') || regex.test('Global')) {
        outputOptions.push({remote : true});
    }

    let citiesDoc = await cities.findAndLimit2({city: {$regex: regex}});
    if(citiesDoc) {
        for(let cityLoc of citiesDoc) {
            console.log(typeof cityLoc._id);
            outputOptions.push({city : cityLoc});
        }

        for(let countryLoc of citiesDoc) {
            outputOptions.push({country : countryLoc.country});
        }

    }

    const countriesEnum = enumerations.countries;
    let count = 0;
    for(let countryEnum of countriesEnum) {
        if(regex.test(countryEnum) && count < 2) {
            outputOptions.push({country : countryEnum});
            count++;
        }
    }

    res.send({
        locations: outputOptions
    });


}