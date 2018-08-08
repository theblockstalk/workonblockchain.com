const express = require('express');
const router = express.Router();
const multer = require('./controller/middleware/multer');

const healthCheck = require('./controller/api/healthCheck.controller');
const authenticate = require('./controller/api/users/auth/authenticate.controller');
const verifyEmail = require('./controller/api/users/auth/verifyEmail.controller');
const forgotPassword = require('./controller/api/users/auth/forgotPassword.controller');
const changePassword = require('./controller/api/users/auth/changePassword.controller');
const resetPassword = require('./controller/api/users/auth/resetPassword.controller');
const verifyClient = require('./controller/api/users/auth/verifyClient.controller');
const referredEmail = require('./controller/api/users/auth/referredEmail.controller');

const candidateRegister = require('./controller/api/users/candidate/register.controller');
const candidateDelete = require('./controller/api/users/candidate/delete.controller');
const candidateGetAll = require('./controller/api/users/candidate/getAll.controller');
const candidateGetCurrent = require('./controller/api/users/candidate/getCurrent.controller');
const candidateImage = require('./controller/api/users/candidate/image.controller');
const candidateReferred = require('./controller/api/users/candidate/referred_id.controller');
const candidateUpdate = require('./controller/api/users/candidate/updateProfile.controller');
const candidateWizardAbout = require('./controller/api/users/candidate/wizard/about.controller');
const candidateWizardExperience = require('./controller/api/users/candidate/wizard/experience.controller');
const candidateWizardJob = require('./controller/api/users/candidate/wizard/job.controller');
const candidateWizardResume = require('./controller/api/users/candidate/wizard/resume.controller');
const candidateWizardTnC = require('./controller/api/users/candidate/wizard/termsAndConditions.controller');

const registerCompany = require('./controller/api/users/company/createCompany.controller');

const insertMessage = require('./controller/api/chat/insertMessage.controller');

const addPrivacyContent = require('./controller/api/pages/addPrivacyContent.controller');

router.get('/', healthCheck);

// User authorization
router.post('/users/authenticate', authenticate);
router.put('/users/emailVerify/:email_hash' , verifyEmail);
router.put('/users/forgot_password/:email' , forgotPassword);
router.put('/users/change_password/:id' , changePassword);
router.put('/users/reset_password/:hash' , resetPassword);
router.put('/users/verify_client/:email' , verifyClient);
router.post('/users/refered_user_email' , referredEmail)

// Candidates
router.post('/users/register', candidateRegister);
router.get('/users/', candidateGetAll);
router.get('/users/current/:id', candidateGetCurrent);
router.delete('/users/:_id', candidateDelete);
router.put('/users/welcome/terms/:_id', candidateWizardTnC);
router.put('/users/welcome/about/:_id', candidateWizardAbout);
router.put('/users/welcome/job/:_id', candidateWizardJob);
router.put('/users/welcome/resume/:_id', candidateWizardResume);
router.put('/users/welcome/exp/:_id', candidateWizardExperience);
router.post('/users/image/:_id', multer.single('photo'), candidateImage);
router.put('/users/refered_id/:id' , candidateReferred);
router.put('/users/update_profile/:_id' , candidateUpdate);

// Companies
router.post('/users/create_employer', registerCompany);

// Chat
router.post('/users/insert_message', insertMessage);

// Pages
router.put('/users/add_privacy_content'  , addPrivacyContent);


module.exports = router;