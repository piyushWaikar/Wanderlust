const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.
const ExpressError = require('../utils/ExpressError.js'); // Checking for the type of Error.
const listing = require('../models/listing.js');

const { listingSchema, reviewSchema } = require('../schema.js');
const { review } = require('../models/review.js');

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

// Index Route
router.get('/', wrapAsync(async (req, res) => {
    let lists = await listing.find();
    res.render("listings/index.ejs", { lists });
}));


// View Route
router.get('/view/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate("reviews");

    let reviews = list.reviews;

    res.render("listings/show.ejs", { list, reviews });
}));

// Create new list Route
router.get('/new', (req, res) => {
    res.render("listings/new.ejs");
});

router.post('/new', validateListing, wrapAsync(async (req, res) => {  // Add leading slash

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

router.get('/:id/edit', wrapAsync(async (req, res) => {
    // try {

    let { id } = req.params;
    let list = await listing.findById(id);
    res.render("listings/edit.ejs", { list });
    // } catch (err) {
    //     console.log(err.message);
    // }
}));



// Edit Route
router.put('/:id/edit', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body; // Instead of this whole line we can write deconstructor {...req.body}
    await listing.findByIdAndUpdate(id, { title, description, image:image.url, price, location, country });
    res.redirect(`/listings/view/${id}`);
}));


// Delete Route
router.delete('/:id/delete', wrapAsync(async (req, res) => {
    // try {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
    // } catch (err) {
    //     console.log(err.message);
    // }
}));

module.exports = router;