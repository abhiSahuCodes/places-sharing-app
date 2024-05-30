const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require('./routes/places-routes.js');
// const userRoutes = require('')

const app = express();

// Middlewares

// Route Middleware
app.use("/api/places", placesRoutes);


// Error Middleware
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occured.'})
})



app.listen(5000);