const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.
const ExpressError = require('../utils/ExpressError.js'); // Checking for the type of Error.
const listing = require('../models/listing.js');

const { listingSchema, reviewSchema } = require('../schema.js');
const { review } = require('../models/review.js');

//Middlewares
const {validateListing} = require('../middleware/validateListing.js');
const { isLoggedIn } = require('../middleware/isLoggedIn.js');
const { isOwner } = require('../middleware/isOwner.js');



// Index Route, Render all listings
router.get('/', wrapAsync(async (req, res) => {
    let lists = await listing.find();
    res.render("listings/index.ejs", { lists });
}));


// View Route , View specific listing
router.get('/view/:id', wrapAsync(async (req, res) => {
    try {
        let { id } = req.params;
        const list = await listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        res.render("listings/show.ejs", { list });
    } catch (ExpressError) {
        req.flash("errorMsg", "Listing not found!");
        res.redirect('/listings');
    }
}));

// Create new list Route
router.get('/new', isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

router.post('/new', validateListing, isLoggedIn, wrapAsync(async (req, res) => {  // Add leading slash

    let { title, description, image, price, location, country } = req.body;
    const newList = new listing({ title, description, image: image.url, price, location, country, owner: req.user });

    await newList.save();
    req.flash("success", "New Listing Created !");
    res.redirect('/listings');  // Redirect to the listings page after creation

}));

// Update Route

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {

    let { id } = req.params;
    let list = await listing.findById(id);
    if (!list) {
        req.flash("errorMsg", "Listing does not Exits !");
        res.redirect('/listings');
    }
    res.render("listings/edit.ejs", { list });

}));



// Edit Route
router.put('/:id/edit', isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body; // Instead of this whole line we can write deconstructor {...req.body}

    await listing.findByIdAndUpdate(id, { title, description, image: image.url, price, location, country });
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/view/${id}`);
}));


// Delete Route
router.delete('/:id/delete', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect(`/listings`);
}));

module.exports = router;