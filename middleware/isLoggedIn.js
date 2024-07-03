module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // When the user is tyring to edit/delete/create listing on a page but user is not logged in , after loggedIn he/she should has to be redirected where he/she was ie.edit/delete/create listing page 
        req.session.redirectUrl = req.originalUrl; // we created new session named redirectUrl and send the past url from req.object (console.log(req)).
        req.flash("error", "You must be loggedIn !")
        return res.redirect('/user/login');
    };
    next();
};

// BY convention when the user login the old session deleted and new session gets created . so we need to save that into local memory thay why we created this function , and we pass this function as an middleware where we want to use past url 
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};