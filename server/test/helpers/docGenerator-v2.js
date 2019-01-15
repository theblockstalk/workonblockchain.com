const crypto = require('crypto');
const enumerations = require('../../model/enumerations');

function randomString(length = 10) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

function randomEmail() {
    return randomString() + '@example.com';
}

function randomBoolean() {
    if (Math.random() > 0.5) {
        return true;
    } else {
        return false;
    }
}

function randomInteger(min = 0, max = 10000) {
    return Math.floor((max - min)*Math.random()) - min;
}

function randomEnum(enums) {
    const keyNo = Math.floor(Math.random() * enums.length);
    return enums[keyNo];
}

module.exports.messages = {
    job_offer: function(user_id) {
        return {
            user_id: user_id,
            msg_tag: 'job_offer',
            message: {
                job_offer: {
                    title: randomString(),
                    salary: randomInteger(1),
                    salary_currency: randomEnum(enumerations.currencies),
                    type: randomEnum(enumerations.jobTypes),
                    description: randomString(100)
                }
            }
        }
    }
};