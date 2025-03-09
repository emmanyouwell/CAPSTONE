const mongoose = require('mongoose');
const validator = require('validator');
const {ObjectId} = mongoose.Schema.Types;

const scheduleSchema = mongoose.Schema({
    dates:{
        type: Date,
        required: true
    },
    venue: {
        type: String,
        default: 'Donors Home',
    },
    donorId: {
        type: ObjectId,
        required: true,
        ref: 'Donor'
    },
    status: {
        type: String,
        enum: ['Not-Due', 'On-Going', 'Done'],
        default: 'Not-Due',
        required: true
    },
    admin: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Admin is needed to complete inventory'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Schedule', scheduleSchema)