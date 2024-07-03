// To check whether the person who is trying to edit the listings is listing owner or not !

const Review = require('../models/review.js');

module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id, Rid } = req.params;
    // Setting up Authorization for editing listing
    let review = await Review.findById(Rid);
    if(!review.author.equals(res.locals.user._id)){
        req.flash("error","You are not the Author of this Review! ");
        return res.redirect(`/listings/view/${id}`);
    }
    next();
};