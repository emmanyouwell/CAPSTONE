const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name of the patient']
    },
    address: {
        type: String,
        required: [true, 'Please enter address of the patient']
    },
    phone: {
        type: String,
        required: [true, 'Please enter contact number of the patient']
    },
    milkRequested: {
        type: String,
        required: [true, 'Please enter amount of requested milk']
    },
    patientType: {
        type: String,
        enum: ['Inpatient', 'Outpatient'],
        default: 'Inpatient',
        required: true
    },
    hospital: {
        type: String,
        required: [true, 'Please enter the hospital name of the patient is admitted']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('Patient', patientSchema);