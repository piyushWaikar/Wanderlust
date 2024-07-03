const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.


//Middlewares
const { validateListing } = require('../middleware/validateListing.js');
const { isLoggedIn } = require('../middleware/isLoggedIn.js');
const { isOwner } = require('../middleware/isOwner.js');

// Controllers
const listingControllers = require('../controllers/listingController.js');

// Index Route, Render all listings
router.get('/', wrapAsync(listingControllers.renderAllListings));


// View Route , View specific listing
router.get('/view/:id', wrapAsync(listingControllers.showListing));


// router.get('/new', isLoggedIn, listingControllers.renderNewListingForm);

// router.post('/new', validateListing, isLoggedIn, wrapAsync(listingControllers.postNewListingForm));

// combining same routes ('/new')
router.route('/new')
    // Create new list Route render
    .get(isLoggedIn, listingControllers.renderNewListingForm)
    // New listing post
    .post(validateListing, isLoggedIn, wrapAsync(listingControllers.postNewListingForm));



// combinig same req route ('/:id/edit');
router.route('/:id/edit')
    // Edit Route render
    .get(isLoggedIn, isOwner, wrapAsync(listingControllers.editListingForm))
    // Edit Route put
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingControllers.putEditListingForm));
    

// Delete Route
router.delete('/:id/delete', isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));


module.exports = router;