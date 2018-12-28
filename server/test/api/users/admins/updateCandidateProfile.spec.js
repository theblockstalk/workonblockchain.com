const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('../candidate/candidateHelpers');
const adminHelper = require('./adminHelpers');
const userHelper = require('../../users/usersHelpers');

chai.use(chaiHttp);

describe('admin update candidate profile', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/update_profile', () => {

        it('it should update candidate profile by admin', async () => {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );
            await userHelper.makeAdmin(candidate.email);

            let  candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            const candidateEditProfileData = {
                user_id : candidateUserDoc._id,
                detail: {
                    first_name: 'Sadia',
                    last_name: 'Abbas',
                    contact_number: '+92654654654',
                    exchange_account: 'sadia_exchange.com',
                    github_account: 'fb.com',
                    nationality: 'Pakistani',
                    base_country: 'Pakistan',
                    city: 'Islamabad',
                    expected_salary: 1400,
                    base_currency: '$ USD ',
                    salary: 23000,
                    current_currency: '£ GBP',
                    availability_day: '1 month',
                    why_work: 'I want to work. I want to work. I want to work. I want to work.I want to work. I want to work. I want to work.',
                    intro: 'I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. ',
                    country: ['remote', 'Amsterdam'],
                    roles: ['Backend Developer', 'Fullstack Developer'],
                    interest_area: ['Enterprise blockchain', 'Smart contract development'],
                    platforms_designed: [
                        {value: 'Bitcoin'},
                        {value: 'Hyperledger Sawtooth'}
                    ],
                    experimented_platform: [
                        {
                            _id: '5bbc37432997bf00408501b9',
                            name: 'Bitcoin',
                            value: 'Bitcoin',
                            checked: true
                        },
                        {
                            _id: '5bbc37432997bf00408501b8',
                            name: 'Hyperledger Fabric',
                            value: 'Hyperledger Fabric',
                            checked: true
                        }
                    ],
                    platforms: [
                        {
                            _id: '5bbc37432997bf00408501b7',
                            platform_name: 'Bitcoin',
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

                    commercial_skills: [
                        {
                            skill: 'Formal verification',
                            exp_year: '0-1'
                        },
                        {
                            skill: 'Distributed computing and networks',
                            exp_year: '2-4'
                        }
                    ],
                    formal_skills: [
                        {
                            skill: 'P2P protocols',
                            exp_year: '1-2'
                        },
                        {
                            skill: 'Economics',
                            exp_year: '0-1'
                        }
                    ]

                },
                education: {
                    uniname: 'CUST',
                    degreename: 'BSCS',
                    fieldname: 'CS',
                    eduyear: 2016
                },
                work: {
                    companyname: 'MWAN',
                    positionname: 'Team Lead',
                    locationname: 'Tokyo Japan',
                    description: 'I am in this org. I am in this org. I am in this org. I am this org. I am in this org. I am in this org. I am in this org. I am in this orgg. ',
                    startdate: '2016-02-29T19:00:00.000Z',
                    enddate: '2018-10-09T07:32:38.732Z',
                    currentwork: true
                }
            }

            const res = await adminHelper.updateCandidateProfile(candidateEditProfileData ,candidateUserDoc.jwt_token);
            res.body.success.should.equal(true);

            candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            const blockchainSkills = candidateUserDoc.candidate.blockchain;

            candidateUserDoc.first_name.should.equal(candidateEditProfileData.detail.first_name);
            candidateUserDoc.last_name.should.equal(candidateEditProfileData.detail.last_name);
            candidateUserDoc.candidate.github_account.should.equal(candidateEditProfileData.detail.github_account);
            candidateUserDoc.candidate.stackexchange_account.should.equal(candidateEditProfileData.detail.exchange_account);
            candidateUserDoc.contact_number.should.equal(candidateEditProfileData.detail.contact_number);
            candidateUserDoc.nationality.should.equal(candidateEditProfileData.detail.nationality);
            candidateUserDoc.candidate.locations.should.valueOf(candidateEditProfileData.detail.country);
            candidateUserDoc.candidate.roles.should.valueOf(candidateEditProfileData.detail.roles);
            candidateUserDoc.candidate.interest_areas.should.valueOf(candidateEditProfileData.detail.interest_area);
            candidateUserDoc.candidate.expected_salary_currency.should.equal(candidateEditProfileData.detail.base_currency);
            candidateUserDoc.candidate.expected_salary.should.equal(candidateEditProfileData.detail.expected_salary);
            candidateUserDoc.candidate.availability_day.should.equal(candidateEditProfileData.detail.availability_day);
            candidateUserDoc.candidate.why_work.should.equal(candidateEditProfileData.detail.why_work);
            blockchainSkills.experimented_platforms.should.valueOf(candidateEditProfileData.detail.experimented_platform);
            blockchainSkills.smart_contract_platforms.should.valueOf(candidateEditProfileData.detail.platforms);
            candidateUserDoc.candidate.current_salary.should.equal(candidateEditProfileData.detail.salary);
            candidateUserDoc.candidate.current_currency.should.equal(candidateEditProfileData.detail.current_currency);
            candidateUserDoc.candidate.programming_languages.should.valueOf(candidateEditProfileData.detail.language_experience_year);
            candidateUserDoc.candidate.education_history.should.valueOf(candidateEditProfileData.education);
            candidateUserDoc.candidate.work_history.should.valueOf(candidateEditProfileData.work);
            candidateUserDoc.candidate.description.should.equal(candidateEditProfileData.detail.intro);
            candidateUserDoc.candidate.base_city.should.equal(candidateEditProfileData.detail.city);
            candidateUserDoc.candidate.base_country.should.equal(candidateEditProfileData.detail.base_country);
            blockchainSkills.commercial_skills[0].skill.should.equal(candidateEditProfileData.detail.commercial_skills[0].skill);
            blockchainSkills.commercial_skills[0].exp_year.should.equal(candidateEditProfileData.detail.commercial_skills[0].exp_year);
            blockchainSkills.formal_skills[0].skill.should.equal(candidateEditProfileData.detail.formal_skills[0].skill);
            blockchainSkills.formal_skills[0].exp_year.should.equal(candidateEditProfileData.detail.formal_skills[0].exp_year);


        })
    })
});