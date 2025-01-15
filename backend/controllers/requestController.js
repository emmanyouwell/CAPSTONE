const Request = require('../models/request')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All requests => /api/v1/requests
exports.allRequests = catchAsyncErrors( async (req, res, next) => {
    const requests = await Request.find()
        .populate('patient', 'name phone patientType')
        .populate('staffId', 'name email role')
        .populate('tchmb.approvedBy', 'name email role') 
        .populate('tchmb.ebm.inv', 'pasteurizedDetails');

    const count = await Request.countDocuments();

    res.status(200).json({
        success: true,
        count,
        requests
    })
})

// Create request => /api/v1/requests
exports.createRequest= catchAsyncErrors( async (req, res, next) => {
    const { date, patient, location, diagnosis, reason, doctor, staffId, outcome, status, tchmb, priority } = req.body;
    
    const requestData = {
        date,
        patient,
        location,
        diagnosis,
        reason,
        doctor,
        priority,
        staffId,
        status,
        outcome,
        tchmb
    }

    const request = await Request.create(requestData);

    res.status(201).json({
        success: true,
        request
    });
})

// Get specific request details => /api/v1/request/:id
exports.getRequestDetails = catchAsyncErrors( async (req, res, next) => {
    const request = await Request.findById(req.params.id)
        .populate('tchmb.approvedBy', 'name email role') 
        .populate('tchmb.ebm.inv', 'pasteurizedDetails');

    if (!request) {
        return next(new ErrorHandler(`Request is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        request
    })
})

// Update request => /api/v1/request/:id
exports.updateRequest = catchAsyncErrors(async (req, res, next) => {
    const { date, patient, location, diagnosis, reason, doctor, staffId, outcome, status, tchmb, priority } = req.body;

    const newRequestData = {
        date,
        patient,
        location,
        diagnosis,
        reason,
        doctor,
        priority,
        staffId,
        status,
        outcome,
        tchmb
    };

    const request = await Request.findByIdAndUpdate(req.params.id, newRequestData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })  .populate('tchmb.approvedBy', 'name email role') 
        .populate('tchmb.ebm.inv', 'pasteurizedDetails');

    if (!request) {
        return next(new ErrorHandler(`Request is not found with this id: ${req.params.id}`));
    }     

    res.status(200).json({
        success: true,
        request,
    });
});

// Delete request => /api/v1/request/:id
exports.deleteRequest = catchAsyncErrors( async (req, res, next) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        return next(new ErrorHandler(`request is not found with this id: ${req.params.id}`))
    }

    await request.deleteOne();

    res.status(200).json({
        success: true,
        message: "Request Deleted"
    })
})