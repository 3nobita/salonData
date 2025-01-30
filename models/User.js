const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{ type: String, required: true },
    number: { type: String, required: true,unique: true },
    birthDate: { type: Date },
});

module.exports = mongoose.model('User', userSchema);