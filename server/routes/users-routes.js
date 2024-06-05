const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controller.js");
const fileUpload = require("../middleware/file-upload.js");

const router = express.Router();

router.get("/", usersControllers.getAllUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;
