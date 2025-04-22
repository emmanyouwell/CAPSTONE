const express = require('express');
const router = express.Router();


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { getMetrics, getDonationStats, getDonorsPerMonth } = require('../controllers/metricController');



router.route('/metrics')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getMetrics);

router.route('/milkPerMonth')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getDonationStats)
router.route('/donorsPerMonth')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getDonorsPerMonth)

module.exports = router;