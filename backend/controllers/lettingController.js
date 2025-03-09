const Letting = require('../models/letting')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All lettings => /api/v1/lettings
exports.allLettings = catchAsyncErrors(async (req, res, next) => {
    const lettings = await Letting.find()
        .populate({
            path: 'attendance.donor',
            select: 'name home_address donation',
            populate: {
                path: 'donation.invId',
                select: 'unpasteurizedDetails'
            }
        });

    const count = await Letting.countDocuments();

    res.status(200).json({
        success: true,
        count,
        lettings
    });
});

// Create letting => /api/v1/lettings
exports.createLetting= catchAsyncErrors( async (req, res, next) => {

    const actDetails = {
        start: new Date(req.body.start),  // This stores in UTC
        end: new Date(req.body.end)       // This stores in UTC
    };

    const letting = await Letting.create({
        ...req.body,
        actDetails
    });

    res.status(201).json({
        success: true,
        letting
    });
})

// Get specific letting details => /api/v1/letting/:id
exports.getLettingDetails = catchAsyncErrors( async (req, res, next) => {
    const letting = await Letting.findById(req.params.id)
        .populate({
            path: 'attendance.donor',
            select: 'name home_address donation',
            populate: {
                path: 'donation.invId',
                select: 'unpasteurizedDetails'
            }
        });

    if (!letting) {
        return next(new ErrorHandler(`letting is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        letting
    })
})

// Update letting => /api/v1/letting/:id
exports.updateLetting = catchAsyncErrors( async (req, res, next) => {
    const actDetails = {
        start: req.body.start,
        end: req.body.end
    }
    
    const newLettingData = {
        ...req.body,
        actDetails
    }

    const letting = await Letting.findByIdAndUpdate(req.params.id, newLettingData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    
    res.status(200).json({  
        success: true,
        letting
    })

})

// Delete letting => /api/v1/letting/:id
exports.deleteletting = catchAsyncErrors( async (req, res, next) => {
    const letting = await Letting.findById(req.params.id);

    if (!letting) {
        return next(new ErrorHandler(`letting is not found with this id: ${req.params.id}`))
    }

    await letting.deleteOne();

    res.status(200).json({
        success: true,
        message: "Milk Letting Deleted"
    })
})