// To check whether the person who is trying to edit the listings is listing owner or not !

const listing = require('../models/listing.js');

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    // Setting up Authorization for editing listing
    let list = await listing.findById(id);
    if(!list.owner.equals(res.locals.user._id)){
        req.flash("error","You don't have permission to edit! ");
        return res.redirect(`/listings/view/${id}`);
    }
    next();
};