const users = require('../model/mongoose/users');
const cities = require('../model/mongoose/cities');
const companies = require('../model/mongoose/company');
const enumeration =  require('../model/enumerations');
const mongoose = require('mongoose');
const logger = require('../controller/services/logger');
const csv=require('csvtojson');
const citiesFilePath = __dirname + '/files/T422-cities-collection.csv';
const nationalityFilePath = __dirname + '/files/T422-nationality-to-country-mappig.csv';

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0, totalCompanyProcessed=0, totalCompanyModified=0;
let totalCompanyIncompleteDoc=0, newDocs= 0, totalIncompleteDoc= 0;

module.exports.up = async function() {
    const locationsJsonArray=await csv().fromFile(citiesFilePath);
    console.log("Total no location in csv: " +locationsJsonArray.length)

    for(let location of locationsJsonArray) {
        let data = {
            city : location.City,
            country : location.Country,
            active : true,
        }
       // logger.debug("cities document: ", data);
        //await cities.insert(data);
        newDocs++;
    }
    console.log("No of locations added in cities collection: " + newDocs);

    totalDocsToProcess =await users.count({type : 'candidate'});
    logger.debug(totalDocsToProcess);

    //process nationality csv
    const nationalityJsonArray=await csv().fromFile(nationalityFilePath);
    logger.debug("Nationality document object: ", nationalityJsonArray);

    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        totalProcessed++;
        let locations=[];
        if(userDoc.candidate.locations) {
            console.log("candidate Doc id: " + userDoc._id);
            console.log("candidate Doc locations:  " + userDoc.candidate.locations);

            /// find in cities collection
            await cities.findAndIterate({city :  {$in: userDoc.candidate.locations}}, async function(citiesDoc) {
                if(userDoc.candidate.locations.find(x => x === 'London')) {
                    if(citiesDoc.city === 'London' && citiesDoc.country === 'United Kingdom') {
                        locations.push({city: citiesDoc._id.toString(), visa_needed: true});
                    }
                }
                else if(userDoc.candidate.locations.find(x => x === 'Barcelona')) {
                    if(citiesDoc.city === 'Barcelona' && citiesDoc.country === 'Spain') {
                        locations.push({city: citiesDoc._id.toString(), visa_needed: true});
                    }
                }
                else if(userDoc.candidate.locations.find(x => x === 'Los Angeles')) {
                    if(citiesDoc.city === 'Los Angeles' && citiesDoc.country === 'United States') {
                        locations.push({city: citiesDoc._id.toString(), visa_needed: true});
                    }
                }
                else {
                    locations.push({city: citiesDoc._id.toString(), visa_needed: true});
                }

            });

            for(let loc of userDoc.candidate.locations) {
                if(loc === 'remote') {
                    locations.push({remote:true, visa_needed: false});
                }
            }

            //base_country
            const countriesEnum = enumeration.countries;
            if(userDoc.candidate.base_country) {
                if(countriesEnum.find(x => x === userDoc.candidate.base_country)) {
                    locations.push({country: userDoc.candidate.base_country, visa_needed : false});
                }
            }

            //nationality
            if(userDoc.nationality) {
                for(let loc of nationalityJsonArray) {
                    const checkCountryExists = obj =>obj.country === loc.Country;
                    if(loc.Nationality === userDoc.nationality && locations.some(checkCountryExists) === false) {
                        locations.push({country: loc.Country, visa_needed : false});
                    }
                }
            }

            if(locations && locations.length > 0) {
                console.log("locations: " + locations);
                await users.update({ _id: userDoc._id },{ $set: {'candidate.locations' : locations} });
                totalModified++;
            }

        }
        else {
            totalIncompleteDoc++;
        }
    });

    await users.findAndIterate({type : 'company'}, async function(userDoc) {
        totalCompanyProcessed++;
        let locations=[];
        const companyDoc = await companies.findOne({_creator : userDoc._id});
        if(companyDoc) {
            console.log("Company Doc id: " + companyDoc._id);
            if(companyDoc.saved_searches && companyDoc.saved_searches.length > 0) {
                console.log("company Doc searched locations:  " + companyDoc.saved_searches[0].location);
                await cities.findAndIterate({city :  {$in: companyDoc.saved_searches[0].location}}, async function(citiesDoc) {
                    if(citiesDoc.city === 'London') {
                        if (citiesDoc.country === 'United Kingdom') locations.push({city: citiesDoc._id.toString()});
                    }
                    else if(citiesDoc.city === 'Barcelona') {
                        if (citiesDoc.country === 'Spain') locations.push({city: citiesDoc._id.toString()});
                    }
                    else if(citiesDoc.city === 'Los Angeles') {
                        if (citiesDoc.country === 'United States') locations.push({city: citiesDoc._id.toString()});
                    }
                    else {
                        locations.push({city: citiesDoc._id.toString()});
                    }
                });

                for(let loc of companyDoc.saved_searches[0].location) {
                    if(loc === 'remote') {
                        locations.push({remote:true});
                    }
                }
                if(locations && locations.length > 0) {
                    await companies.update({ _id: companyDoc._id },{ $set: {'saved_searches.0.location' : locations , 'saved_searches.0.visa_needed' : false} });
                    totalCompanyModified++;
                }
            }
            else {
                totalCompanyIncompleteDoc++;
            }
        }


    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user document with incomplete profile: ' + totalIncompleteDoc);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
    console.log('Total company processed document: ' + totalCompanyProcessed);
    console.log('Total company document with incomplete profile: ' + totalCompanyIncompleteDoc);
    console.log('Total company modified document: ' + totalCompanyModified);
}

module.exports.down = async function() {

    totalDocsToProcess =await users.count({type : 'candidate'});
    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        let locations = [];
        totalProcessed++;

        console.log("candidate Doc id: " + userDoc._id);
        logger.debug("candidate Doc locations:  ", userDoc.candidate.locations);

        if(userDoc.candidate.locations) {
            for(let loc of userDoc.candidate.locations) {
                if(loc.city){
                    const cityDoc= await cities.findOneById(mongoose.Types.ObjectId(loc.city));
                    locations.push(cityDoc.city);
                }
                if(loc.remote === true) {
                    locations.push("remote");
                }
            }

            console.log("candidate locations: " +locations);
            await users.update({ _id: userDoc._id },{ $set: {'candidate.locations' : locations} });
            totalModified++;

        }
    });

    await users.findAndIterate({type : 'company'}, async function(userDoc) {
        let locations = [];
        totalCompanyProcessed++;

        console.log("company user Doc id: " + userDoc._id);
        const companyDoc = await companies.findOne({_creator : userDoc._id});

        if(companyDoc && companyDoc.saved_searches && companyDoc.saved_searches.length > 0) {
            for(let loc of companyDoc.saved_searches[0].location) {
                if(loc.city){
                    const cityDoc= await cities.findOneById(mongoose.Types.ObjectId(loc.city));
                    locations.push(cityDoc.city);
                }
                if(loc.remote === true) {
                    locations.push("remote");
                }
            }
            console.log("saved searches location: " +locations);
            await companies.update({ _id: companyDoc._id },{ $set: {'saved_searches.0.location' : locations} });
            totalCompanyModified++;

        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
    console.log('Total company processed document: ' + totalCompanyProcessed);
    console.log('Total company modified document: ' + totalCompanyModified);
}
