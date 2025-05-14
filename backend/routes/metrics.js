const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const {
  getMetrics,
  getDonationStats,
  getDonorsPerMonth,
  getDispensedMilk,
  getPatientsPerMonth,
  getRequestsPerMonth,
  getAvailableMilk,
  pasteurizeSoon,
} = require("../controllers/metricController");

router.route("/metrics")
  .get(isAuthenticatedUser, authorizeRoles("SuperAdmin", "Admin"), getMetrics);

router.route("/milkPerMonth")
  .get(
    isAuthenticatedUser,
    authorizeRoles("SuperAdmin", "Admin"),
    getDonationStats
  );
router.route("/donorsPerMonth")
  .get(
    isAuthenticatedUser,
    authorizeRoles("SuperAdmin", "Admin"),
    getDonorsPerMonth
  );
router.route("/dispensePerMonth")
  .get(
    isAuthenticatedUser,
    authorizeRoles("SuperAdmin", "Admin"),
    getDispensedMilk
  );
router.route("/patientsPerMonth")
  .get(
    isAuthenticatedUser,
    authorizeRoles("SuperAdmin", "Admin"),
    getPatientsPerMonth
  );
router.route("/requestsPerMonth")
  .get(
    isAuthenticatedUser,
    authorizeRoles("SuperAdmin", "Admin"),
    getRequestsPerMonth
  );

router.route("/availableMilk")
.get(
  isAuthenticatedUser,
  authorizeRoles("SuperAdmin", "Admin"),
  getAvailableMilk
);

router.route("/expiringMilk")
.get(
  isAuthenticatedUser,
  authorizeRoles("SuperAdmin", "Admin"),
  pasteurizeSoon
);

module.exports = router;
