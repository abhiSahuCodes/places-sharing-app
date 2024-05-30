const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Abhishek Sahu",
    email: "abhishek@gmail.com",
    password: "testing123",
  },
  {
    id: "u2",
    name: "Rohan Sahu",
    email: "rohan@gmail.com",
    password: "testing456",
  },
];

// Get all users
// METHOD: GET

const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

// Register a user
// METHOD: POST
const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError(
      "Invalid input. Please add name, valid email, and password with minimum 6 characters.",
      422
    );
  }

  const { name, email, password } = req.body;

  const user = DUMMY_USERS.find((user) => user.email === email);

  if (user) {
    throw new HttpError("User already exists.", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ message: "User created", user: createdUser });
};

// Login a user
// METHOD: POST
const login = (req, res, next) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find((user) => user.email === email);

  if (!user) {
    throw new HttpError("User with this email is not found.", 401);
  }

  if (!(user.password === password)) {
    throw new HttpError("Invalid password", 404);
  }

  res.status(200).json({ message: "User loggedin", user: { email } });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
