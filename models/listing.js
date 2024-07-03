const {review} = require('./review');
const {User} = require('./user.js')
try {
    const mongoose = require('mongoose');
    let imgLink = "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60";
    const listingSchema = mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            filename: {
                type: String,
                default: "listingimage"
            },
            url: {
                type: String,
                default: imgLink, // Set default image link
                set: (v) => v === "" ? imgLink : v, //Check for the empty link. If user does'nt upload the image / or at the moment dont want to upload the image than there can be default image set by us .
            }
        },
        price: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "review"
            }
        ],
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    });

    // Middleware to handle deletion
    // This is order deletion function - findOneAndDelete in a sub function of findByIdAndDelete so when we delete customer using findByIdAndDelete the customer object get pass into findOneAndDelete .
    listingSchema.post('findOneAndDelete', async function (list) {
        if (list.reviews.length) {
            let res = await mongoose.model("review").deleteMany({ _id: { $in: list.reviews } });
            console.log(res);
        }
    });

    const Listing = mongoose.model("Listing", listingSchema);

    module.exports = Listing;

} catch (err) {
    console.log(err.message);
}