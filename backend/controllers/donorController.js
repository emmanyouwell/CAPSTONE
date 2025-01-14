const Donor = require('../models/donor')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All Donors => /api/v1/donors
exports.allDonors = catchAsyncErrors(async (req, res, next) => {
    // Destructure search query parameters from the request
    const { search } = req.query;

    // Create a query object to hold the search criteria
    const query = {};

    if (search) {
        query.$or = [
            { 'name.first': { $regex: search, $options: 'i' } },  // Search in first name
            { 'name.middle': { $regex: search, $options: 'i' } }, // Search in middle name
            { 'name.last': { $regex: search, $options: 'i' } }    // Search in last name
        ];
    }

    // Optional: Add pagination (e.g., limit results and skip for page number)
    const page = Number(req.query.page) || 1;
    const pageSize = 10; // Adjust page size as needed
    const skip = (page - 1) * pageSize;

    try {
        // Find donors based on the query object
        const donors = await Donor.find(query)
            .skip(skip)
            .limit(pageSize);

        // Count total donors after filtering (for pagination)
        const count = await Donor.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            pageSize,
            donors
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

// Create donor => /api/v1/donors
exports.createDonor = catchAsyncErrors(async (req, res, next) => {
    const data = req.body;
    console.log(data);
    const name = {
        first: data.first_name,
        middle: data.middle_name,
        last: data.last_name
    }
    const donor = await Donor.create({
        name: name,
        address: data.home_address,
        phone: data.contact_number,
        age: data.age,
        birthday: data.birthday,
        // civilStatus: data.civilStatus,
        // spouse: data.spouse,
        children: data.child_name,
        // donation: data.donation
    });

    res.status(201).json({
        success: true,
        donor
    });
})

// Get specific donor details => /api/v1/donor/:id
exports.getDonorDetails = catchAsyncErrors(async (req, res, next) => {
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
exports.updateDonor = catchAsyncErrors(async (req, res, next) => {
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
exports.deleteDonor = catchAsyncErrors(async (req, res, next) => {
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