const Event = require('../models/event')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All Events => /api/v1/events
exports.allEvents = catchAsyncErrors( async (req, res, next) => {
    const events = await Event.find();

    const count = await Event.countDocuments();

    res.status(200).json({
        success: true,
        count,
        events
    })
})

// Create Event => /api/v1/events
exports.createEvent= catchAsyncErrors( async (req, res, next) => {
    // const eventDate = req.body.eventDetails.date;
    // const eventTime = req.body.eventDetails.time;

    // const eventDetails = new Date(`${eventDate}T${eventTime}:00Z`)
    console.log('request: ', req.body);
    const eventDetails = req.body.eventDetails;
    const eventStatus = req.body.eventStatus.trim();

    const event = await Event.create({
        title: req.body.title,
        description: req.body.description,
        eventDetails,
        eventStatus,
        user: req.body.user
    });

    res.status(201).json({
        success: true,
        event
    });
})

// Get specific event details => /api/v1/event/:id
exports.getEventDetails = catchAsyncErrors( async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorHandler(`Event is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        event
    })
})

// Update event => /api/v1/event/:id
exports.updateEvent = catchAsyncErrors( async (req, res, next) => {
    const eventDate = req.body.eventDetails.date;
    const eventTime = req.body.eventDetails.time;

    const eventDetails = new Date(`${eventDate}T${eventTime}:00Z`)

    const eventStatus = req.body.eventStatus.trim();
    
    const newEventData = {
        title: req.body.title,
        description: req.body.description,
        eventDetails: eventDetails,
        eventStatus: eventStatus,
        user: req.body.user
    }

    const event = await Event.findByIdAndUpdate(req.params.id, newEventData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    
    res.status(200).json({
        success: true,
        event
    })

})

// Delete event => /api/v1/event/:id
exports.deleteEvent = catchAsyncErrors( async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorHandler(`Event is not found with this id: ${req.params.id}`))
    }

    // Remove pictures from cloudinary
    // const image_id = event.avatar.public_id;
    // await cloudinary.v2.uploader.destroy(image_id);

    await event.deleteOne();

    res.status(200).json({
        success: true,
        message: "Event Deleted"
    })
})