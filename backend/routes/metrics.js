const express = require('express');
const router = express.Router();


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { getMetrics, getDonationStats, getDonorsPerMonth, getDispensedMilk } = require('../controllers/metricController');



router.route('/metrics')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getMetrics);

router.route('/milkPerMonth')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getDonationStats)
router.route('/donorsPerMonth')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getDonorsPerMonth)
router.route('/dispensePerMonth')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getDispensedMilk)

module.exports = router;