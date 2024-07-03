const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams = Necessary*** . when we have half url in app.js and half in reveiw.js what happens is that the value of :id from app.js does'nt come here , to bring that :id value we use this parameter .
const wrapAsync = require('../utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.
const ExpressError = require('../utils/ExpressError.js'); // Checking for the type of Error.

const { listingSchema, reviewSchema } = require('../schema.js');

const listing = require('../models/listing.js');
const { review } = require('../models/review.js');

const { validateReview } = require('../middleware/validateReviews.js');

const {isLoggedIn} = require('../middleware/isLoggedIn.js');
const { isReviewAuthor } = require('../middleware/isReviewAuthor.js');



// Creating review
router.post('/',isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const list = await listing.findById(req.params.id);
    let { comments, rating } = req.body;

    let createReview = new review({
        comments,
        rating,
        author:req.user._id
    });
    await createReview.save();

    list.reviews.push(createReview._id);

    await list.save();

    req.flash("success", "New Review Posted !");

    res.redirect(`/listings/view/${req.params.id}`);
}));

// Deleting Review
router.delete('/:Rid',isLoggedIn , isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, Rid } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { reviews: Rid } });
    await review.findByIdAndDelete(Rid);

    req.flash("success", "Review Deleted !");

    res.redirect(`/listings/view/${req.params.id}`);
}));

module.exports = router;