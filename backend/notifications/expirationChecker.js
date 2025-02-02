const cron = require("node-cron");
const Notification = require('../models/notification');
const Inventory = require('../models/inventory');
const Fridge = require('../models/fridge');
const { sendPushNotification } = require("../utils/sendPushNotification");

const checkExpiringMilk = async () => {
  try {
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    // Find inventories that will expire within a week
    const expiringMilk = await Inventory.find({
      $or: [
        { "pasteurizedDetails.expiration": { $gte: today, $lte: oneWeekLater } },
        { "unpasteurizedDetails.expiration": { $gte: today, $lte: oneWeekLater } }
      ],
      status: "Available"
    });

    const adminDevices = await Notification.find().populate('user', 'role');
    const filteredDevices = adminDevices.filter((dev) => dev.user.role === 'Admin');

    for (const milk of expiringMilk) {
      const expirationDate = milk.pasteurizedDetails?.expiration || milk.unpasteurizedDetails?.expiration;
      const fridge = await Fridge.findOne(milk.fridge);

      for (const device of filteredDevices) {
        let notificationData = {};
        if (fridge.fridgeType === 'Pasteurized') {
            notificationData = {
                token: device.token,
                title: `Pasteurized Milk Expiration`,
                body: `Milk ID: ${milk._id} will expire on ${expirationDate.toISOString().split('T')[0]}. Please take necessary actions.`
            };
        } else {
            notificationData = {
                token: device.token,
                title: `Unpasteurized Milk Expiration`,
                body: `Milk ID: ${milk._id} will expire on ${expirationDate.toISOString().split('T')[0]}. Please take necessary actions.`
            };
        }

        console.log("Sending Notification:", notificationData);
        await sendPushNotification(notificationData.token, notificationData.title, notificationData.body);
      }
    }
    console.log("Expiration notifications sent successfully.");
  } catch (error) {
    console.error("Error checking expiring milk:", error);
  }
};

// Schedule the task to run every day at midnight (server time)
cron.schedule("0 0 * * *", checkExpiringMilk);

module.exports = checkExpiringMilk;