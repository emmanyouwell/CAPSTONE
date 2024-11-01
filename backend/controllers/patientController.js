const Patient = require('../models/patient')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All Patients => /api/v1/patients
exports.allPatients = catchAsyncErrors( async (req, res, next) => {
    const patients = await Patient.find();

    const count = await Patient.countDocuments();

    res.status(200).json({
        success: true,
        count,
        patients
    })
})

// Create Patient => /api/v1/patients
exports.createPatient= catchAsyncErrors( async (req, res, next) => {
    const data = req.body;

    const patient = await Patient.create({
        name: data.name,
        address: data.address,
        phone: data.phone,
        milkRequested: data.milkRequested,
        patientType: data.patientType.trim(),
        hospital: data.hospital,
    });

    res.status(201).json({
        success: true,
        patient
    });
})

// Get specific Patient details => /api/v1/patient/:id
exports.getPatientDetails = catchAsyncErrors( async (req, res, next) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        return next(new ErrorHandler(`Patient is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        patient
    })
})

// Update Patient => /api/v1/patient/:id
exports.updatePatient = catchAsyncErrors( async (req, res, next) => {
    const data = req.body;
    
    const newPatientData = {
        name: data.name,
        address: data.address,
        phone: data.phone,
        milkRequested: data.milkRequested,
        patientType: data.patientType.trim(),
        hospital: data.hospital
    }

    const patient = await Patient.findByIdAndUpdate(req.params.id, newPatientData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    
    res.status(200).json({
        success: true,
        patient
    })

})

// Delete Patient => /api/v1/patient/:id
exports.deletePatient = catchAsyncErrors( async (req, res, next) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        return next(new ErrorHandler(`Patient is not found with this id: ${req.params.id}`))
    }

    await Patient.deleteOne();

    res.status(200).json({
        success: true,
        message: "Patient Deleted"
    })
})