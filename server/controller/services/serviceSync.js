const syncQueue = require('../../model/mongoose/sync_queue');

module.exports.pushToQueue = async function(queue, operation, userDoc, companyDoc) {
    let syncDoc = {
        queue: queue,
        operation: operation,
        status: 'pending',
        added_to_queue: Date.now()
    };

    if (userDoc) syncDoc.user = userDoc;
    if (companyDoc) syncDoc.company = companyDoc;

    await syncQueue.insert(syncDoc);
}

module.exports.pullFromQueue = async function() {
    return syncQueue.findAndIterate( function(syncDoc) {
        // send to zoho
    })
}