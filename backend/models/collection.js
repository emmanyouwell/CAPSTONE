const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const collectionSchema = new mongoose.Schema({
    collectionType: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public',
        required: [true, 'Must specify collection type'],
    },
    collectionDate: {
        type: Date,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Admin user is needed to complete inventory'],
    },
    status: {
        type: String,
        enum: ['Not-Due', 'On-Going', 'Done'],
        default: 'Not-Due',
        required: true
    },
    pubDetails: {
        totalVol: {
            type: Number,
            required: function () {
                return this.collectionType === 'Public';
            },
        },
        milkLetting: {
            type: ObjectId,
            required: function () {
                return this.collectionType === 'Public';
            },
            ref: 'Letting'
        },
    },
    privDetails: {
        totalVol: {
            type: Number,
            required: function () {
                return this.collectionType === 'Private';
            },
        },
        scheduled: {
            type: ObjectId,
            required: function () {
                return this.collectionType === 'Private';
            },
            ref: 'Schedule'
        },
    },
});

module.exports = mongoose.model('Collection', collectionSchema);