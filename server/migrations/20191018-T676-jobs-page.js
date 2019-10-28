const users = require('../model/mongoose/users');
const jobs = require('../model/mongoose/jobs');
const cities = require('../model/mongoose/cities');
const objects = require('../controller/services/objects');
const companies = require('../model/mongoose/companies');

let totalDocsToProcess = 0, totalModified = 0, totalProcessed = 0;

module.exports.up = async function() {

    const timestamp = new Date();
    totalDocsToProcess = await companies.count({});

    await companies.findAndIterate({}, async function(companyDoc) {
        totalProcessed++;
        console.log("Migrating company_id: " + companyDoc._id);

        let newJobIds = [];
        for (let savedSearch of companyDoc.saved_searches) {
            let newJob = {
                company_id: companyDoc._id,
                name: savedSearch.name,
                status: "open",
                work_type : savedSearch.work_type,
                positions: savedSearch.position,
                num_people_desired: 1,
                required_skills: savedSearch.required_skills,
                description : '',
                created : timestamp,
                modified : timestamp
            };
            if (savedSearch.visa_needed) newJob.visa_needed = savedSearch.visa_needed;
            if (savedSearch.job_type) newJob.job_type = savedSearch.job_type;
            if (savedSearch.current_salary) newJob.expected_salary_min = savedSearch.current_salary;
            if (savedSearch.expected_hourly_rate) newJob.expected_hourly_rate_min = savedSearch.expected_hourly_rate;
            if (savedSearch.current_currency) newJob.currency = savedSearch.current_currency;
            let newLocations = [];
            for (let location of savedSearch.location) {
                if (location.remote) {
                    newLocations.push({
                        remote: true
                    })
                } else {
                    const cityDoc = await cities.findOneById(location.city);
                    newLocations.push({
                        city_id: cityDoc._id,
                        city: cityDoc.city,
                        country: cityDoc.country,
                    })
                }
            }
            newJob.locations = newLocations;

            const newJobDoc = await jobs.insert(newJob);
            newJobIds.push(newJobDoc._id);
        }
        const update = {
            $set: {job_ids: newJobIds},
            $unset: {saved_searches: 1}
        };
        console.log("Updating company doc", update);
        await companies.updateOne({_id: companyDoc._id}, update)
    })
    console.log('Total companies document to process: ' + totalDocsToProcess);
    console.log('Total companies processed document: ' + totalProcessed);
};

module.exports.down = async function() {
    //will undo migration
};
