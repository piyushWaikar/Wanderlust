const express = require('express');
const router = express.Router({mergeParams:true}); // mergeParams = Necessary*** . when we have half url in app.js and half in reveiw.js what happens is that the value of :id from app.js does'nt come here , to bring that :id value we use this parameter .
const wrapAsync = require('../utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.
const ExpressError = require('../utils/ExpressError.js'); // Checking for the type of Error.

const { listingSchema, reviewSchema } = require('../schema.js');

const listing = require('../models/listing.js');
const { review } = require('../models/review.js');

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
router.post('/', validateReview, wrapAsync(async (req, res) => {
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
router.delete('/:Rid',wrapAsync(async(req,res)=>{
    let {id, Rid} = req.params;

    await listing.findByIdAndUpdate(id, {$pull:{reviews: Rid}});
    await review.findByIdAndDelete(Rid);

    res.redirect(`/listings/view/${req.params.id}`);
}));

module.exports = router;