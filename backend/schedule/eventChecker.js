const cron = require("node-cron");
const mongoose = require("mongoose");
const Event = require("../models/event"); // Adjust path to your Event model


const checkEvents = async () => {
    console.log("Checking for events to update...");

    const now = new Date(); // Get the current date and time

    try {
        // Find events that are "Not-Due" but should now be "Ongoing"
        const events = await Event.find({
            "eventDetails.start": { $lte: now },
            eventStatus: "Not-Due",
        });

        if (events.length > 0) {
            await Event.updateMany(
                { _id: { $in: events.map(event => event._id) } },
                { $set: { eventStatus: "On-Going" } }
            );
            console.log(`Updated ${events.length} event(s) to Ongoing.`);
        }
        else {
            console.log("No events to update.");
        }
    } catch (error) {
        console.error("Error updating event statuses:", error);
    }
}
// Run the job every minute
cron.schedule("0 0 * * *", checkEvents);

module.exports = checkEvents;