const express = require('express');
const router = express.Router();



const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { createBag, getDonorBags, getSingleBag, updateBag, deleteBag } = require('../controllers/bagController');

// Super Admin Routes
router.route('/bag')
    .post(isAuthenticatedUser, createBag);
// .get(isAuthenticatedUser, allInventories)
router.route('/bag/donor/:id')
    .get(isAuthenticatedUser, getDonorBags);

router.route('/bag/:id')
    .get(isAuthenticatedUser, getSingleBag)
    .put(isAuthenticatedUser, updateBag)
    .delete(isAuthenticatedUser, deleteBag)
//     .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateInventory)
//     .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteInventory);


module.exports = router;