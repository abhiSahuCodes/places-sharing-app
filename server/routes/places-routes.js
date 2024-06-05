const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller.js");
const fileUpload = require("../middleware/file-upload.js");
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

// Auth check middleware for routes below it i.e. post, patch, and delete
router.use(checkAuth);

router.post(
  "/",
  fileUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
