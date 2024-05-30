const { v4: uuidv4 } = require("uuid");
const {validationResult} = require("express-validator");

const HttpError = require("../models/http-error.js");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
];

// Getting a place using a place id
// METHOD: GET
const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the given id.", 404);
  }

  res.json({ place });
};

// Getting places added by specific user using userId
// METHOD: GET
const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the given user id.", 404)
    );
  }

  res.json({ places });
};

// Creating a place
// METHOD: POST
const createPlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

// To update a place by id
// METHOD: PATCH
const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

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
