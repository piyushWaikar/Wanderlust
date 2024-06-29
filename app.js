const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// For using ejs-mate. This is used to extract header and footer part from each page and store it in one place . 
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

// Use middlewares correctly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// Setting custom error handler as an middleware to all paths
app.use((err, req, res, next) => {
    console.log(err.message);
    next(err); // passing control to express default error handling middleware
})

// Requiring custom error handler function for Async operations.
const wrapAsync = require('./utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.
const ExpressError = require('./utils/ExpressError.js'); // Checking for the type of Error.

main()
    .then((res) => {
        console.log("Connection Successful");
    })
    .catch((err) => { console.log(err.message); });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// To use put,Delete, PATCH methods
const methodOverrde = require('method-override');
app.use(methodOverrde("_method"));




// Routes Starts from Here 

// Define behavior for the root route
app.get('/', (req, res) => {
    res.send("Welcome to Wanderlust Listings");
});

// Listings Router
const listingRouter = require('./routes/listings.js');
app.use('/listings',listingRouter)

// Review Router
const reviewRouter = require('./routes/review.js');
app.use('/listings/:id/review',reviewRouter);






















// If the user pass the route which is not Declared than :-
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Defining custom middleware error handler for all routes
app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Something went Wrong !" } = err; // Setting default values for status and message .
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);

});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
