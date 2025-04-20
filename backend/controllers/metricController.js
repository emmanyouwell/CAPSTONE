const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Inventory = require("../models/inventory");
const Fridge = require("../models/fridge");
const Donor = require("../models/donor");
const Recipient = require("../models/patient");
const Bags = require("../models/bags");

exports.getMetrics = catchAsyncErrors(async (req, res) => {
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
        totalRecipients,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

exports.getDonorsPerMonth = catchAsyncErrors(async (req, res, next) => {
  try {
    const donors = await Donor.find();
    const monthlyData = {};

    donors.forEach((donor) => {
      const isCommunity = donor.donorType === "Community";
      const isPrivate = [
        "Private",
        "Employee",
        "Network Office/Agency",
      ].includes(donor.donorType);

      if (!isCommunity && !isPrivate) return;

      const month = new Date(donor.createdAt).toLocaleString("default", {
        month: "long",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { community: 0, private: 0, total: 0 };
      }

      if (isCommunity) {
        monthlyData[month].community++;
      } else if (isPrivate) {
        monthlyData[month].private++;
      }

      monthlyData[month].total++;
    });

    const yearlyTotals = { community: 0, private: 0, total: 0 };
    Object.values(monthlyData).forEach((monthStats) => {
      yearlyTotals.community += monthStats.community;
      yearlyTotals.private += monthStats.private;
      yearlyTotals.total += monthStats.total;
    });

    monthlyData["total"] = yearlyTotals;

    const result = monthlyData;

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error fetching donor counts:", error);
    res.status(500).json({
      message: "Server error, please try again later.",
    });
  }
});

exports.getDonationStats = catchAsyncErrors(async (req, res, next) => {
  try {
    const bags = await Bags.find({ status: ["Collected", "Pasteurized"] });

    const stats = {};

    bags.forEach((bag) => {
      const isCommunity = bag.collectionType === "Public";
      const isPrivate = bag.collectionType === "Private";

      if (!isCommunity && !isPrivate) return;

      const month = new Date(bag.createdAt).toLocaleString("default", {
        month: "long",
      });

      const volume = bag.volume;

      if (!stats[month]) {
        stats[month] = { community: 0, private: 0, total: 0 };
      }

      if (isCommunity) {
        stats[month].community += volume;
      } else if (isPrivate) {
        stats[month].private += volume;
      }

      stats[month].total += volume;
    });

    const yearlyTotals = { community: 0, private: 0, total: 0 };
    Object.values(stats).forEach((monthStats) => {
      yearlyTotals.community += monthStats.community;
      yearlyTotals.private += monthStats.private;
      yearlyTotals.total += monthStats.total;
    });

    stats["total"] = yearlyTotals;

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
