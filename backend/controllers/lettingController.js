const Letting = require('../models/letting');
const Collection = require('../models/collection')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All lettings => /api/v1/lettings
exports.allLettings = catchAsyncErrors(async (req, res, next) => {
    const lettings = await Letting.find()
        .populate({
            path: 'attendance.donor',
            select: 'user home_address donations',
            populate: {
                path: 'user',
                select: 'name'
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
            select: 'user home_address donation',
            populate: {
                path: 'user',
                select: 'name'
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

// Create Milk Letting Event
exports.createEvent = catchAsyncErrors(async (req, res) => {
    const { activity, venue, actDetails, admin } = req.body;

    try {
        const newEvent = await Letting.create({
            activity,
            venue,
            actDetails,
            admin 
        });
        res.status(201).json({ success: true, message: 'Created Milk Letting Event', newEvent});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event', details: error.message });
    }
});

// Mark Attendance for Donors
exports.markAttendance = catchAsyncErrors(async (req, res) => {
    const { lettingId, donorId, donorType, volume, lastDonation } = req.body;

    try {
        const event = await Letting.findById(lettingId);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        let total = Number(event.totalVolume) || 0;
        const numericVolume = Number(volume) || 0; 

        const attendanceEntry = {
            donor: donorId,
            donorType,
            volume: numericVolume,
            lastDonation
        };

        event.attendance.push(attendanceEntry);
        total += numericVolume;
        event.totalVolume = total;
        await event.save();

        res.status(200).json({ success: true, message: 'Attendance recorded successfully', event });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark attendance', details: error.message });
    }
});

// Finalize the Milk Letting Session
exports.finalizeSession = catchAsyncErrors(async (req, res) => {
    const { lettingId, adminId } = req.body;

    try {
        const event = await Letting.findById(lettingId);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        event.status = 'Done';
        await event.save();

        const newCollection = await Collection.create({
            collectionType: 'Public',
            collectionDate: new Date(),
            user: adminId,
            pubDetails: lettingId
        });

        res.status(200).json({ success: true, message: 'Session finalized successfully', newCollection });
    } catch (error) {
        res.status(500).json({ error: 'Failed to finalize session', details: error.message });
    }
});