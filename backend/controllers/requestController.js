const Request = require('../models/request')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All requests => /api/v1/requests
exports.allRequests = catchAsyncErrors( async (req, res, next) => {
    const requests = await Request.find().populate('patient').populate('approvedBy');

    const count = await Request.countDocuments();

    res.status(200).json({
        success: true,
        count,
        requests
    })
})

// Create request => /api/v1/requests
exports.createRequest= catchAsyncErrors( async (req, res, next) => {
    const { dateTime, ebm, patient, location, diagnosis, volume, reason, outcome, doctor, transport, approvedBy
    } = req.body;
    const Dates = dateTime.date;
    const Time = dateTime.time;

    const day = new Date(`${Dates}T${Time}:00Z`)

    const requestData = {
        dateTime: day,
        patient,
        location,
        diagnosis,
        ebm,
        volume,
        reason,
        outcome,
        doctor,
        transport,
        approvedBy
    }

    const request = await Request.create(requestData);

    res.status(201).json({
        success: true,
        request
    });
})

// Get specific request details => /api/v1/request/:id
exports.getRequestDetails = catchAsyncErrors( async (req, res, next) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        return next(new ErrorHandler(`Request is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        request
    })
})

// Update request => /api/v1/request/:id
exports.updateRequest = catchAsyncErrors( async (req, res, next) => {
    const { dateTime, ebm, patient, location, diagnosis, volume, reason, outcome, doctor, transport, approvedBy
    } = req.body;

    const Dates = dateTime.date;
    const Time = dateTime.time;

    const day = new Date(`${Dates}T${Time}:00Z`)
    
    const newRequestData = {
        dateTime: day,
        patient,
        location,
        diagnosis,
        ebm,
        volume,
        reason,
        outcome,
        doctor,
        transport,
        approvedBy
    }

    const request = await Request.findByIdAndUpdate(req.params.id, newRequestData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    if (!request) {
        return next(new ErrorHandler(`Request is not found with this id: ${req.params.id}`))
    }

    
    res.status(200).json({
        success: true,
        request
    })

})

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