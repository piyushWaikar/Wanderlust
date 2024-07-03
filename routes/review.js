const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams = Necessary*** . when we have half url in app.js and half in reveiw.js what happens is that the value of :id from app.js does'nt come here , to bring that :id value we use this parameter .
const wrapAsync = require('../utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.


//Middleware
const { validateReview } = require('../middleware/validateReviews.js');
const {isLoggedIn} = require('../middleware/isLoggedIn.js');
const { isReviewAuthor } = require('../middleware/isReviewAuthor.js');

//Controller
const reviewController = require('../controllers/reviewController.js');


// Creating review
router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.postReviewForm));


// Deleting Review
router.delete('/:Rid',isLoggedIn , isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;