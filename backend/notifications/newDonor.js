const cron = require("node-cron");
const Notification = require("../models/notification");
const Donor = require("../models/donor");
const { sendPushNotification } = require("../utils/sendPushNotification");

let lastChecked = new Date(); // Stores last checked timestamp

const newDonor = async () => {
  try {
    const now = new Date();

    const newDonors = await Donor.find({ createdAt: { $gte: lastChecked } });
    if (newDonors.length > 0) {
      const adminDevices = await Notification.find().populate("user", "role");
      const filteredDevices = adminDevices.filter((dev) => dev.user.role === "Admin");

      for (const donor of newDonors) {
        for (const device of filteredDevices) {
          const notificationData = {
            token: device.token,
            title: "New Donor Applied",
            body: `A new donor (${donor.name.first} ${donor.name.last}) has been added. Check the portal for details.`,
          };

          console.log("Sending Notification:", notificationData);
          await sendPushNotification(notificationData.token, notificationData.title, notificationData.body);
        }
      }
      console.log("New donor notifications sent successfully.");
    }

    lastChecked = now; 
  } catch (error) {
    console.error("Error sending new donor notification:", error);
  }
};

// Schedule the task to run every minute
cron.schedule("* * * * *", newDonor);

module.exports = newDonor;
