const express = require("express");
const { verify } = require("../auth");
const userController = require("../controllers/user");

const router = express.Router();
const { verifyAdmin } = require("../auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/details", verify, userController.details);
router.get("/", userController.getAllUsers);
router.patch("/update-password", verify, userController.updatePassword);
router.patch(
  "/:id/set-as-admin/",
  verify,
  verifyAdmin,
  userController.updateAdminStatus
);

module.exports = router;
