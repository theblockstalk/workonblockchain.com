const random = require('./random');
const enumerations = require('../../model/enumerations');

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

module.exports.initialJobOffer = function initialJobOffer() {
    return {
        sender_name: "My Company",
        receiver_name: "Tayyab",
        message: "",
        description: "this is for test case",
        job_title: "job title for test case",
        salary: random.integer(1),
        currency: random.enum(enumerations.currencies),
        date_of_joining: "",
        job_type: "Part Time",
        is_company_reply: 0,
        interview_location: "",
        interview_time: "",
        msg_tag: "job_offer"
    };
};

module.exports.message = function message() {
    return {
        sender_name: "My Company",
        receiver_name: "Tayyab",
        message: "this is a test msg",
        description: "",
        job_title: "",
        salary: "",
        currency: "",
        date_of_joining: "",
        job_type: "",
        is_company_reply: 1,
        interview_location: "",
        interview_time: "",
        msg_tag: "normal"
    };
};

module.exports.chatFile = function chatFile() {
    const file = this.image();
    return {
        message: 'file ',
        name: 'image.jpg',
        path: __dirname + '/image.jpg'
    };
};

module.exports.employmentOffer = function employmentOffer() {
    return {
        message: "You have been send an employment offer!",
        description: "this is a test description",
        job_title: "Test job title",
        salary: random.integer(1),
        currency: random.enum(enumerations.currencies),
        date_of_joining: "10-25-2018",
        job_type: "Full Time",
        msg_tag: "employment_offer"
    };
};

module.exports.changePassword = function changePassword(){
    return {
            current_password : "Password1",
            password : "myPassword1"
    }
}


module.exports.referredEmailDocs = function referredEmailDocs(){
    return {
        firstnameOfReferee : 'Tayyab',
        referred_fname : 'Salman',
        referred_lname : 'Safdar'
    }
}

module.exports.profileData = function profileData(){
    return {
        first_name : 'Tayyab',
        last_name : 'Hussain',
        github_account : 'fb.com',
        exchange_account : 'fb.com',
        linkedin_account : 'http://linkedin.com/in/sadia',
        medium_account : 'http://medium.com/sadia',
        contact_number : '65464655',
        nationality : 'Pakistani',
        country : 'Pakistan',
        city : 'Islamabad'
    }
}

module.exports.experience = function experience(){
    return {
        detail:{
            intro: 'I am a chief. I am a chief. I am a chief. I am a chief. I am a chief. I am a chief. I am a chief. I am a chief. I am a chief. I am a chief. I am a chief. '
        },
        education:[
            {
                uniname: 'CUST',
                degreename: 'BSCS',
                fieldname: 'CS',
                eduyear: 2016
            }
        ],
        work:[
            {
                companyname: 'MWAN',
                positionname: 'Developer',
                locationname: 'Tokyo Japan',
                description: 'i am in it. i am in it. i am in it. i am in it. i am in it. i am in it. i am in it. ',
                startdate: '2019-01-31T19:00:00.000Z',
                enddate: null,
                currentwork: true
            }
        ],
        language_exp: [
            {
                language: 'Java', exp_year: '0-1'
            },
            {
                language: 'C#', exp_year: '1-2'
            }
        ]
    }
}

module.exports.job = function job(){
    return {
        expected_salary: random.integer(1),
        base_currency: random.enum(enumerations.currencies),
        current_salary: random.integer(1),
        current_currency: random.enum(enumerations.currencies),
        availability_day: random.enum(enumerations.workAvailability),
        country: [
            {country: 'Afghanistan' , visa_needed : false} , {remote:true , visa_needed: false},
            {_id : '5c4aa17468cc293450c14c04' , visa_needed : true }
        ],
        roles: [
            random.enum(enumerations.workRoles), random.enum(enumerations.workRoles)
        ],
        interest_areas: [
            "I don't know" , 'Enterprise blockchain', 'Smart contract development'
        ]
    }
}

module.exports.resume = function resume(){
    return {
        why_work: 'I want to work. I want to work. I want to work. I want to work. I want to work. I want to work. I want to work.',
        commercially_worked: [],
        platforms_designed: [
            { value: 'Bitcoin' },
            { value: 'Hyperledger Sawtooth' }
        ],
        experimented_platforms:['Bitcoin' , 'Hyperledger Fabric' ],

        smart_contract_platforms:[
            {
                _id: '5bbc37432997bf00408501b7',
                name: 'Bitcoin',
                exp_year: '0-1'
            },
            {
                _id: '5bbc37432997bf00408501b6',
                name: 'Hyperledger Sawtooth',
                exp_year: '1-2'
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
        ]
    }
}
module.exports.termsAndConditions = function termsAndConditions(){
    return {
        terms: true,
        marketing: true
    }
}

module.exports.editCandidateProfile = function editCandidateProfile(){
    return {
        detail : {
            first_name: 'Sadia',
            last_name: 'Abbas',
            contact_number: '+92654654654',
            exchange_account: 'sadia_exchange.com',
            github_account: 'fb.com',
            linkedin_account : 'http://linkedin.com/in/sadia_abbas',
            medium_account : 'http://medium.com/sadia_abbas',
            nationality: 'Pakistani',
            base_country : 'Pakistan',
            city : 'Islamabad',
            expected_salary: random.integer(1),
            base_currency: random.enum(enumerations.currencies),
            salary: random.integer(1),
            current_currency: random.enum(enumerations.currencies),
            availability_day: '1 month',
            why_work: 'I want to work. I want to work. I want to work. I want to work.I want to work. I want to work. I want to work.',
            intro: 'I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. ',
            country: [
                {remote:true , visa_needed: false}, {country: 'Afghanistan' , visa_needed : false},
                {city : '5c4aa17468cc293450c14c04' , visa_needed : true }
            ],
            roles: [ 'Backend Developer', 'Fullstack Developer' ],
            interest_areas: ["I don't know", 'Enterprise blockchain', 'Smart contract development' ],
            platforms_designed: [
                { value: 'Bitcoin' },
                { value: 'Hyperledger Sawtooth' }
            ],
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
            language_experience_year: [
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
            ]

        } ,
        education : [{
            uniname: 'CUST',
            degreename: 'BSCS',
            fieldname: 'CS',
            eduyear: 2016
        }],
        work:[{
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


module.exports.cmsContent = function cmsContent() {
    return {
        title: "Privacy Notice",
        content: "<p>This notice sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed by us. Please read the following carefully to understand our views and practices regarding your sensitive information and how we will deal with it. For the purposes of the Data Protection Act 2018 (‘the DPA’) and the EU General Data Protection Regulation (‘the GDPR’), sensitive information includes what is defined as your ‘personal data’.</p>\n",
        name: "Privacy Notice"
    }
}

module.exports.image = function image(){
    return {
        name: 'image.jpg',
        path: __dirname + '/image.jpg'
    };
}

module.exports.cmsContentFroTC = function cmsContentFroTC() {
    return {
        page_title: "T&C for Company",
        html_text: "<p>These are Terms and Conditions for companies. We will not tolerate anything.</p>\n",
        page_name: "Terms and Condition for company"
    }
}

module.exports.cmsContentForTCCandidate = function cmsContentForTCCandidate() {
    return {
        page_title: "T&C for Candidate",
        html_text: "<p>These are Terms and Conditions for candidates. We will not tolerate anything.</p>\n",
        page_name: "Terms and Condition for company"
    }
}

module.exports.prefilledProfileData = function prefilledProfileData() {
    return {
        basics : {
            first_name: "Sadii",
            last_name: "Abbasi",
            summary : "I am developer. I am developer. I am developer. I am developer. I am developer. I am developer."
        },

        educationHistory: {
            uniname: 'CUST',
            degreename: 'BSCS',
            fieldname: 'CS',
            eduyear: 2016
        },
        workHistory : {
            companyname: 'MWAN Mobile',
            positionname: 'Team Lead',
            locationname: 'PWD islamabad',
            description: 'I am in this org. I am in this org. I am in this org. I am this org. I am in this org. I am in this org. I am in this org. I am in this orgg. ',
            startdate: '2016-02-29T19:00:00.000Z',
            enddate: '2018-10-09T07:32:38.732Z',
            currentwork: true
        }
    }
}

module.exports.companySavedSearches = function companySavedSearches() {
    return {
        saved_searches : [{
            location: [{'remote':true}],
            job_type : ['Part time'],
            position : ['Backend Developer', 'Fullstack Developer'],
            current_currency : random.enum(enumerations.currencies),
            current_salary : random.integer(1),
            blockchain : ['Ethereum' , 'Stellar'],
            skills : ['Java'],
            availability_day : '1 month' ,
            when_receive_email_notitfications : 'Daily'
        }]
    }
}

module.exports.subscribe = function subscribe() {
    return {
        first_name: "Tayyab",
        last_name: "Hussain",
        email: "tayyab@email.com"
    }
}