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
    donorDetails: {
        donorId: {
            type: ObjectId,
            required: true,
            ref: 'Donor'
        },
        milkDetails: [
            {
                volume: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            }
        ]
    },
    approvedBy: {
        type: ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Schedule', scheduleSchema)