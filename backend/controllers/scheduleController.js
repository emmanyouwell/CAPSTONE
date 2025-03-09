const Schedule = require('../models/schedule')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All schedules => /api/v1/schedules
exports.allSchedules = catchAsyncErrors( async (req, res, next) => {
    const schedules = await Schedule.find();

    const count = await Schedule.countDocuments();

    res.status(200).json({
        success: true,
        count,
        schedules
    })
})

// Create schedule => /api/v1/schedules
exports.createSchedule= catchAsyncErrors( async (req, res, next) => {
 
    const schedDate = new Date(req.body.dates)
    const schedStatus = req.body.status.trim();

    const schedule = await Schedule.create({
        ...req.body,
        dates: schedDate,
        status: schedStatus
    });

    res.status(201).json({
        success: true,
        schedule
    });
})

// Get specific schedule details => /api/v1/schedule/:id
exports.getScheduleDetails = catchAsyncErrors( async (req, res, next) => {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
        return next(new ErrorHandler(`schedule is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        schedule
    })
})

// Update schedule => /api/v1/schedule/:id
exports.updateSchedule = catchAsyncErrors( async (req, res, next) => {

    const schedDate = new Date(req.body.dates)
    const schedStatus = req.body.status.trim();
    
    const newScheduleData = {
        ...req.body,
        dates: schedDate,
        status: schedStatus
    }

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, newScheduleData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    
    res.status(200).json({
        success: true,
        schedule
    })

})

// Delete schedule => /api/v1/schedule/:id
exports.deleteSchedule = catchAsyncErrors( async (req, res, next) => {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
        return next(new ErrorHandler(`schedule is not found with this id: ${req.params.id}`))
    }

    await schedule.deleteOne();

    res.status(200).json({
        success: true,
        message: "schedule Deleted"
    })
})