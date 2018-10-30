const errors = require('../../services/errors');

module.exports.isAuthorizedForConversation = function isAuthorizedForConversation(callerUserDoc, senderId, receiverId) {
    if(!(callerUserDoc.is_admin || senderId === callerUserDoc._id || receiverId === callerUserDoc._id))
        errors.throwError("User is not authorized to access this conversation", 401);
};