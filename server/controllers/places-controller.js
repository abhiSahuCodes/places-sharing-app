const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error.js");
const getCoordsForAddress = require("../util/location.js");
const Place = require("../models/place-model.js");


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
  const places = await Place.filter((p) => p.creator === userId);

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

  const { title, description, address, creator } = req.body;

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
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    creator,
  });

  try {
    await createdPlace.save();
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
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  const placeIndex = await Place.findIndex((p) => p.id === placeId);

  if (placeIndex === -1) {
    throw new HttpError("Could not find a place for the given id.", 404);
  }

  const updatedPlace = { ...DUMMY_PLACES[placeIndex] };

  if (title) {
    updatedPlace.title = title;
  }
  if (description) {
    updatedPlace.description = description;
  }

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

// To delete a place by id
// METHOD: DELETE
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for the given id.", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
