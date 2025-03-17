const Schedule = require('../models/schedule')
const Collection = require('../models/collection');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const Bag = require('../models/bags');
const Donor = require('../models/donor');
// Get All schedules => /api/v1/schedules
exports.allSchedules = catchAsyncErrors(async (req, res, next) => {
    const schedules = await Schedule.find()
        .populate({
            path: 'donorDetails.donorId',
            populate: { path: 'user' }
        })
        .populate('donorDetails.bags')

    const count = await Schedule.countDocuments();

    res.status(200).json({
        success: true,
        count,
        schedules
    })
})

// Create schedule => /api/v1/schedules
exports.createSchedule = catchAsyncErrors(async (req, res, next) => {

    const schedDate = new Date(req.body.dates)

    const schedule = await Schedule.create({
        ...req.body,
        dates: schedDate
    });

    res.status(201).json({
        success: true,
        schedule
    });
})

// Get specific schedule details => /api/v1/schedule/:id
exports.getScheduleDetails = catchAsyncErrors(async (req, res, next) => {
    let schedule = await Schedule.findById(req.params.id)
        .populate({
            path: 'donorDetails.donorId',
            populate: { path: 'user' }
        })
        .populate('donorDetails.bags');

    if (!schedule) {
        return next(new ErrorHandler(`schedule is not found with this id: ${req.params.id}`))
    }
    let oldest;
    let latest;
    if (schedule.donorDetails.bags.length > 0) {
        oldest = schedule.donorDetails.bags.reduce((prev, curr) =>
            new Date(prev.expressDate) < new Date(curr.expressDate) ? prev : curr
        ).expressDate;

        latest = schedule.donorDetails.bags.reduce((prev, curr) =>
            new Date(prev.expressDate) > new Date(curr.expressDate) ? prev : curr
        ).expressDate;


    }
    schedule = { ...schedule.toObject(), oldestExpressDate: oldest, latestExpressDate: latest };
    res.status(200).json({
        success: true,
        schedule,
      
    })
})

// Update schedule => /api/v1/schedule/:id
exports.updateSchedule = catchAsyncErrors(async (req, res, next) => {

    const schedDate = new Date(req.body.dates)

    const newScheduleData = {
        ...req.body,
        dates: schedDate
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
exports.deleteSchedule = catchAsyncErrors(async (req, res, next) => {
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

// Request a Pickup Schedule
exports.requestSchedule = catchAsyncErrors(async (req, res) => {
    const { date, userId } = req.body;

    try {
        const donor = await Donor.findOne({ user: userId });
        if (!donor) return res.status(404).json({ error: 'Donor not found' });

        const sched = await Schedule.findOne({ "donorDetails.donorId": donor._id, status: 'Pending' });
        if (sched) return res.status(400).json({ error: 'You already have a pending schedule' });




        const bags = await Bag.find({ donor: donor._id, status: 'Expressed', collectionType: 'Private' });
        if (bags.length === 0) return res.status(404).json({ error: 'No bags found for this donor' });

        const address = donor.home_address.street + ', ' + donor.home_address.brgy + ', ' + donor.home_address.city;

        const totalVolume = bags.reduce((total, item) => {
            return total + item.volume;
        }, 0);

        const newSchedule = await Schedule.create({
            address,
            dates: date,
            donorDetails: { donorId: donor._id, bags },
            totalVolume
        });

        await Bag.updateMany(
            { donor: donor._id, status: 'Expressed', collectionType: 'Private' },
            { $set: { status: 'Scheduled' } }
        );


        res.status(201).json({ message: 'Schedule requested successfully', newSchedule });
    } catch (error) {
        res.status(500).json({ error: 'Failed to request schedule', details: error.message });
    }
});


exports.getDonorSchedules = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;

    const donor = await Donor.findOne({ user: id });
    if (!donor) return res.status(404).json({ error: 'Donor not found' });


    const statusOrder = { Pending: 1, Approved: 2, Completed: 3 };


    const sched = await Schedule.aggregate([
        { $match: { "donorDetails.donorId": donor._id } },
        {
            $addFields: {
                statusOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$status", "Pending"] }, then: 1 },
                            { case: { $eq: ["$status", "Approved"] }, then: 2 },
                            { case: { $eq: ["$status", "Completed"] }, then: 3 }
                        ],
                        default: 4 // Default to lowest priority
                    }
                }
            }
        },
        { $sort: { statusOrder: 1, date: -1 } }, // Sort by status first, then by date (newest first)
        { $project: { statusOrder: 0 } } // Remove the temporary sorting field
    ]);

    if (!sched) return res.status(404).json({ error: 'No pending schedule found' });
    console.log(sched.length)
    res.status(200).json({
        success: true,
        count: sched.length,
        schedules: sched
    })
});

// Approve or Modify a Pickup Schedule
exports.approveSchedule = catchAsyncErrors(async (req, res) => {
    const { scheduleId, newDate, adminId, venue } = req.body;

    try {
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

        if (newDate) schedule.dates = newDate;
        schedule.venue = venue
        schedule.status = 'Approved'
        schedule.approvedBy = adminId;
        await schedule.save();

        const newCollection = await Collection.create({
            collectionType: 'Private',
            collectionDate: schedule.dates,
            user: adminId,
            privDetails: scheduleId,
        });

        res.status(200).json({ message: 'Schedule approved successfully', newCollection });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve schedule', details: error.message });
    }
});