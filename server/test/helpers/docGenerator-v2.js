const enumerations = require('../../model/enumerations');
const random = require('./random');

module.exports.messages = {
    job_offer: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'job_offer',
            message: {
                job_offer: {
                    title: random.string(),
                    salary: random.integer(1),
                    salary_currency: random.enum(enumerations.currencies),
                    type: random.enum(enumerations.jobTypes),
                    location : "PWD Islamabad",
                    description: random.string(100)
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
                    title: random.string(),
                    salary: random.integer(1),
                    salary_currency: random.enum(enumerations.currencies),
                    type: random.enum(enumerations.jobTypes),
                    start_date: Date.now(),
                    description: random.string(100)
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
                    employment_offer_message_id: random.string(),
                    message: random.string(100)
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
                    employment_offer_message_id: random.string(),
                    message: random.string(100)
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

module.exports.company = function company() {
    return {
        first_name: "Salman",
        last_name: "Safdar",
        email: random.email(),
        job_title: "Designer",
        company_name: "My Company",
        company_website: "my-web.com",
        phone_number: "926546456",
        country: "Pakistan",
        postal_code: "25000",
        city: "RWP",
        password: "Password1",
        type: "company"
    };
};


module.exports.companyUpdateProfile = function companyUpdateProfile(){
    return {
        first_name: "Sara",
        last_name: "khan",
        job_title: "Developer",
        company_name: "Mwan Mobile",
        company_website: "www.mwanmobile.com",
        phone_number: "090078601",
        country: "Pakistan",
        postal_code: "44000",
        city: "rawalpindi",
        company_founded:2013,
        no_of_employees:8,
        company_funded:"i have no idea",
        company_description:"Global blockchain agnostic hiring platform for developers.",

        when_receive_email_notitfications : 'Daily',

        saved_searches : [{
            location: [
                {remote:true , visa_needed: false},
                {_id : '5c4aa17468cc293450c14c04' , visa_needed : true }
            ],
            job_type : ['Full time'],
            position : ['UI Developer', 'Fullstack Developer'],
            current_currency : '$ USD',
            current_salary : 2000,
            blockchain : ['Ripple' , 'Stellar'],
            skills : ['C#'],
            availability_day : '1 month' ,
            residence_country : ['Pakistan']
        }]

    }
}
