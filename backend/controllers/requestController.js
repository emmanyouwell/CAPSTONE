const Request = require('../models/request');
const Patient = require('../models/patient')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary');

// Get All requests => /api/v1/requests
exports.allRequests = catchAsyncErrors(async (req, res, next) => {
    const requests = await Request.find()
        .populate('patient', 'name patientType')
        .populate('requestedBy', 'name employeeID')
        .populate('tchmb.approvedBy', 'name email role')
        .populate('tchmb.ebm', 'pasteurizedDetails');

    const count = await Request.countDocuments();

    res.status(200).json({
        success: true,
        count,
        requests
    })
})

// Create request => /api/v1/requests
exports.createRequest = catchAsyncErrors(async (req, res, next) => {
    try {
        let images = []
        if (typeof req.body.images === 'string') {
            images.push(req.body.images)
        } else {
            images = req.body.images
        }
        
        let imagesLinks = [];
        
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'requests'
            });      
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
        
        req.body.images = imagesLinks

        const patient = await Patient.findById(req.body.patient);
        if (!patient) {
            return next(new ErrorHandler(`Patient is not found with this id: ${req.body.patient}`))
        } 
        let newData = {}
        if (req.body.patientType === 'Inpatient'){  
            newData = {
                ...req.body,
                department: req.body.location
            }
        } else {
            newData = {
                ...req.body,
                hospital: req.body.location
            }
        }
        const request = await Request.create(newData);

        patient.patientType = req.body.patientType;
        patient.requested.push(request._id);
        patient.save();

        res.status(201).json({
            success: true,
            request
        });

    } catch (error) {
        console.log('Error: ', error.message);
        next(error);
    }
})

// Get specific request details => /api/v1/request/:id
exports.getRequestDetails = catchAsyncErrors(async (req, res, next) => {
    const request = await Request.findById(req.params.id)
        .populate('patient', 'name patientType')
        .populate('requestedBy', 'name employeeID')
        .populate('tchmb.approvedBy', 'name email role')
        .populate('tchmb.ebm', 'pasteurizedDetails');

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
    const data = req.body;
    try {
        let request = await Request.findById(req.params.id);
        if (!request) {
            return next(new ErrorHandler(`Request is not found with this id: ${req.params.id}`));
        }

        let images = [];
        if (Array.isArray(req.body.images)) {
            images = req.body.images.map(image => 
                typeof image === 'object' && image.url ? image.url : image
            );
        } else if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        }

        if (images.length > 0) {
            for (let i = 0; i < request.images.length; i++) {
                await cloudinary.v2.uploader.destroy(request.images[i].public_id);
            }
            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: 'requests',
                });
        
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            req.body.images = imagesLinks;
        }

        const patient = await Patient.findById(data.patient);
        if (!patient) {
            return next(new ErrorHandler(`Patient is not found with this id: ${data.patient}`))
        } 
        
        patient.patientType = data.patientType;
        patient.save();

        let newData = {}
        if (data.patientType === 'Inpatient'){  
            newData = {
                ...data,
                department: data.location,
                hospital: 'Taguig-Pateros District Hospital'
            }
        } else {
            newData = {
                ...data,
                department: null,
                hospital: data.location
            }
        }

        request = await Request.findByIdAndUpdate(req.params.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            request,
        });

    } catch (error) {
        console.log('Error: ', error.message);
        next(error);
    }
});

// Delete request => /api/v1/request/:id
exports.deleteRequest = catchAsyncErrors(async (req, res, next) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        return next(new ErrorHandler(`request is not found with this id: ${req.params.id}`))
    }

    // for (let i = 0; i < request.images.length; i++) {
    //     const result = await cloudinary.v2.uploader.destroy(request.images[i].public_id)
    // }

    await request.deleteOne();

    res.status(200).json({
        success: true,
        message: "Request Deleted"
    })
});

// Update Request Status
exports.updateRequestStatus = catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;

    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return next(new ErrorHandler(`Request is not found with this id: ${req.params.id}`))
        }

        request.status = status;
        await request.save();

        res.status(200).json({
            success: true,
            message: "Request status updated successfully",
            data: request,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Assign Inventory to Request
exports.assignInventoryToRequest = catchAsyncErrors(async (req, res) => {
    const { inventoryDetails } = req.body;

    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        request.tchmb.ebm = {
            invId: inventoryDetails.map(item => item.inventoryId),
            batch: inventoryDetails.map(item => item.batch),
            pool: inventoryDetails.map(item => item.pool),
            bottle: inventoryDetails.map(item => item.bottleRange),
            volDischarge: inventoryDetails.reduce((total, item) => total + item.volume, 0)
        };

        await request.save();

        res.status(200).json({
            success: true,
            message: "Inventory successfully assigned to request",
            request,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Get staff request => /api/v1/staff/:id/requests
exports.myRequests = catchAsyncErrors(async (req, res, next) => {

    const requests = await Request.find({requestedBy: req.params.id})
        .populate('patient', 'name patientType')
        .populate('requestedBy', 'name employeeID')
        .populate('tchmb.approvedBy', 'name email role')
        .populate('tchmb.ebm', 'pasteurizedDetails');

    const count = requests.length;

    res.status(200).json({
        success: true,
        count,
        requests
    })
})