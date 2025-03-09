const express = require('express');
const router = express.Router();

const { 
    allSchedules,
    createSchedule,
    getScheduleDetails,
    updateSchedule,
    deleteSchedule
} = require('../controllers/scheduleController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/schedules')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), allSchedules)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), createSchedule);
router.route('/schedule/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getScheduleDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateSchedule)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteSchedule);


module.exports = router;