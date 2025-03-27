const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name of the patient']
    },
    home_address: {
        street: {
            type: String,
            required: [true, 'Enter Street']
        },
        brgy: {
            type: String,
            required: [true, 'Enter Baranggay']
        },
        city: {
            type: String,
            required: [true, 'Enter City']
        }
    },
    phone: {
        type: String,
        required: [true, 'Please enter contact number of the patient']
    },
    motherName: {
        type: String,
        required: [true, 'Please enter the name of the mother of patient']
    },
    patientType: {
        type: String,
        enum: ['Inpatient', 'Outpatient'],
        default: 'Inpatient',
    },
    staff: {
        type: ObjectId,
        required: [true, 'Staff ID required'],
        ref: 'User'
    },
    requested: [
        {
            type: ObjectId,
            required: true,
            ref: 'Request'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('Patient', patientSchema);