const User = require('../models/user.js');
const passport = require('passport');


module.exports.renderSignupForm = (req, res) => {
    res.render('user/signup.ejs');
};

module.exports.postSignupForm = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.postLoginForm = async (req, res) => {
    req.flash("success", "Login Successfully");
    res.redirect(res.locals.redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You Logged out");
        res.redirect('/listings');
    })
};