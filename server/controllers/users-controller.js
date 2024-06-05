const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Can't create user, please try again", 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    new HttpError("Failed to signup. Please try again later.", 500);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Signup failed, please try again later.", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError(
        "Could not log you in, please check your password and try again.",
        401
      )
    );
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try again later", 500)
    );
  }

  res
    .status(200)
    .json({ userId: existingUser.id, email: existingUser.email, token: token });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
