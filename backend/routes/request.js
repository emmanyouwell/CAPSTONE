const express = require('express');
const router = express.Router();

const { 
    allRequests,
    createRequest,
    getRequestDetails,
    updateRequest,
    deleteRequest,
} = require('../controllers/requestController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/requests')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), allRequests)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), createRequest);
router.route('/request/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), getRequestDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), updateRequest)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), deleteRequest);


module.exports = router;