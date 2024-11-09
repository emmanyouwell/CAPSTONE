const express = require('express');
const router = express.Router();

const { 
    allFridges,
    createFridge,
    getFridgeDetails,
    updateFridge,
    deleteFridge
} = require('../controllers/fridgeController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Super Admin Routes
router.route('/fridges')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), allFridges)
    .post(isAuthenticatedUser, authorizeRoles('Staff','SuperAdmin', 'Admin'), createFridge);
router.route('/fridge/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getFridgeDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateFridge)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteFridge);


module.exports = router;