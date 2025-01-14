const express = require('express');
const router = express.Router();

const { 
    allDonors,
    createDonor,
    getDonorDetails,
    updateDonor,
    deleteDonor,
} = require('../controllers/donorController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Super Admin Routes
router.route('/donors')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), allDonors)
    .post(createDonor);
    // .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), createDonor);
router.route('/donor/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getDonorDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateDonor)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteDonor);


module.exports = router;