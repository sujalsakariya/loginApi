const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        trim: true
    }, 
    desc: {
        type: String,
        trim: true
    }, 
    images: {
        type: [String]
    }, 
    startDate: {
        type: Date,
    }, 
    endDate: {
        type: Date,
    }, 
    user: { type: Schema.Types.ObjectId, ref: 'users' }, 
    status: {
        type: String,
        enum: ["Pending", "InProgress", "Complete", "UnDone"]
    }
});

module.exports = mongoose.model('tasks', schema)