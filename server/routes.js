const express = require('express');
const router = express.Router();
const multer = require('./controller/middleware/multer');

const healthCheck = require('./controller/api/healthCheck.controller');

// User authorization
const authAthenticate = require('./controller/api/users/auth/authenticate.controller');
const authVerifyEmail = require('./controller/api/users/auth/verifyEmail.controller');
const authForgotPassword = require('./controller/api/users/auth/forgotPassword.controller');
const authChangePassword = require('./controller/api/users/auth/changePassword.controller');
const authResetPassword = require('./controller/api/users/auth/resetPassword.controller');
const authVerifyClient = require('./controller/api/users/auth/verifyClient.controller');
const authAccountDisableSetting = require('./controller/api/users/auth/account_setting.controller');

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
const candidatePublicProfile = require('./controller/api/users/candidate/publicProfile.controller');

// Companies
const companyRegister = require('./controller/api/users/company/createCompany.controller');
const companyGet = require('./controller/api/users/company/getCompany.controller');
const companyGetCurrent = require('./controller/api/users/company/getCurrentCompany.controller');
const companyImage = require('./controller/api/users/company/image.controller');
const companyUpdate = require('./controller/api/users/company/updateCompany.controller');
const companyWizardAbout = require('./controller/api/users/company/wizard/about.controller');
const companyWizardTnT = require('./controller/api/users/company/wizard/getSummaryTnC.controller');
const companySearchWord = require('./controller/api/users/company/searchCandidates/searchWord.controller');
const companySearchFilter = require('./controller/api/users/company/searchCandidates/filter.controller');
const companySearchVerifiedCandidates = require('./controller/api/users/company/searchCandidates/verifiedCandidate.controller');

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
const chatUploadFile = require('./controller/api/chat/uploadChatFile.controller');

// Admin
const adminAddPrivacyContent = require('./controller/api/users/admins/pages/addPrivacyContent.controller');
const adminChatGetJobDescMsg = require('./controller/api/users/admins/chat/getJobDescMessage.controller');
const adminChatSetUnreadMsgStatus = require('./controller/api/users/admins/chat/setUnreadMessageStatus.controller');
const adminChatUpdateMsgStatus = require('./controller/api/users/admins/chat/updateChatMessageStatus.controller');
const adminRoll = require('./controller/api/users/admins/adminRoll.controller');
const adminApproveUser = require('./controller/api/users/admins/approveUser.controller');
const adminCandidateFilter = require('./controller/api/users/admins/candidateFilter.controller');
const adminCandidateSearch = require('./controller/api/users/admins/candidateSearch.controller');
const adminComanyFilter = require('./controller/api/users/admins/companyFilter.controller');
const adminCompanySearch = require('./controller/api/users/admins/companySearch.controller');

// Pages
const pagesGetContent = require('./controller/api/pages/getContent.controller');
const pagesGetAllContent = require('./controller/api/pages/getAllContent.controller');


router.get('/', healthCheck);

// User authorization
router.post('/users/authenticate', authAthenticate);
router.put('/users/emailVerify/:email_hash', authVerifyEmail);
router.put('/users/forgot_password/:email', authForgotPassword);
router.put('/users/change_password/:id', authChangePassword);
router.put('/users/reset_password/:hash', authResetPassword);
router.put('/users/verify_client/:email', authVerifyClient);
router.post('/users/set_disable_status' , authAccountDisableSetting);

// Referrals
router.post('/users/refered_user_email', refReferredEmail)
router.post('/users/send_refreal', refReferral);
router.post('/users/get_refrence_code', refGetReferralCode);

// Candidates
router.post('/users/register', candidateRegister);
router.get('/users/', candidateGetAll);
router.get('/users/current/:id', candidateGetCurrent);
router.put('/users/welcome/terms/:_id', candidateWizardTnC);
router.put('/users/welcome/about/:_id', candidateWizardAbout);
router.put('/users/welcome/job/:_id', candidateWizardJob);
router.put('/users/welcome/resume/:_id', candidateWizardResume);
router.put('/users/welcome/exp/:_id', candidateWizardExperience);
router.post('/users/image/:_id', multer.single('photo'), candidateImage);
router.put('/users/refered_id/:id', candidateReferred);
router.put('/users/update_profile/:_id', candidateUpdate);
router.get('/users/public_profile/:_id' , candidatePublicProfile);

// Companies
router.post('/users/create_employer', companyRegister);
router.get('/users/company', companyGet);
router.get('/users/current_company/:id', companyGetCurrent);
router.put('/users/company_wizard/:_id', companyWizardTnT);
router.put('/users/about_company/:_id', companyWizardAbout);
router.post('/users/employer_image/:_id', multer.single('photo'), companyImage);
router.put('/users/update_company_profile/:_id', companyUpdate);
router.post('/users/search_word', companySearchWord);
router.post('/users/filter', companySearchFilter);
router.get('/users/verified_candidate', companySearchVerifiedCandidates);

// Chat
router.post('/users/insert_message', chatInsertMessage);
router.post('/users/get_candidate', chatGetCandidate);
router.post('/users/get_messages', chatGetMessages);
router.post('/users/get_user_messages', chatGetUserMsgs);
router.get('/users/all_chat', chatGetChat);
router.post('/users/upload_chat_file/:_id', multer.single('photo'), chatUploadFile);
router.post('/users/insert_chat_file', chatInsertFile);
router.post('/users/insert_message_job', chatInsertMessageJob);
router.post('/users/update_job_message', chatUpdateJobMessage);
    router.post('/users/get_unread_msgs_of_user', chatGetUnreadUser);

// Admin
router.put('/users/admin_role', adminRoll);
router.put('/users/approve/:_id'  , adminApproveUser);
router.post('/users/search_by_name' , adminCandidateSearch);
router.post('/users/admin_candidate_filter' , adminCandidateFilter);
router.post('/users/admin_search_by_name' , adminCompanySearch);
router.post('/users/admin_company_filter' , adminComanyFilter);
router.post('/users/update_chat_msg_status' , adminChatUpdateMsgStatus);
router.post('/users/get_job_desc_msgs' , adminChatGetJobDescMsg);
router.post('/users/set_unread_msgs_emails_status' , adminChatSetUnreadMsgStatus);
router.put('/users/add_privacy_content'  , adminAddPrivacyContent);

// Pages
router.get('/users/get_pages_content/:title', pagesGetContent);
router.get('/users/get_all_content', pagesGetAllContent);

module.exports = router;