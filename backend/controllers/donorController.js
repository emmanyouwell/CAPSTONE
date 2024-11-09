const Donor = require('../models/donor')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All Donors => /api/v1/donors
exports.allDonors = catchAsyncErrors( async (req, res, next) => {
    const donors = await Donor.find();

    const count = await Donor.countDocuments();

    res.status(200).json({
        success: true,
        count,
        donors
    })
})

// Create donor => /api/v1/donors
exports.createDonor= catchAsyncErrors( async (req, res, next) => {
    const data = req.body;

    const donor = await Donor.create({
        name: data.name,
        address: data.address,
        phone: data.phone,
        age: data.age,
        birthday: data.birthday,
        civilStatus: data.civilStatus,
        spouse: data.spouse,
        children: data.children,
        donation: data.donation
    });

    res.status(201).json({
        success: true,
        donor
    });
})

// Get specific donor details => /api/v1/donor/:id
exports.getDonorDetails = catchAsyncErrors( async (req, res, next) => {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
        return next(new ErrorHandler(`donor is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        donor
    })
})

// Update donor => /api/v1/donor/:id
exports.updateDonor = catchAsyncErrors( async (req, res, next) => {
    const data = req.body;
    
    const newdonorData = {
        name: data.name,
        address: data.address,
        phone: data.phone,
        age: data.age,
        birthday: data.birthday,
        civilStatus: data.civilStatus,
        spouse: data.spouse,
        children: data.children,
        donation: data.donation
    }

    const donor = await Donor.findByIdAndUpdate(req.params.id, newdonorData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    
    res.status(200).json({
        success: true,
        donor
    })

})

// Delete donor => /api/v1/donor/:id
exports.deleteDonor = catchAsyncErrors( async (req, res, next) => {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
        return next(new ErrorHandler(`Donor is not found with this id: ${req.params.id}`))
    }

    await donor.deleteOne();

    res.status(200).json({
        success: true,
        message: "Donor Deleted"
    })
})