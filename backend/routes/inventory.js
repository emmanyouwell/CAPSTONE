const express = require('express');
const router = express.Router();

const { 
    allInventories,
    createInventory,
    getInventoryDetails,
    updateInventory,
    deleteInventory,
} = require('../controllers/inventoryController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Super Admin Routes
router.route('/inventories')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), allInventories)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), createInventory);
router.route('/inventory/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getInventoryDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateInventory)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteInventory);


module.exports = router;