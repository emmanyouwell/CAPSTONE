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
                required: true
            },
            donor: {
                type: ObjectId,
                required: true,
                ref: 'Donor'
            },
            lastDonation: {
                type: Date,
            }
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Letting', lettingSchema)