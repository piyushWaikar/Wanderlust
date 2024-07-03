const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams = Necessary*** . when we have half url in app.js and half in reveiw.js what happens is that the value of :id from app.js does'nt come here , to bring that :id value we use this parameter .
const wrapAsync = require('../utils/wrapAsync.js') // We should have to wrap all the functions into wrapAsync . Instead of try and catch.
const ExpressError = require('../utils/ExpressError.js'); // Checking for the type of Error.
const { User } = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware/isLoggedIn.js');

// User Creation
router.get('/signup', (req, res) => {
    res.render('user/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let newUser = await new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        // To insert the functionality of login automatically when user is signedUp.
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            } else {
                req.flash("success", "Welcome to WanderLust !");
                res.redirect('/listings');
            }
        })
    } catch (err) {
        req.flash("errorMsg", "User already exists !");
        res.redirect('/user/signup');
    };
}));

// User login
router.get('/login', (req, res) => {
    res.render("user/login.ejs");
});

// Password have the middleware authentication , that will authenticate user automatically .
router.post('/login',saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash("success", "Login Successfully");
    res.redirect(res.locals.redirectUrl);
}));

// logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You Logged out");
        res.redirect('/listings');
    })
});


module.exports = router;