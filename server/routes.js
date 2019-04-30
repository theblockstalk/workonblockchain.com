const express = require('express');
const router = express.Router();
const multer = require('./controller/middleware/multer');
const auth = require('./controller/middleware/auth');
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');

const healthCheck = require('./controller/api/healthCheck.controller');

// User authorization
const authVerifyEmail = require('./controller/api/users/auth/verifyEmail.controller');
const authForgotPassword = require('./controller/api/users/auth/forgotPassword.controller');
const authChangePassword = require('./controller/api/users/auth/changePassword.controller');
const authResetPassword = require('./controller/api/users/auth/resetPassword.controller');
const authVerifyClient = require('./controller/api/users/auth/verifyClient.controller');
const authAccountDisableSetting = require('./controller/api/users/auth/account_setting.controller');
const authDestroyTokenOnLogout = require('./controller/api/users/auth/destroyTokenOnLogout.controller');

// Referrals
const refGetReferralCode = require('./controller/api/users/referrals/getReferralCode.controller');
const refReferral = require('./controller/api/users/referrals/referral.controller');
const getReferralCodeForUsers = require('./controller/api/users/referrals/getReferralCodeForUsers.controller');
const getReferralDetailForAdmin  = require('./controller/api/users/referrals/getReferralDetailForAdmin.controller');

// Candidates
const candidateGetAll = require('./controller/api/users/candidate/getAll.controller');
const candidateGetCurrent = require('./controller/api/users/candidate/getCurrent.controller');
const candidateImage = require('./controller/api/users/candidate/image.controller');
const candidateWizardJob = require('./controller/api/users/candidate/wizard/job.controller');
const candidateWizardTnC = require('./controller/api/users/candidate/wizard/termsAndConditions.controller');
const candidateWizardPrefilledProfile = require('./controller/api/users/candidate/wizard/prefilledProfile.controller');
const autoSuggestLocations = require('./controller/api/users/candidate/autoSuggestLocations.controller');

// Companies
const companyGet = require('./controller/api/users/company/getCompany.controller');
const companyGetCurrent = require('./controller/api/users/company/getCurrentCompany.controller');
const companyImage = require('./controller/api/users/company/image.controller');
const companyWizardTnT = require('./controller/api/users/company/wizard/getSummaryTnC.controller');
const companySearchFilter = require('./controller/api/users/company/searchCandidates/filter.controller');
const companySearchVerifiedCandidates = require('./controller/api/users/company/searchCandidates/verifiedCandidate.controller');
const candidateVerifiedCandidateDetail = require('./controller/api/users/company/searchCandidates/getVerifiedCandidateDetail.controller');

// Chat
const updateExplanationPopupStatus = require('./controller/api/chat/updateExplanationPopupStatus.controller');

// Admin
const adminAddPrivacyContent = require('./controller/api/users/admins/pages/addPrivacyContent.controller');
const adminChatSetUnreadMsgStatus = require('./controller/api/chat/setUnreadMessageStatus.controller');
const adminCandidateFilter = require('./controller/api/users/admins/candidateFilter.controller');
const adminComanyFilter = require('./controller/api/users/admins/companyFilter.controller');
const adminAddNewPagesContent = require('./controller/api/users/admins/pages/addTermsAndConditionsContent.controller');
const adminGetMetrics = require('./controller/api/users/admins/getMetrics.controller');

// Pages
const pagesGetContent = require('./controller/api/pages/getContent.controller');
const getStatistics = require('./controller/api/users/statistics.controller');

router.get('/', healthCheck);

// User authorization
router.put('/users/emailVerify/:email_hash', asyncMiddleware(authVerifyEmail));
router.put('/users/forgot_password/:email', asyncMiddleware(authForgotPassword));
router.put('/users/change_password',auth.isLoggedIn, asyncMiddleware(authChangePassword));
router.put('/users/reset_password/:hash', asyncMiddleware(authResetPassword));
router.put('/users/verify_client/:email', asyncMiddleware(authVerifyClient));
router.post('/users/account_settings' , auth.isLoggedIn , asyncMiddleware(authAccountDisableSetting));
router.post('/users/destroy_token', auth.isLoggedIn, asyncMiddleware(authDestroyTokenOnLogout));

// Referrals
router.post('/users/send_refreal',auth.isLoggedIn, asyncMiddleware(refReferral));
router.post('/users/get_refrence_code', asyncMiddleware(refGetReferralCode));
router.post('/users/get_ref_code' , asyncMiddleware(getReferralCodeForUsers));
router.post('/users/get_refrence_detail', auth.isLoggedIn, asyncMiddleware(getReferralDetailForAdmin));


// Candidates
router.get('/users/',auth.isLoggedIn, asyncMiddleware(candidateGetAll));
router.get('/users/current/:_id', auth.isLoggedIn, asyncMiddleware(candidateGetCurrent));
router.put('/users/welcome/terms', auth.isLoggedIn, asyncMiddleware(candidateWizardTnC));
router.put('/users/welcome/prefilled_profile' ,  auth.isLoggedIn , asyncMiddleware(candidateWizardPrefilledProfile));
router.put('/users/welcome/job', auth.isLoggedIn, asyncMiddleware(candidateWizardJob));
router.post('/users/image', auth.isLoggedIn, multer.single('photo'), asyncMiddleware(candidateImage));
router.post('/users/auto_suggest/:query_input', auth.isLoggedIn , asyncMiddleware(autoSuggestLocations));

// Companies
router.get('/users/company',auth.isAdmin, asyncMiddleware(companyGet));
router.get('/users/current_company/:_id',auth.isLoggedIn, asyncMiddleware(companyGetCurrent));
router.put('/users/company_wizard',auth.isLoggedIn, asyncMiddleware(companyWizardTnT));
router.post('/users/employer_image',auth.isLoggedIn, multer.single('photo'), asyncMiddleware(companyImage));
router.post('/users/filter',auth.isValidCompany, asyncMiddleware(companySearchFilter));
router.post('/users/verified_candidate',auth.isValidCompany, asyncMiddleware(companySearchVerifiedCandidates));
router.post('/users/candidate_detail',auth.isValidCompany,asyncMiddleware(candidateVerifiedCandidateDetail));

// Chat
router.post('/users/set_unread_msgs_emails_status',auth.isLoggedIn, asyncMiddleware(adminChatSetUnreadMsgStatus));
router.post('/users/updatePopupStatus', auth.isLoggedIn, asyncMiddleware(updateExplanationPopupStatus));

// Admin
router.post('/users/admin_candidate_filter', auth.isAdmin , asyncMiddleware(adminCandidateFilter));
router.post('/users/admin_company_filter', auth.isAdmin , asyncMiddleware(adminComanyFilter));
router.put('/users/add_privacy_content' , auth.isAdmin , asyncMiddleware(adminAddPrivacyContent));
router.put('/users/add_terms_and_conditions_content' , auth.isAdmin , asyncMiddleware(adminAddNewPagesContent));
router.get('/users/get_metrics', auth.isAdmin, asyncMiddleware(adminGetMetrics));

// Pages
router.get('/users/get_pages_content/:title', asyncMiddleware(pagesGetContent));
router.get('/users/statistics' , asyncMiddleware(getStatistics));


module.exports = router;