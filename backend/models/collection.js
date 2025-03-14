const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const collectionSchema = new mongoose.Schema({
    collectionType: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public',
        required: [true, 'Must specify collection type']
    },
    collectionDate: {
        type: Date,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Admin user is needed to complete the collection']
    },
    pubDetails: {
        type: ObjectId,
        ref: 'Letting'
    },
    privDetails: {
        type: ObjectId,
        ref: 'Schedule'
    },
    notes: {
        type: String 
    }
});

module.exports = mongoose.model('Collection', collectionSchema);