const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user-model");

// Get all users
// METHOD: GET

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(error);
  }
  res.status(200).json({ users: users });
};

// Register a user
// METHOD: POST
const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError(
        "Invalid input. Please add name, valid email, and password with minimum 6 characters.",
        422
      )
    );
  }

  const { name, email, password } = req.body;

  let user;

  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(error);
  }

  if (user) {
    return next(new HttpError("User already exists.", 422));
  }

  const createdUser = new User({
    name,
    email,
    image: "https://i.ibb.co/q5zbhJG/prof-place-sharing.png",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    new HttpError("Failed to signup. Please try again later.", 500);
    return next(error);
  }

  res.status(201).json({ message: "User created", user: createdUser });
};

// Login a user
// METHOD: POST
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(error);
  }

  if (!existingUser) {
    return next(new HttpError("User with this email is not found.", 401));
  }

  if (!(existingUser.password === password)) {
    return next(new HttpError("Invalid password", 404));
  }

  res.status(200).json({ message: "User loggedin", user: { email } });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
