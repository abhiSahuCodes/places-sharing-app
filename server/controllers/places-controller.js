const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error.js");
const getCoordsForAddress = require("../util/location.js");
const Place = require("../models/place-model.js");
const User = require("../models/user-model.js");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

// Getting a place using a place id
// METHOD: GET
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    new HttpError("Something went wrong, could not find a place.", 500);
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }

  res.status(200).json({ place });
};

// Getting places added by specific user using userId
// METHOD: GET
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    new HttpError(
      "Something went wrong, could not find places for the user.",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the given user id.", 404)
    );
  }

  res.json({ places });
};

// Creating a place
// METHOD: POST
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description, address  } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(
      new HttpError("Creating place failed, please try again later.", 500)
    );
  }

  if (!user) {
    return next(new HttpError("Failed to find user for provided id.", 404));
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// To update a place by id
// METHOD: PATCH
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;

  try {
    place = await Place.findById(placeId);
    if (!place) {
      return next(
        new HttpError("Could not find a place for the provided id", 404)
      );
    }

    if (place.creator.toString() !== req.userData.userId) {
      return next(
        new HttpError("You are not allowed to edit this place.", 401)
      );
    }

    place = await Place.findByIdAndUpdate(
      placeId,
      { title, description },
      { new: true }
    );
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update place", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }

  res.status(200).json({ place });
};

// To delete a place by id
// METHOD: DELETE
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete place", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }

  if (place.creator.id !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to edit this place.", 401)
    );
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete the place.", 500)
    );
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
