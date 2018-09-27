const mongoose = require('mongoose');

exports.drop = async () => {
    await mongoose.connection.db.dropDatabase();
}