const mongoose = require('mongoose');

const inputSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    otp: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Input', inputSchema);
