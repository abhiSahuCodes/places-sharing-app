const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const placesRoutes = require("./routes/places-routes.js");
const usersRoutes = require("./routes/users-routes.js");
const HttpError = require("./models/http-error.js");

const app = express();

// Parsing data
app.use(express.json());

// Middlewares

// Route Middleware
app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

// Error Middleware
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured." });
});

mongoose
  .connect(process.env.URI)
  .then(() => console.log("Database connected!"))
  .then(() => app.listen(5000, console.log("Server connected at PORT 5000!")))
  .catch((error) => console.log(error));
