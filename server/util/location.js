const axios = require("axios");

const HttpError = require("../models/http-error");

async function getCoordsForAddress(address) {
  // Using the Nominatim API endpoint for geocoding
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`
  );

  const data = response.data;

  // Checking if the data array is empty, indicating no results found
  if (!data || data.length === 0) {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  // Nominatim returns an array of results, the first one is the data
  const firstResult = data[0];
  const coordinates = {
    lat: firstResult.lat,
    lng: firstResult.lon,
  };

  return coordinates;
}

module.exports = getCoordsForAddress;




/*   
With google api key

const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA';

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;


In both cases, the return should be like this:
{
  lat: 40.7484474,
  lng: -73.9871516
};


*/
