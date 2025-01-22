const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const requestSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please enter date']
    },
    patient: {
        type: ObjectId,
        required: [true, 'Please enter the patient'],
        ref: 'Patient'
    },
    location: {
        type: String,
        required: [true, 'Please enter location of the patient']
    },
    diagnosis: {
        type: String,
        required: [true, 'Please enter diagnosis of the patient']
    },
    reason: {
        type: String,
        required: [true, 'Please enter reason for Byteurized EBM']
    },
    doctor: {
        type: String,
        required: [true, 'Please enter prescribing doctor']
    },
    staffId: {
        type: ObjectId,
        required: [true, 'Staff ID required'],
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Pending', 'Done'],
        default: 'Pending',
        required: true
    },
    volume: {
        type: Number,
        required: [true, 'Please enter Volume Requested']
    },
    outcome: {
        type: String
    },
    tchmb: {
        ebm: [
        {
            inv: {
                type: ObjectId,
                ref: 'Inventory'
            }
        }
        ],
        transport: {
            type: String
        },
        approvedBy: {
            type: ObjectId,
            ref: 'User'
        },
    },
    temp: {
        id: {
            type: String,
        },
        vol: {
            type: Number,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('Request', requestSchema);