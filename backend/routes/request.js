const express = require('express');
const router = express.Router();

const { 
    allRequests,
    createRequest,
    getRequestDetails,
    updateRequest,
    deleteRequest,
    updateRequestStatus,
    assignInventoryToRequest,
    myRequests,
    updateVolumeRequested,
} = require('../controllers/requestController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/requests')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), allRequests)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), createRequest);
router.route('/request/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), getRequestDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), updateRequest)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin', 'Staff'), deleteRequest);

router.route('/request/:id/volume')
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateVolumeRequested);

router.route('/request-status/:id')
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateRequestStatus)

router.route('/assign-inventory/:id')
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), assignInventoryToRequest)

router.route('/staff/:id/requests')
    .get(isAuthenticatedUser, authorizeRoles('Staff'), myRequests)


module.exports = router;