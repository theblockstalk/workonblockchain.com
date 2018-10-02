const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Chats = require('../../../model/chat');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHepler = require('../../helpers/companyHelpers');
const candidateHepler = require('../../helpers/candidateHelpers');
const getInitialJobOfferDetailHelper = require('../../helpers/getInitialJobOfferDetailHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('send initial job offer to candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        //await mongo.drop();
    })

    describe('POST /users/get_job_desc_msgs', () => {

        it('it should send a job offer to candidate', async () => {

            //creating a company
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupcompany(company);
            companyRes.should.have.status(200);
            const companyDoc = await Users.findOne({email: company.email}).lean();
            companyDoc.email.should.equal(company.email);
            companyDoc.is_verify.should.equal(1);
            companyDoc.is_approved.should.equal(1);
            should.exist(companyDoc.jwt_token)

            //creating a candidate
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);
            candidateRes.should.have.status(200);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            userDoc.email.should.equal(candidate.email);
            userDoc.is_verify.should.equal(1);
            userDoc.is_approved.should.equal(1);
            should.exist(userDoc.jwt_token)

            //checking if initial job offer is sent or not
            const initialJobOffer = docGenerator.initialJobOffer();
            const initialJobOfferRes = await getInitialJobOfferDetailHelper.getInitialJobOfferDetail(companyDoc._id,userDoc._id,initialJobOffer.msg_tag,companyDoc.jwt_token);
            initialJobOfferRes.should.have.status(200);

            //sender_id:sender_id,receiver_id:receiver_id,msg_tag:msg_tag
            //headers: new HttpHeaders().set('Authorization', this.token)
            /*const res = await chai.request(server)
                .post('/users/get_job_desc_msgs')
                .send(candidate);

            res.should.have.status(200);


            userDoc.email.should.equal(candidate.email);
            userDoc.is_verify.should.equal(1);
            userDoc.is_approved.should.equal(0);
            userDoc.is_admin.should.equal(0);
            userDoc.disable_account.should.equal(false);
            userDoc.type.should.equal("candidate");
            should.exist(userDoc.jwt_token)

            const salt = userDoc.salt;
            let hash = crypto.createHmac('sha512', salt);
            hash.update(candidate.password);
            const hashedPasswordAndSalt = hash.digest('hex');
            userDoc.password_hash.should.equal(hashedPasswordAndSalt);

            const candidateDoc = await Candidates.findOne({_creator: userDoc._id}).lean();
            should.exist(candidateDoc);
            candidateDoc.marketing_emails.should.equal(false);*/
        })
    })
});