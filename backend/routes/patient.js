const express = require('express');
const router = express.Router();

const { 
    allPatients,
    createPatient,
    getPatientDetails,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Super Admin Routes
router.route('/patients')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin'), allPatients)
    .post(isAuthenticatedUser, authorizeRoles('SuperAdmin'), createPatient);
router.route('/patient/:id')
    .get(isAuthenticatedUser, authorizeRoles('SuperAdmin'), getPatientDetails)
    .put(isAuthenticatedUser, authorizeRoles('SuperAdmin'), updatePatient)
    .delete(isAuthenticatedUser, authorizeRoles('SuperAdmin'), deletePatient);


module.exports = router;