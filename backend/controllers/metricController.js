const Inventory = require("../models/inventory");
const Fridge = require("../models/fridge");
const Donor = require("../models/donor");
const Recipient = require('../models/patient');

exports.getMetrics = async (req, res) => {
    try {
        const totalBags = await Inventory.countDocuments();
        const totalFridges = await Fridge.countDocuments();
        const totalDonors = await Donor.countDocuments();
        const totalRecipients = await Recipient.countDocuments();

        res.status(200).json({
            success: true,
            metrics: {
                totalBags,
                totalFridges,
                totalDonors,
                totalRecipients
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}