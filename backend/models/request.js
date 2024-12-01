const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const requestSchema = new mongoose.Schema({
    dateTime: {
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
    ebm: {
        batch:{
            type: String,
            required: [true, 'Please enter EBM batch']
        },
        pool:{
            type: String,
            required: [true, 'Please enter EBM pool']
        },
        bottle:{
            type: String,
            required: [true, 'Please enter EBM bottle']
        },
    },
    volume: {
        type: String,
        required: [true, 'Please enter volume given to the patient']
    },
    reason: {
        type: String,
        required: [true, 'Please enter reason for Byteurized EBM']
    },
    outcome: {
        type: String
    },
    doctor: {
        type: String,
        required: [true, 'Please enter prescribing doctor']
    },
    transport: {
        type: String,
        required: [true, 'Please enter transport details']
    },
    approvedBy: {
        type: ObjectId,
        required: [true, 'Need admin id of TCHMB'],
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('Request', requestSchema);