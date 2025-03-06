const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    createdDate: { type: Date, required: true },
    claimBy: { type: String, required: true },
    group: { type: String, required: true }
});

module.exports = mongoose.model('Lead', leadSchema);
