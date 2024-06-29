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

// Joi custom Schema validator for listing Schema model
const { listingSchema } = require('./schema.js');

// Defining schema validator as an middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // Validating the schema to check whether the content from body in complete or not .
    if (error) {
        let errMsg = error.details.map(el => el.message).join(","); // Just to separate the message from object using coma
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const listing = require('./models/listing');

// Define behavior for the root route
app.get('/', (req, res) => {
    res.send("Welcome to Wanderlust Listings");
});

// Index Route
app.get('/listings', wrapAsync(async (req, res) => {
    let lists = await listing.find();
    res.render("listings/index.ejs", { lists });
}));

const { review } = require('./models/review.js');

// View Route
app.get('/listings/view/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate("reviews");

    let reviews = list.reviews;

    res.render("listings/show.ejs", { list, reviews });
}));

// Create new list Route
app.get('/listings/new', (req, res) => {
    res.render("listings/new.ejs");
});

app.post('/listings/new', validateListing, wrapAsync(async (req, res) => {  // Add leading slash

    let { title, description, image, price, location, country } = req.body;
    // try {
    const newList = new listing({ title, description, image: image.url, price, location, country });
    await newList.save();
    res.redirect('/listings');  // Redirect to the listings page after creation
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send("Error creating new listing");
    // }
}));

// Update Route

app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    // try {

    let { id } = req.params;
    let list = await listing.findById(id);
    res.render("listings/edit.ejs", { list });
    // } catch (err) {
    //     console.log(err.message);
    // }
}));

const methodOverrde = require('method-override');
app.use(methodOverrde("_method"));

// Edit Route
app.put('/listings/:id/edit', validateListing, wrapAsync(async (req, res) => {
    // try{
    let { id } = req.params;
    // let { title, description, image, price, location, country } = req.body; // Instead of this whole line we can write deconstructor {...req.body}
    await listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/view/${id}`);
    // }catch(err){
    //     console.log(err.message);
    // }
}));


// Delete Route
app.delete('/listings/:id/delete', wrapAsync(async (req, res) => {
    // try {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
    // } catch (err) {
    //     console.log(err.message);
    // }
}));


//Review Section 

// Joi custom Schema validator for rating Schema 
const { reviewSchema } = require('./schema.js');

// Defining schema validator as an middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // Validating the schema to check whether the content from body in complete or not .
    if (error) {
        let errMsg = error.details.map(el => el.message).join(","); // Just to separate the message from object using coma
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Creating review
app.post('/listings/:id/review', validateReview, wrapAsync(async (req, res) => {
    const list = await listing.findById(req.params.id);
    let { comments, rating } = req.body;

    let createReview = new review({
        comments,
        rating
    });
    await createReview.save();

    list.reviews.push(createReview._id);

    await list.save();

    res.redirect(`/listings/view/${req.params.id}`);
}));

// Deleting Review
app.delete('/listings/:id/review/:Rid',wrapAsync(async(req,res)=>{
    let {id, Rid} = req.params;

    await listing.findByIdAndUpdate(id, {$pull:{reviews: Rid}});
    await review.findByIdAndDelete(Rid);

    res.redirect(`/listings/view/${req.params.id}`);
}));



















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
