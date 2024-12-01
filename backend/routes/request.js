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
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), allRequests)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), createRequest);
router.route('/request/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getRequestDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateRequest)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteRequest);


module.exports = router;