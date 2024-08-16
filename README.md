# Place Share

This is a full-stack MERN application that allows users to share and explore places. The app offers user authentication, allowing users to sign up, log in, and manage their own place listings. Unauthenticated users can browse places shared by others, while authenticated users can add, edit, and delete their own places. The app also integrates map functionality to show the location of each place based on its address.

[Live Demo](https://placeshare.vercel.app/)

## Features

* User Authentication:

  * Secure signup and login with password encryption and JWT-based authentication.
  * Logout functionality for securely ending sessions.

* Public User Profiles:

  * Browse all users and view their profile pictures and the number of places they've shared.

  * Click on any user to see all places they've added, each with a photo, title, description, address, and a "View on Map" button.

* Personalized Dashboard:

  * Authenticated users can view their own places with additional options to edit or delete.

  * Easily manage your own place listings from your dashboard.

* Add Place:

  * Authenticated users can add new places by providing a title, description, address, and a photo.

  * The map is automatically generated based on the provided address using Nominatim OpenStreetMap for geolocation.

* Map Integration:

  * Each place's location is displayed on a map, allowing users to easily find and navigate to the place.

  * The map is generated using the longitude and latitude coordinates extracted from the address provided during place creation.

* Responsive Design:

  * The app is fully responsive, providing a seamless experience on both desktop and mobile devices.

* Backend Features:

  * Secure password encryption using industry-standard practices.

  * JWT tokens are used for authentication and authorization.
  
  * Geolocation data is fetched from Nominatim OpenStreetMap API.
