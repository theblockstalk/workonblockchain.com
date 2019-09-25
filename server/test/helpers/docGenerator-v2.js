const enumerations = require('../../model/enumerations');
const random = require('./random');

module.exports.messages = {
    approach: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'approach',
            message: {
                approach: {
                    employee: {
                        job_title: random.string(),
                        annual_salary: random.integer(1),
                        currency: random.enum(enumerations.currencies),
                        employment_type: random.enum(enumerations.employmentTypes),
                        location : "PWD Islamabad",
                        employment_description: random.string(100)
                    }
                }
            }
        }
    },
    approach_accepted: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'approach_accepted',
            message: {
                approach_accepted: {
                    message: 'I am interested, lets chat!'
                }
            }
        }
    },
    approach_rejected: function(user_id) {
        return {
            receiver_id: user_id,
            msg_tag: 'approach_rejected',
            message: {
                approach_rejected: {
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
                    type: random.enum(enumerations.employmentTypes),
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
        company_phone: "926546456",
        company_country: "Pakistan",
        company_postcode: "25000",
        company_city: "RWP",
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
        company_phone: "090078601",
        company_country: "Pakistan",
        company_postcode: "44000",
        company_city: "rawalpindi",
        company_founded:2013,
        no_of_employees:8,
        company_funded:"i have no idea",
        company_description:"Global blockchain agnostic hiring platform for developers.",

        when_receive_email_notitfications : 'Daily',

        saved_searches : [{
            location: [
                {remote:true },
                {_id : '5c4aa17468cc293450c14c04'}
            ],
            job_type : ['Full time'],
            position : ['UI Developer', 'Fullstack Developer'],
            current_currency : random.enum(enumerations.currencies),
            current_salary : random.integer(1),
            blockchain : ['Ripple' , 'Stellar'],
            skills : ['C#'],
            residence_country : ['Pakistan']
        }]

    }
}


module.exports.candidate = function candidate() {
    return {
        first_name: random.string(5),
        last_name: random.string(5),
        email: random.email(),
        password: 'Sadia1234'
    };
};

module.exports.candidateProfile = function candidateProfile(){
    return {
        contact_number: '+92654654654',
        nationality: [random.enum(enumerations.nationalities)],
        candidate: {
            base_country : random.enum(enumerations.countries),
            base_city : 'Islamabad',
            stackexchange_account: 'https://www.exchange.com',
            github_account: 'https://www.fb.com',
            linkedin_account : 'https://linkedin.com/in/sadia_abbas',
            medium_account : 'https://medium.com/sadiaAbbas',
            current_salary: random.integer(10000, 100000),
            current_currency: random.enum(enumerations.currencies),
            why_work: random.string(10),
            description: random.string(10),
            employee: {
                location: [
                    {remote:true , visa_needed: false}, {country: 'Afghanistan' , visa_needed : false},
                    {city : '5c4aa17468cc293450c14c04' , visa_needed : true }
                ],
                roles: [ random.enum(enumerations.workRoles), random.enum(enumerations.workRoles) ],
                expected_annual_salary: random.integer(10, 100000),
                currency: random.enum(enumerations.currencies),
                employment_availability: random.enum(enumerations.workAvailability),
            },
            interest_areas: [random.enum(enumerations.workBlockchainInterests) ,  random.enum(enumerations.workBlockchainInterests)],
            blockchain: {
                experimented_platforms:[random.enum(enumerations.blockchainPlatforms) , random.enum(enumerations.blockchainPlatforms)],
                commercial_platforms : [
                    {
                        name : random.enum(enumerations.blockchainPlatforms),
                        exp_year : "4-6"
                    },
                    {
                        name : random.enum(enumerations.blockchainPlatforms),
                        exp_year : "1-2"
                    }
                ],

                commercial_skills : [
                    {
                        skill: random.enum(enumerations.otherSkills),
                        exp_year: '0-1'
                    },
                    {
                        skill: random.enum(enumerations.otherSkills),
                        exp_year: '2-4'
                    }
                ],
                description_commercial_platforms : random.string(10),
                description_commercial_skills : random.string(10),
                description_experimented_platforms : random.string(10),
            },
            programming_languages: [
                {
                    language: 'Java', exp_year: '1-2'
                },
                {
                    language: 'C#', exp_year: '0-1'
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
            }]
        }

    }
}

module.exports.changeCandidateStatus = function changeCandidateStatus(){
    return {
        note : 'Note for this profile',
        email_html : '<p>Hi, i have just approved your profile</p>',
        email_subject : 'Welcome to workonblockchain.com!',
        status : 'approved'
    }
}

module.exports.candidateProfileUpdate = function candidateProfileUpdate(){
    return {
        contact_number: '+926246524',
        nationality: [random.enum(enumerations.nationalities)],
        candidate: {
            stackexchange_account: 'stackexchange.com',
            github_account: 'https://fb12.com',
            base_city : 'Islamabad',

            employee: {
                location: [
                    {remote:true , visa_needed: false}, {country: 'Afghanistan' , visa_needed : false},
                    {city : '5c4aa17468cc293450c14c04' , visa_needed : true }
                ],
                roles: [ random.enum(enumerations.workRoles), random.enum(enumerations.workRoles) ],
            },
            interest_areas: [random.enum(enumerations.workBlockchainInterests) ,  random.enum(enumerations.workBlockchainInterests)],
            blockchain: {
                experimented_platforms:[random.enum(enumerations.blockchainPlatforms) , random.enum(enumerations.blockchainPlatforms)],
                commercial_platforms : [
                    {
                        name : random.enum(enumerations.blockchainPlatforms),
                        exp_year : "4-6"
                    },
                    {
                        name : random.enum(enumerations.blockchainPlatforms),
                        exp_year : "1-2"
                    }
                ],
                commercial_skills : [
                    {
                        skill: random.enum(enumerations.otherSkills),
                        exp_year: '0-1'
                    },
                    {
                        skill: random.enum(enumerations.otherSkills),
                        exp_year: '2-4'
                    }
                ],
                description_commercial_platforms : random.string(10),
                description_commercial_skills : random.string(10),
                description_experimented_platforms : random.string(10)
            },

            programming_languages: [
                {
                    language: 'Java',
                    exp_year: '1-2'
                },
                {
                    language: 'C#',
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
            }]
        }
    }
}

module.exports.accountSetting = function accountSetting(){
    return {
        marketing_emails : true,
        is_unread_msgs_to_send : false
    }
}

module.exports.termsAndConditions = function termsAndConditions(){
    return {
        marketing_emails: true
    }
}

module.exports.companyTnCWizard = function companyTnCWizard() {
    return {
        marketing_emails: true
    }
}

module.exports.cmsContentFroTC = function cmsContentFroTC() {
    return {
        page_title: "T&C for Company",
        page_content: "<p>These are Terms and Conditions for companies. We will not tolerate anything.</p>\n",
        page_name: "Terms and Condition for company"
    }
}

module.exports.newEmailTemplate = function newEmailTemplate() {
    return {
        name: "Template 1",
        subject: "Template subject",
        body: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>",
    }
}

module.exports.updateEmailTemplate = function updateEmailTemplate() {
    return {
        name: "Template 1 update",
        subject: "Template subject update",
        body: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry update.</p>",
    }
}

module.exports.companyGDPRDOc = function companyGDPRDOc(){
    return {
        name: 'doc.pdf',
        path: __dirname + '/doc.pdf'
    }
}

module.exports.companyGDPR = function companyGDPR(){
    return {
        'company_country': "Canada",
        'canadian_commercial_company': false
    }
}