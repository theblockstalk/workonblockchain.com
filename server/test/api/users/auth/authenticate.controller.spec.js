const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Candidates = require('../../../../model/candidate_profile');
const Companies = require('../../../../model/employer_profile');
const companyHepler = require('../company/companyHelpers');
const candidateHepler = require('../candidate/candidateHelpers');
const authenticateHepler = require('./authenticateHelpers');
const docGenerator = require('../../../helpers/docGenerator');


const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('login as company or candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/authenticate' , () =>
    {
        it('it should login candidate or company' , async () =>
        {
            //candidate
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);
            candidateRes.should.have.status(200);

            const authenticateCandidate = await authenticateHepler.authenticateUser(candidate.email, candidate.password);
            authenticateCandidate.should.have.status(200);

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            candidateUserDoc.email.should.equal(candidate.email);

            const salt = candidateUserDoc.salt;
            let hash = crypto.createHmac('sha512', salt);
            hash.update(candidate.password);
            const hashedPasswordAndSalt = hash.digest('hex');
            candidateUserDoc.password_hash.should.equal(hashedPasswordAndSalt);

            //company
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);
            companyRes.should.have.status(200);

            const authenticateCompany = await authenticateHepler.authenticateUser(company.email, company.password);
            authenticateCompany.should.have.status(200);

            const companyUserDoc = await Users.findOne({email: company.email}).lean();
            companyUserDoc.email.should.equal(company.email);

            const passwordSalt  = companyUserDoc.salt;
            let passwordHash  = crypto.createHmac('sha512', passwordSalt );
            passwordHash .update(company.password);
            const passwordHashedAndSalt  = passwordHash.digest('hex');
            companyUserDoc.password_hash.should.equal(passwordHashedAndSalt );



        })
    })

});