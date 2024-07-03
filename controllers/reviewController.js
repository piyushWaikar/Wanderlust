const Review = require('../models/review.js');
const Listing = require('../models/listing');


module.exports.postReviewForm = async (req, res) => {
    const list = await Listing.findById(req.params.id);
    let { comments, rating } = req.body;

    let createReview = new Review({
        comments,
        rating,
        author: req.user._id
    });
    await createReview.save();

    list.reviews.push(createReview._id);

    await list.save();

    req.flash("success", "New Review Posted !");

    res.redirect(`/listings/view/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, Rid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: Rid } });
    await Review.findByIdAndDelete(Rid);

    req.flash("success", "Review Deleted !");

    res.redirect(`/listings/view/${req.params.id}`);
};