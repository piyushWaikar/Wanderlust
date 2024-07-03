const Listing = require('../models/listing');

module.exports.renderAllListings = async (req, res) => {
    let lists = await Listing.find();
    res.render("listings/index.ejs", { lists });
};


module.exports.showListing = async (req, res) => {
    try {
        let { id } = req.params;
        const list = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        res.render("listings/show.ejs", { list });
    } catch (ExpressError) {
        req.flash("errorMsg", "Listing not found!");
        res.redirect('/listings');
    }
};


module.exports.renderNewListingForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.postNewListingForm = async (req, res) => {  // Add leading slash
    let { title, description, image, price, location, country } = req.body;
    const newList = new Listing({ title, description, image: image.url, price, location, country, owner: req.user });

    await newList.save();
    req.flash("success", "New Listing Created !");
    res.redirect('/listings');  // Redirect to the listings page after creation
};


module.exports.editListingForm = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("errorMsg", "Listing does not Exits !");
        res.redirect('/listings');
    }
    res.render("listings/edit.ejs", { list });
};


module.exports.putEditListingForm = async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body; // Instead of this whole line we can write deconstructor {...req.body}

    await Listing.findByIdAndUpdate(id, { title, description, image: image.url, price, location, country });
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/view/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect(`/listings`);
};
