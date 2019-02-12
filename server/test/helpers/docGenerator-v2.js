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
            receiver_id: user_id,
            msg_tag: 'job_offer',
            message: {
                job_offer: {
                    title: randomString(),
                    salary: randomInteger(1),
                    salary_currency: randomEnum(enumerations.currencies),
                    type: randomEnum(enumerations.jobTypes),
                    location : "PWD Islamabad",
                    description: randomString(100)
                }
            }
        }
    },
    job_offer_accepted: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'job_offer_accepted',
            message: {
                job_offer_accepted: {
                    message: 'I am interested, lets chat!'
                }
            }
        }
    },
    job_offer_rejected: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'job_offer_rejected',
            message: {
                job_offer_rejected: {
                    message: 'I am not interested'
                }
            }
        }
    },
    normal: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'normal',
            message: {
                normal: {
                    message: 'hi man....'
                }
            }
        }
    },
    interview_offer: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'interview_offer',
            message: {
                interview_offer: {
                    location: 'Japan',
                    description: 'hi man....see',
                    date_time: Date.now()
                }
            }
        }
    },
    employment_offer: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'employment_offer',
            message: {
                employment_offer: {
                    title: randomString(),
                    salary: randomInteger(1),
                    salary_currency: randomEnum(enumerations.currencies),
                    type: randomEnum(enumerations.jobTypes),
                    start_date: Date.now(),
                    description: randomString(100)
                }
            }
        }
    },
    employment_offer_accepted: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'employment_offer_accepted',
            message: {
                employment_offer_accepted: {
                    employment_offer_message_id: randomString(),
                    message: randomString(100)
                }
            }
        }
    },
    employment_offer_rejected: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'employment_offer_rejected',
            message: {
                employment_offer_rejected: {
                    employment_offer_message_id: randomString(),
                    message: randomString(100)
                }
            }
        }
    },
    file: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'file'
        }
    }
};

module.exports.messageFile = function messageFile() {
    return {
        message: 'file ',
        name: 'image.jpg',
        path: __dirname + '/image.jpg'
    };
};