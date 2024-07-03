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
});

// Setting Session

const sesssionOptions = {
    secret: "mySuperScretString",
    resave: false,
    saveUninitialized: true,
    cookie: { // Life of a cookie 
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days , 24 hours a day , 60 minutes , 60 seconds , 1000 miliseconds a second
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};
const session = require('express-session');
app.use(session(sesssionOptions));

// Setting up passport for Authentication 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
//By default we need session for Authentication on multiple page to use passport after session declaration.
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting up flash for flash message 
const flash = require('connect-flash');
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
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
app.use('/listings', listingRouter)

// Review Router
const reviewRouter = require('./routes/review.js');
app.use('/listings/:id/review', reviewRouter);

// User Router
const userRouter = require('./routes/user.js');
app.use('/user',userRouter);




// If the user pass the route which is not Declared than :-
app.all("*", (req, res, next) => {
    res.redirect('/listings');
    // next(new ExpressError(404, "Page Not Found!"));
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
