const mongoose = require('mongoose');
const validator = require('validator');
const {ObjectId} = mongoose.Schema.Types;

const lettingSchema = mongoose.Schema({
    activity: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    actDetails: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    attendance: [
        {
            donorType: {
                type: String,
                enum: ['New Donor', 'Past Donor'],
                default: 'New Donor',
            },
            donor: {
                type: ObjectId,
                ref: 'Donor'
            },
            volume: {
                type: Number,
            },
            lastDonation: {
                type: Date,
            }
        },
    ],
    admin: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Letting', lettingSchema)