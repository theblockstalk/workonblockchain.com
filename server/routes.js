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
const registerCandidate = require('./controller/api/users/candidate/register.controller')
const registerCompany = require('./controller/api/users/company/createCompany.controller')

router.get('/', healthCheck);

router.post('/users/authenticate', authenticate);
router.put('/users/emailVerify/:email_hash' , verifyEmail);
router.put('/users/forgot_password/:email' , forgotPassword);
router.put('/users/change_password/:id' , changePassword);
router.put('/users/reset_password/:hash' , resetPassword);
router.put('/users/verify_client/:email' , verifyClient);
router.post('/users/refered_user_email' , referredEmail)

router.post('/users/register', registerCandidate);

router.post('/users/create_employer', registerCompany);


module.exports = router;