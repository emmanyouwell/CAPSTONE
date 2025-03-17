const cron = require("node-cron");
const mongoose = require("mongoose");
const Event = require("../models/event"); // Adjust path to your Event model


const checkEvents = async () => {
    console.log("Checking for events to update...");

    const now = new Date(); // Get the current date and time

    try {
        // Find events that are "Not-Due" but should now be "Ongoing"
        const OnGoingEvents = await Event.find({
            "eventDetails.start": { $lte: now },
            eventStatus: "Not-Due",
        });
        const DoneEvents = await Event.find({
            "eventDetails.end": { $lte: now },
            eventStatus: "On-Going",
        });
        if (OnGoingEvents.length > 0) {
            await Event.updateMany(
                { _id: { $in: OnGoingEvents.map(event => event._id) } },
                { $set: { eventStatus: "On-Going" } }
            );
            console.log(`Updated ${OnGoingEvents.length} event(s) to Ongoing.`);
        }
        else {
            console.log("No events to update.");
        }
        if (DoneEvents.length > 0) {
            await Event.updateMany(
                { _id: { $in: DoneEvents.map(event => event._id) } },
                { $set: { eventStatus: "Done" } }
            );
            console.log(`Updated ${DoneEvents.length} event(s) to Done.`);
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