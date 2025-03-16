const Donor = require('../models/donor');
const Letting = require('../models/letting');
const Schedule = require('../models/schedule');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Record Public Donation after Milk Letting
exports.recordPublicDonation = catchAsyncErrors(async (req, res, next) => {
    const { lettingId } = req.body;

    try {
        const milkLetting = await Letting.findById(lettingId).populate('attendance.donor');
        if (!milkLetting) {
            return next(new ErrorHandler(`Milk Letting Event not found with ID: ${lettingId}`));
        }

        const donorIds = milkLetting.attendance.map(att => att.donor);

        const result = await Donor.updateMany(
            { _id: { $in: donorIds } },
            {
                $push: {
                    donations: {
                        donationType: 'Public',
                        milkLettingEvent: lettingId
                    }
                }
            }
        );

        if (result.matchedCount === 0) {
            return next(new ErrorHandler('No matching donors found for this event.'));
        }

        res.status(200).json({ 
            success: true, 
            message: 'Donation recorded successfully',
            updatedDonors: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to record donation', 
            details: error.message 
        });
    }
});

// Record Private Donation after Schedule Approval
exports.recordPrivateDonation = catchAsyncErrors(async (req, res, next) => {
    const { donorId, scheduleId } = req.body;

    try {
        const donor = await Donor.findById(donorId);
        if (!donor) return res.status(404).json({ error: 'Donor not found' });

        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

        donor.donations.push({
            donationType: 'Private',
            date: new Date(),
            schedule: scheduleId
        });

        schedule.status = 'Completed'

        await donor.save();
        await schedule.save();
        
        res.status(200).json({ message: 'Donation recorded successfully', donor });
    } catch (error) {
        res.status(500).json({ error: 'Failed to record donation' });
    }
});