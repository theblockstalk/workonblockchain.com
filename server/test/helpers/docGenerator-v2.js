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


module.exports.candidate = function candidate() {
    return {
        first_name: "Tayyab",
        last_name: "Hussain",
        email: random.email(),
        password: "Password1",
        type: "candidate",
        social_type : ""
    };
};

module.exports.candidateProfile = function candidateProfile(){
    return {
        contact_number: '+92654654654',
        exchange_account: 'sadia_exchange.com',
        github_account: 'fb.com',
        linkedin_account : 'http://linkedin.com/in/sadia_abbas',
        medium_account : 'http://medium.com/sadia_abbas',
        nationality: 'Pakistani',
        base_country : 'Pakistan',
        base_city : 'Islamabad',
        expected_salary: 1400,
        expected_salary_currency: '$ USD',
        current_salary: 23000,
        current_currency: '£ GBP',
        availability_day: '1 month',
        why_work: 'I want to work. I want to work. I want to work. I want to work.I want to work. I want to work. I want to work.',
        description: 'I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. ',
        locations: [
            {remote:true , visa_needed: false}, {country: 'Afghanistan' , visa_needed : false},
            {city : '5c4aa17468cc293450c14c04' , visa_needed : true }
        ],
        roles: [ 'Backend Developer', 'Fullstack Developer' ],
        interest_areas: ["I don't know", 'Enterprise blockchain', 'Smart contract development' ],

        experimented_platforms:['Bitcoin' , 'Hyperledger Fabric'],

        smart_contract_platforms:[
            {
                _id: '5bbc37432997bf00408501b7',
                name: 'Bitcoin',
                exp_year: '0-1'
            },
            {
                _id: '5bbc37432997bf00408501b6',
                platform_name: 'Hyperledger Sawtooth',
                exp_year: '1-2'
            }
        ],
        programming_languages: [
            {
                language: 'Java', exp_year: '1-2'
            },
            {
                language: 'C#', exp_year: '0-1'
            }
        ],

        commercial_skills : [
            {
                skill: 'Formal verification',
                exp_year: '0-1'
            },
            {
                skill: 'Distributed computing and networks',
                exp_year: '2-4'
            }
        ],
        formal_skills : [
            {
                skill: 'P2P protocols',
                exp_year: '1-2'
            },
            {
                skill: 'Economics',
                exp_year: '0-1'
            }
        ],
        education_history : [{
            uniname: 'CUST',
            degreename: 'BSCS',
            fieldname: 'CS',
            eduyear: 2016
        }],
        work_history:[{
            companyname: 'MWAN',
            positionname: 'Team Lead',
            locationname: 'Tokyo Japan',
            description: 'I am in this org. I am in this org. I am in this org. I am this org. I am in this org. I am in this org. I am in this org. I am in this orgg. ',
            startdate: '2016-02-29T19:00:00.000Z',
            enddate: '2018-10-09T07:32:38.732Z',
            currentwork: true
        }],
        status : 'wizard completed'
    }
}

module.exports.changeCandidateStatus = function changeCandidateStatus(){
    return {
        note : 'Note for this profile',
        email_text : 'Hi, i have just approved your profile',
        status : 'approved'
    }
}


