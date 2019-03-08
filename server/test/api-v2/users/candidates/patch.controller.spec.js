const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator-v2');
const candidateHelper = require('./candidateHelpers');
const userHelper = require('../../../api/users/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('update candidate profile', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('Patch /users/user_id/candidates', () => {

        it('it should update candidate profile', async () => {

        const candidate = docGenerator.candidate();
        const profileData = docGenerator.candidateProfile();

        await candidateHelper.candidateProfile(candidate, profileData);

        let  candidateUserDoc = await users.findOne({email: candidate.email}).lean();
        const candidateEditProfileData = {
            user_id : candidateUserDoc._id,
            contact_number: '+92654654654',
            exchange_account: 'sadia_exchange.com',
            github_account: 'fb.com',
            nationality: 'Pakistani',
            base_country: 'Pakistan',
            base_city: 'Islamabad',
            expected_salary: 1400,
            expected_salary_currency: '$ USD',
            current_salary: 23000,
            current_currency: '£ GBP',
            availability_day: '1 month',
            why_work: 'I want to work. I want to work. I want to work. I want to work.I want to work. I want to work. I want to work.',
            description: 'I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. I am developer. ',
            locations: ['remote', 'Amsterdam'],
            roles: ['Backend Developer', 'Fullstack Developer'],
            interest_areas: ['Enterprise blockchain', 'Smart contract development'],

            experimented_platforms: ['Bitcoin' , 'Hyperledger Fabric'],

            smart_contract_platforms: [
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
            programming_languages: [
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
            ],
            education_history: [{
                uniname: 'CUST',
                degreename: 'BSCS',
                fieldname: 'CS',
                eduyear: 2016
            }],
            work_history: [{
                companyname: 'MWAN',
                positionname: 'Team Lead',
                locationname: 'Tokyo Japan',
                description: 'I am in this org. I am in this org. I am in this org. I am this org. I am in this org. I am in this org. I am in this org. I am in this orgg. ',
                startdate: '2016-02-29T19:00:00.000Z',
                enddate: '2018-10-09T07:32:38.732Z',
                currentwork: true
            }]
        }

        const res = await candidateHelper.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);
        candidateUserDoc = await users.findOne({email: candidate.email}).lean();
        const blockchainSkills = candidateUserDoc.candidate.blockchain;
        candidateUserDoc.candidate.github_account.should.equal(candidateEditProfileData.github_account);
        candidateUserDoc.candidate.stackexchange_account.should.equal(candidateEditProfileData.exchange_account);
        candidateUserDoc.contact_number.should.equal(candidateEditProfileData.contact_number);
        candidateUserDoc.nationality.should.equal(candidateEditProfileData.nationality);
        candidateUserDoc.candidate.locations.should.valueOf(candidateEditProfileData.locations);
        candidateUserDoc.candidate.roles.should.valueOf(candidateEditProfileData.roles);
        candidateUserDoc.candidate.interest_areas.should.valueOf(candidateEditProfileData.interest_areas);
        candidateUserDoc.candidate.expected_salary_currency.should.equal(candidateEditProfileData.expected_salary_currency);
        candidateUserDoc.candidate.expected_salary.should.equal(candidateEditProfileData.expected_salary);
        candidateUserDoc.candidate.availability_day.should.equal(candidateEditProfileData.availability_day);
        candidateUserDoc.candidate.why_work.should.equal(candidateEditProfileData.why_work);
        blockchainSkills.experimented_platforms.should.valueOf(candidateEditProfileData.experimented_platforms);
        blockchainSkills.smart_contract_platforms.should.valueOf(candidateEditProfileData.smart_contract_platforms);
        candidateUserDoc.candidate.current_salary.should.equal(candidateEditProfileData.current_salary);
        candidateUserDoc.candidate.current_currency.should.equal(candidateEditProfileData.current_currency);
        candidateUserDoc.candidate.programming_languages.should.valueOf(candidateEditProfileData.programming_languages);
        candidateUserDoc.candidate.education_history.should.valueOf(candidateEditProfileData.education_history);
        candidateUserDoc.candidate.work_history.should.valueOf(candidateEditProfileData.work_history);
        candidateUserDoc.candidate.description.should.equal(candidateEditProfileData.description);
        candidateUserDoc.candidate.base_city.should.equal(candidateEditProfileData.base_city);
        candidateUserDoc.candidate.base_country.should.equal(candidateEditProfileData.base_country);
        blockchainSkills.commercial_skills[0].skill.should.equal(candidateEditProfileData.commercial_skills[0].skill);
        blockchainSkills.commercial_skills[0].exp_year.should.equal(candidateEditProfileData.commercial_skills[0].exp_year);
        blockchainSkills.formal_skills[0].skill.should.equal(candidateEditProfileData.formal_skills[0].skill);
        blockchainSkills.formal_skills[0].exp_year.should.equal(candidateEditProfileData.formal_skills[0].exp_year);

    })
})
});