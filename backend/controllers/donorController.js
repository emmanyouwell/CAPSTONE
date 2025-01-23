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
    const pageSize = Number(req.query.pageSize) || 10; // Adjust page size as needed
    const skip = (page - 1) * pageSize;

    try {
        // Find donors based on the query object
        const donors = await Donor.find(query)
            .skip(skip)
            .limit(pageSize);

        const totalDonors = await Donor.countDocuments(query);
        const totalPages = Math.ceil(totalDonors / pageSize);

        res.status(200).json({
            success: true,
            totalDonors,
            totalPages,
            pageSize,
            donors
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})
exports.testDonors = catchAsyncErrors(async (req, res, next) => {
    try {
        const fields = req.body.data.fields;
        let data = {};
        console.log("fields: ", fields);
        fields.forEach(field => {
            if (field.type === "MULTIPLE_CHOICE") {
                const result = field.value.map(selected => {
                    const match = field.options.find(option => option.id === selected);
                    return match ? match.text : null;
                }).filter(item => item !== null);
                data[field.label] = result;
            }
            else if (field.type === "CHECKBOXES" && field.key === "question_rBK1gL") {
                const result = field.value.map(selected => {
                    const match = field.options.find(option => option.id === selected);
                    return match ? match.text : null;
                }).filter(item => item !== null);
                console.log("result: ", result);
                data[field.label] = result;
            }
            else {
                data[field.label] = field.value;
            }

        })
        console.log("data: ", data);
        const name = {
            first: data.first_name || "",
            middle: data.middle_name || "",
            last: data.last_name || "",
        };

        // Prepare children array with one child object
        const children = [{
            name: data.child_name,
            age: data.child_age,
            birth_weight: data.birth_weight,
            aog: data.aog
        }];
        // Create donor in the database
        const donor = await Donor.create({
            name: name,
            home_address: data.home_address,
            phone: data.contact_number,
            age: data.age,
            birthday: data.birthday,
            children: children,
            office_address: data.office_address,
            contact_number: data.contact_number_2,
            donorType: data.donor_type[0],
            occupation: data.occupation
        });
        res.status(200).json({
            success: true,
            fields,
            data,
            donor
        });
    }
    catch (error) {
        console.error("Error in createDonor:", error);
        res.status(500).json({ error: error.message });
    }
})
// Create donor => /api/v1/donors
exports.createDonor = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = req.body;

        if (!data || !data.data.fields || !Array.isArray(data.data.fields)) {
            console.log("no data or fields", data);
            return res.status(400).json({
                success: false,
                message: "Invalid request body. 'fields' array is required."
            });
        }

        const fields = data.data.fields;
        // Extract the child name
        const childName = fields[11]?.value;

        // Prepare children array with one child object
        const children = childName ? [{ name: childName }] : [];
        console.log("checkbox: ", fields.find(field => field.key === "question_rBK1gL"));
        console.log("checkbox options: ", fields.find(field => field.key === "question_rBK1gL").options);
        // Validate required fields
        if (fields.length < 12) {
            console.log("fields length", fields.length);
            return res.status(400).json({
                success: false,
                message: "Incomplete form submission. Please provide all required fields."
            });
        }

        const name = {
            first: fields[0]?.value || "",
            middle: fields[1]?.value || "",
            last: fields[2]?.value || "",
        };

        // Check for missing required field values
        if (!name.first || !name.last || !fields[6]?.value || !fields[7]?.value || !fields[4]?.value || !fields[3]?.value) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: first name, last name, address, phone, age, or birthday."
            });
        }

        // Create donor in the database
        const donor = await Donor.create({
            name: name,
            home_address: fields[6].value,
            phone: fields[7].value,
            age: fields[4].value,
            birthday: fields[3].value,
            children: children,
        });

        res.status(201).json({
            success: true,
            donor,
        });
    } catch (error) {
        console.error("Error in createDonor:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while creating the donor.",
            error: error.message,
        });
    }
});

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