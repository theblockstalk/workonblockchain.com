const express = require('express');
const router = express.Router();
const multer = require('./controller/middleware/multer');
const auth = require('./controller/middleware/auth');
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');

const healthCheck = require('./controller/api/healthCheck.controller');

// User authorization
const authAthenticate = require('./controller/api/users/auth/authenticate.controller');
const authVerifyEmail = require('./controller/api/users/auth/verifyEmail.controller');
const authForgotPassword = require('./controller/api/users/auth/forgotPassword.controller');
const authChangePassword = require('./controller/api/users/auth/changePassword.controller');
const authResetPassword = require('./controller/api/users/auth/resetPassword.controller');
const authVerifyClient = require('./controller/api/users/auth/verifyClient.controller');
const authAccountDisableSetting = require('./controller/api/users/auth/account_setting.controller');
const authDestroyTokenOnLogout = require('./controller/api/users/auth/destroyTokenOnLogout.controller');
const updateExplanationPopupStatus = require('./controller/api/users/updateExplanationPopupStatus.controller');

// Referrals
const refReferredEmail = require('./controller/api/users/referrals/referredEmail.controller');
const refGetReferralCode = require('./controller/api/users/referrals/getReferralCode.controller');
const refReferral = require('./controller/api/users/referrals/referral.controller');

// Candidates
const candidateRegister = require('./controller/api/users/candidate/register.controller');
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
const candidateWizardPrefilledProfile = require('./controller/api/users/candidate/wizard/prefilledProfile.controller');

// Companies
const companyRegister = require('./controller/api/users/company/createCompany.controller');
const companyGet = require('./controller/api/users/company/getCompany.controller');
const companyGetCurrent = require('./controller/api/users/company/getCurrentCompany.controller');
const companyImage = require('./controller/api/users/company/image.controller');
const companyUpdate = require('./controller/api/users/company/updateCompany.controller');
const companyWizardAbout = require('./controller/api/users/company/wizard/about.controller');
const companyWizardTnT = require('./controller/api/users/company/wizard/getSummaryTnC.controller');
const companySearchFilter = require('./controller/api/users/company/searchCandidates/filter.controller');
const companySearchVerifiedCandidates = require('./controller/api/users/company/searchCandidates/verifiedCandidate.controller');
const candidateVerifiedCandidateDetail = require('./controller/api/users/company/searchCandidates/getVerifiedCandidateDetail.controller');

// Chat
const chatGetCandidate = require('./controller/api/chat/getCandidate.controller');
const chatGetChat = require('./controller/api/chat/getChat.controller');
const chatGetMessages = require('./controller/api/chat/getMessages.controller');
const chatGetUnreadUser = require('./controller/api/chat/getUnreadMessagesUser.controller');
const chatGetUserMsgs = require('./controller/api/chat/getUserMessages.controller');
const chatInsertMessage = require('./controller/api/chat/insertMessage.controller');
const chatInsertMessageJob = require('./controller/api/chat/insertMessageJob.controller');
const chatInsertFile = require('./controller/api/chat/insertChatFile.controller');
const chatUpdateJobMessage = require('./controller/api/chat/updateJobMessage.controller');
const chatUpdateIsCompanyReplyStatus = require('./controller/api/chat/updateIsCompanyReplyStatus.controller');
const chatGetEmployOffer = require('./controller/api/chat/chatGetEmployOffer.controller');
const chatGetLastJobDescription = require('./controller/api/chat/getLastJobDescription.controller');

// Admin
const adminAddPrivacyContent = require('./controller/api/users/admins/pages/addPrivacyContent.controller');
const adminChatGetJobDescMsg = require('./controller/api/chat/getJobDescMessage.controller');
const adminChatSetUnreadMsgStatus = require('./controller/api/chat/setUnreadMessageStatus.controller');
const adminChatUpdateMsgStatus = require('./controller/api/chat/updateChatMessageStatus.controller');
const adminApproveUser = require('./controller/api/users/admins/approveUser.controller');
const adminCandidateFilter = require('./controller/api/users/admins/candidateFilter.controller');
const adminComanyFilter = require('./controller/api/users/admins/companyFilter.controller');
const adminAddNewPagesContent = require('./controller/api/users/admins/pages/addTermsAndConditionsContent.controller');

// Pages
const pagesGetContent = require('./controller/api/pages/getContent.controller');

router.get('/', healthCheck);

// User authorization
router.post('/users/authenticate', authAthenticate);
router.put('/users/emailVerify/:email_hash', authVerifyEmail);
router.put('/users/forgot_password/:email', authForgotPassword);
router.put('/users/change_password',auth.isLoggedIn, authChangePassword);
router.put('/users/reset_password/:hash', authResetPassword);
router.put('/users/verify_client/:email', authVerifyClient);
router.post('/users/set_disable_status' , auth.isLoggedIn , authAccountDisableSetting);
router.post('/users/destroy_token', auth.isLoggedIn, authDestroyTokenOnLogout);
router.post('/users/updatePopupStatus', auth.isLoggedIn, updateExplanationPopupStatus);

// Referrals
router.post('/users/refered_user_email', refReferredEmail)
router.post('/users/send_refreal',auth.isLoggedIn, refReferral);
router.post('/users/get_refrence_code', refGetReferralCode);

// Candidates
router.post('/users/register', candidateRegister);
router.get('/users/',auth.isLoggedIn, candidateGetAll);
router.get('/users/current/:_id', auth.isLoggedIn, candidateGetCurrent); // Admin or valid company can call this...
router.put('/users/welcome/terms', auth.isLoggedIn, candidateWizardTnC);
router.put('/users/welcome/prefilled_profile' ,  auth.isLoggedIn , asyncMiddleware(candidateWizardPrefilledProfile));
router.put('/users/welcome/about', auth.isLoggedIn, asyncMiddleware(candidateWizardAbout));
router.put('/users/welcome/job', auth.isLoggedIn, candidateWizardJob);
router.put('/users/welcome/resume', auth.isLoggedIn, candidateWizardResume);
router.put('/users/welcome/exp', auth.isLoggedIn, candidateWizardExperience);
router.post('/users/image', auth.isLoggedIn, multer.single('photo'), candidateImage);
router.put('/users/refered_id', auth.isLoggedIn, candidateReferred);
router.put('/users/update_profile', auth.isLoggedIn, asyncMiddleware(candidateUpdate));

// Companies
router.post('/users/create_employer', companyRegister);
router.get('/users/company',auth.isAdmin, companyGet);
router.get('/users/current_company/:_id',auth.isLoggedIn, companyGetCurrent);
router.put('/users/company_wizard',auth.isLoggedIn, companyWizardTnT);
router.put('/users/about_company',auth.isLoggedIn, companyWizardAbout);
router.post('/users/employer_image',auth.isLoggedIn, multer.single('photo'), companyImage);
router.put('/users/update_company_profile',auth.isLoggedIn, companyUpdate);
router.post('/users/filter',auth.isValidCompany, companySearchFilter);
router.post('/users/verified_candidate',auth.isValidCompany, companySearchVerifiedCandidates);
router.post('/users/candidate_detail',auth.isValidCompany,candidateVerifiedCandidateDetail);

// Chat
router.post('/users/insert_message', auth.isValidUser, chatInsertMessage);
router.post('/users/get_candidate', auth.isValidUser, chatGetCandidate);
router.post('/users/get_messages',auth.isValidUser, chatGetMessages);
router.post('/users/get_user_messages',auth.isValidUser, chatGetUserMsgs);
router.get('/users/all_chat',auth.isValidUser, chatGetChat);
router.post('/users/insert_chat_file',auth.isValidUser, multer.single('photo'), chatInsertFile);
router.post('/users/insert_message_job',auth.isValidUser,multer.single('photo'), chatInsertMessageJob);
router.post('/users/update_job_message', auth.isValidCandidate, chatUpdateJobMessage);
router.post('/users/get_unread_msgs_of_user',auth.isValidUser, chatGetUnreadUser);
router.post('/users/update_is_company_reply_status', auth.isValidCandidate, chatUpdateIsCompanyReplyStatus);
router.post('/users/get_employ_offer',auth.isValidUser, chatGetEmployOffer);
router.post('/users/get_last_job_desc_msg' , auth.isValidUser , asyncMiddleware(chatGetLastJobDescription));

// Admin
router.put('/users/approve/:_id', auth.isAdmin  , adminApproveUser);
router.post('/users/admin_candidate_filter', auth.isAdmin , adminCandidateFilter);
router.post('/users/admin_company_filter', auth.isAdmin , adminComanyFilter);
router.put('/users/add_privacy_content' , auth.isAdmin , adminAddPrivacyContent);
router.put('/users/add_terms_and_conditions_content' , auth.isAdmin , adminAddNewPagesContent);
router.post('/users/update_chat_msg_status' , auth.isValidUser , adminChatUpdateMsgStatus);
router.post('/users/get_job_desc_msgs' ,auth.isValidUser, adminChatGetJobDescMsg);
router.post('/users/set_unread_msgs_emails_status',auth.isLoggedIn, adminChatSetUnreadMsgStatus);

// Pages
router.get('/users/get_pages_content/:title', pagesGetContent);

module.exports = router;