const users = require('../model/mongoose/users');
const company = require('../model/mongoose/companies');
const logger = require('../controller/services/logger');

let totalProcessed = 0;

// This function will perform the migration
module.exports.up = async function() {
    for (const update of updates) {
        totalProcessed++;
        logger.debug("(" + totalProcessed + "/" + updates.length + ") Processing company " + update.email);

        const userDoc = await users.findOneByEmail(update.email);
        if (!userDoc) throw Error("User " + update.email + " not found");
        const updateObj = {
            $push: {
                'saved_searches': {
                    $each: [update.search]
                }
            }
        };
        console.log({_creator: userDoc._id}, updateObj);
        let updateResponse = await company.update({_creator: userDoc._id}, updateObj)
        console.log(updateResponse);
    }

    logger.debug('Total processed: ' + totalProcessed);
}

const updates = [
    {
        email: "daniel.yanev@bitfinex.com",
        search: {
            location: ["Remote"],
            job_type: ["Full time"],
            position: ['Backend Developer', 'Frontend Developer', 'Fullstack Developer'],
            availability_day: "3 months",
            current_currency: "$ USD",
            current_salary: 75000,
            // blockchain: [],
            skills: ["JavaScript", "Nodejs"],
            other_technologies : "Typescript, Webpack, Babel;  MongoDB and MySQL would be useful too",
            when_receive_email_notitfications : "Weekly",
            not_allowed: true,
            another_value: "I am a string"
        }
    },
    {
        email: "ruth@bitmama.io",
        search: {
            location: ["Remote"],
            job_type: ["Freelance"],
            position: ['Backend Developer'],
            availability_day: "3 months",
            current_currency: "$ USD",
            current_salary: 90000,
            // blockchain: ["Ripple", "Ethereum", "Bitcoin", "Stellar"],
            skills: ["Go"],
            other_technologies: "MongoDB, AWS",
            when_receive_email_notitfications: "Weekly"
        }
    },{
        email: "gioele.cerati@ies-italia.it",
        search: {
            location: ["Remote"],
            job_type: ["Freelance"],
            position: ['Backend Developer', 'Mobile app developer' ],
            availability_day: "3 months",
            current_currency: "$ USD",
            current_salary: 50000,
            // blockchain: [],
            skills: ["Java", "Python"],
            other_technologies: "Queue systems, distributed systems, FFMPEG",
            when_receive_email_notitfications: "Daily"
        }
    }
];


// This function will undo the migration
module.exports.down = async function() {
    for (const update of updates) {
        totalProcessed++;
        logger.debug("(" + totalProcessed + "/" + updates.length + ") Processing company " + update.email);

        const userDoc = await users.findOneByEmail(update.email);
        if (!userDoc) throw Error("User " + update.email + " not found");
        await company.update({_creator: userDoc._id}, {$unset: { 'saved_searches': 1 }})
    }


    logger.debug('Total processed: ' + totalProcessed);
}