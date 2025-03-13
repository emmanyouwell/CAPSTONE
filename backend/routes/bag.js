const express = require('express');
const router = express.Router();



const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { createBag, getDonorBags } = require('../controllers/bagController');

// Super Admin Routes
router.route('/bag')
    .post(isAuthenticatedUser, createBag);
    // .get(isAuthenticatedUser, allInventories)
    
router.route('/bag/:id')
    .get(isAuthenticatedUser, getDonorBags);
//     .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateInventory)
//     .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteInventory);


module.exports = router;