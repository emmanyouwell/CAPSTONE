const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const scheduleSchema = mongoose.Schema({
    dates: {
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
                    required: true
                    },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    totalVolume: {
        type: Number,
        default: 0 
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Completed'],
        default: 'Pending'
    },
    approvedBy: {
        type: ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema);