const express = require('express');
const router = express.Router();

const { 
    allCollection,
    createCollection,
    getCollectionDetails,
    updateCollection,
    deleteCollection
} = require('../controllers/collectController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Super Admin Routes
router.route('/collections')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), allCollection)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), createCollection);
router.route('/collection/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getCollectionDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateCollection)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteCollection);


module.exports = router;