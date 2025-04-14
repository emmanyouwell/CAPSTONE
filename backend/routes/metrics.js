const express = require('express');
const router = express.Router();


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { getMetrics } = require('../controllers/metricController');



router.route('/metrics')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getMetrics);

module.exports = router;