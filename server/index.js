const express = require("express");

const placesRoutes = require('./routes/places-routes.js');
const HttpError = require("./models/http-error.js");

const app = express();

// Parsing data
app.use(express.json());

// Middlewares

// Route Middleware
app.use("/api/places", placesRoutes);



// Error Middleware
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occured.'})
})



app.listen(5000);