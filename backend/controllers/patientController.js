const Patient = require('../models/patient')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All Patients => /api/v1/patients
exports.allPatients = catchAsyncErrors(async (req, res, next) => {
    // Destructure search query parameters from the request
    const { search, type } = req.query;

    // Create a query object to hold the search criteria
    const query = {};

    if (search) {
        query.$or = [
            { 'name': { $regex: search, $options: 'i' } },  
            { 'patientType': { $regex: search, $options: 'i' } }, 
            { 'hospital': { $regex: search, $options: 'i' } },    
            { 'milkRequested': { $regex: search, $options: 'i' } }
        ];
    }
    if (type){
        query.patientType = type;
    }

    // Optional: Add pagination (e.g., limit results and skip for page number)
    const page = Number(req.query.page) || 1;
    const pageSize = 12; // Adjust page size as needed
    const skip = (page - 1) * pageSize;

    try {
        // Find donors based on the query object
        const patients = await Patient.find(query)
            .populate('requested.reqId', 'date volume')
            .sort({name: 1})
            .skip(skip)
            .limit(pageSize);

        const totalPatients = await Patient.countDocuments(query);
        const totalPages = Math.ceil(totalPatients / pageSize);
        

        res.status(200).json({
            success: true,
            totalPatients,
            totalPages,
            pageSize,
            patients
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


})

// Create Patient => /api/v1/patients
exports.createPatient = catchAsyncErrors(async (req, res, next) => {
console.log(req.body)
    const patient = await Patient.create(req.body);

    res.status(201).json({
        success: true,
        patient
    });
})

// Get specific Patient details => /api/v1/patient/:id
exports.getPatientDetails = catchAsyncErrors(async (req, res, next) => {
    const patient = await Patient.findById(req.params.id)
    .populate([{path:'requested.reqId'}, {path:'staff', select: 'name'}]);

    if (!patient) {
        return next(new ErrorHandler(`Patient is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        patient
    })
})

// Update Patient => /api/v1/patient/:id
exports.updatePatient = catchAsyncErrors(async (req, res, next) => {

    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deletePatient = catchAsyncErrors(async (req, res, next) => {
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