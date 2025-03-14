const Donor = require('../models/donor');
const Letting = require('../models/letting');
const Schedule = require('../models/schedule');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Record Public Donation after Milk Letting
exports.recordPublicDonation = catchAsyncErrors(async (req, res, next) => {
    const { lettingId } = req.body;

    try {
        const milkLetting = await Letting.findById(lettingId);
        if (!milkLetting) return next(new ErrorHandler(`Milk Letting is not found with this id: ${lettingId}`));

        for (let att of milkLetting.attendance) {
            const donor = await Donor.findById(att.donor);
            if (!donor) return next(new ErrorHandler(`Donor is not found with this id: ${att.donor}`));

            donor.donations.push({
                donationType: 'Public',
                volume: att.volume,
                milkLettingEvent: lettingId
            });
            await donor.save();
        }

        res.status(200).json({ message: 'Donation recorded successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Record Private Donation after Schedule Approval
exports.recordPrivateDonation = catchAsyncErrors(async (req, res, next) => {
    const { donorId, volume, scheduleId } = req.body;

    try {
        const donor = await Donor.findById(donorId);
        if (!donor) return res.status(404).json({ error: 'Donor not found' });

        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

        donor.donations.push({
            donationType: 'Private',
            volume,
            date: new Date(),
            relatedRecord: scheduleId
        });

        schedule.status = 'Completed'

        await donor.save();
        await schedule.save();
        
        res.status(200).json({ message: 'Donation recorded successfully', donor });
    } catch (error) {
        res.status(500).json({ error: 'Failed to record donation' });
    }
});