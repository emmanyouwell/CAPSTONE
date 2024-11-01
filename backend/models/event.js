const mongoose = require('mongoose');
const validator = require('validator');
const {ObjectId} = mongoose.Schema.Types;

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eventDetails: {
        type: Date,
        required: true
    },
    eventStatus: {
        type: String,
        enum: ['Not-Due', 'On-Going', 'Done'],
        default: 'Not-Due',
        required: true
    },
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Event', eventSchema)