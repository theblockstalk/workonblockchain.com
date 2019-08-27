
let defaultFunctions = function(model) {
    const findWithCursor = async function (selector) {
        return await model.find(selector).cursor();
    }

    return {
        insert: async function (data) {
            let newDoc = new model(data);

            await newDoc.save();

            return newDoc._doc;
        },

        findOne: async function (selector) {
            return await model.findOne(selector).lean();
        },

        findOneById: async function (id) {
            return await model.findById(id).lean();
        },

        deleteOne: async function (selector) {
            await model.findOne(selector).remove();
        },

        findWithCursor: findWithCursor,

        findAndIterate: async function (selector, fn) {
          let cursor = await findWithCursor(selector);
            let doc = await cursor.next();

            for (null; doc !== null; doc = await cursor.next()) {
                await fn(doc);
            }
        },

        count: async function (selector) {
            return new Promise(function (resolve, reject) {
                try {
                    model.count(selector, function (err1, result) {
                        if (err1) reject(err1);
                        resolve(result);
                    })
                } catch (err2) {
                    reject(err2);
                }
            })
        }
    }
}