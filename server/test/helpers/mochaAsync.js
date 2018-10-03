// module.exports = fn =>
// (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
// };
//
// function(fn) {
//     return function(req, res, next) {
//         return Promise.resolve(fn(req, res, next)).catch(next);
//     }
// }

// module.exports = function(testFn) {
//     try {
//         // await testFn();
//         Promise.resolve(testFn).catch((error) => {
//             throw error;
//         });
//     } catch(error) {
//         throw error;
//     }
// }

module.exports = (fn) => {
    return async (done) => {
        try {
            await fn();
            done();
        } catch (err) {
            done(err);
        }
    };
};