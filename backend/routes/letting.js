const express = require('express');
const router = express.Router();

const { 
    allLettings,
    createLetting,
    getLettingDetails,
    updateLetting,
    deleteletting,
} = require('../controllers/lettingController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/lettings')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), allLettings)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), createLetting);
router.route('/letting/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), getLettingDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), updateLetting)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin', 'Admin'), deleteletting);


module.exports = router;