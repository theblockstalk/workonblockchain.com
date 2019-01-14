

module.exports.candidate = function candidate() {
    return {
        first_name: "Tayyab",
        last_name: "Hussain",
        email: "tayyab@mail.com",
        password: "Password1",
        type: "candidate",
        social_type : ""
    };
};

module.exports.company = function company() {
    return {
        first_name: "Salman",
        last_name: "Safdar",
        email: "salman@email.com",
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
        salary: 1500,
        currency: "€ EUR",
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
        salary: 2000,
        currency: "€ EUR",
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

module.exports.accountSetting = function accountSetting(){
    return {
            statusName : 'disabledAccount',
            statusValue : true
    }
}


module.exports.companyTnCWizard = function companyTnCWizard(){
    return {
        terms:true,
        marketing: true
    }
}

module.exports.companyAbout = function companyAbout(){
    return {
        company_founded:2015,
        no_of_employees:10,
        company_funded:"i don't know",
        company_description:"Global blockchain agnostic hiring platform for developers, designers, product managers, CTO's and interns who are passionate about public and enterprise blockchain technology and cryptocurrencies."
    }
}


module.exports.companyUpdateProfile = function companyUpdateProfile(){
    return {
        info : {
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
            company_description:"Global blockchain agnostic hiring platform for developers."
        },

        saved_searches : [{
            location: ['Amsterdam'],
            job_type : ['Full time'],
            position : ['UI Developer', 'Fullstack Developer'],
            current_currency : '$ USD',
            current_salary : 2000,
            blockchain : ['Ripple' , 'Stellar'],
            skills : ['C#'],
            availability_day : '1 month' ,
            when_receive_email_notitfications : 'Never'
        }]

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
        expected_salary: 50000,
        base_currency: '€ EUR',
        current_salary: 20000,
        current_currency: '£ GBP',
        availability_day: '1 month',
        country: [
            'remote', 'Amsterdam', 'Berlin'
        ],
        roles: [
            'Backend Developer', 'Fullstack Developer'
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
            nationality: 'Pakistani',
            base_country : 'Pakistan',
            city : 'Islamabad',
            expected_salary: 1400,
            base_currency: '$ USD ',
            salary: 23000,
            current_currency: '£ GBP',
            availability_day: '1 month',
            why_work: 'I want to work. I want to work. I want to work. I want to work.I want to work. I want to work. I want to work.',
            intro: 'I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. ',
            country: [ 'remote', 'Amsterdam' ],
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
        education : {
            uniname: 'CUST',
            degreename: 'BSCS',
            fieldname: 'CS',
            eduyear: 2016
        },
        work:{
            companyname: 'MWAN',
            positionname: 'Team Lead',
            locationname: 'Tokyo Japan',
            description: 'I am in this org. I am in this org. I am in this org. I am this org. I am in this org. I am in this org. I am in this org. I am in this orgg. ',
            startdate: '2016-02-29T19:00:00.000Z',
            enddate: '2018-10-09T07:32:38.732Z',
            currentwork: true
        }
    }
}


module.exports.cmsContent = function cmsContent() {
    return {
        page_title: "Privacy Notice",
        html_text: "<p>This notice sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed by us. Please read the following carefully to understand our views and practices regarding your sensitive information and how we will deal with it. For the purposes of the Data Protection Act 2018 (‘the DPA’) and the EU General Data Protection Regulation (‘the GDPR’), sensitive information includes what is defined as your ‘personal data’.</p>\n",
        page_name: "Privacy Notice"
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
            location: ['remote'],
            job_type : ['Part time'],
            position : ['Backend Developer', 'Fullstack Developer'],
            current_currency : '$ USD',
            current_salary : 1000,
            blockchain : ['Ethereum' , 'Stellar'],
            skills : ['Java'],
            availability_day : '1 month' ,
            when_receive_email_notitfications : 'Daily'
        }]
    }
}

