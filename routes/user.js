const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams = Necessary*** . when we have half url in app.js and half in reveiw.js what happens is that the value of :id from app.js does'nt come here , to bring that :id value we use this parameter .
const wrapAsync = require('../utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.
const ExpressError = require('../utils/ExpressError.js'); // Checking for the type of Error.
const User = require('../models/user.js');
const passport = require('passport');

// Middleware
const { saveRedirectUrl } = require('../middleware/isLoggedIn.js');

// Controller
const userController = require('../controllers/userController.js');


// router.get('/signup', userController.renderSignupForm);

// router.post('/signup', wrapAsync(userController.postSignupForm));

// User Creation
router.route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.postSignupForm));

// User login
router.get('/login', userController.renderLoginForm);

// Password have the middleware authentication , that will authenticate user automatically .
router.post('/login', saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), wrapAsync(userController.postLoginForm));

// logout
router.get('/logout', userController.logoutUser);


module.exports = router;