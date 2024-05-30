const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
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

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    // return res
    //   .status(404)
    //   .json({ message: "Could not find a place for the provided id." });
    const error = new Error("Could not find a place for the given id.");
    error.code = 404;
    throw error;
  }

  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => p.creator === userId);

  if (!place) {
    const error = new Error("Could not find a place for the given user id.");
    error.code = 404;
    return next(error);
  }

  res.json({ place });
});

module.exports = router;

// The order of defining routes matter:
// /api/places/user won't give any error, it will simply show {}.
// It will think it as /:pid as it is after /api/places.
// Here, no big problem as after user has uid.
// But, if only /user route is there, then it must be defined before pid route.
