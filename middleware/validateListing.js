const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js'); // Checking for the type of Error.

// Defining schema validator as an middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // Validating the schema to check whether the content from body in complete or not .
    if (error) {
        let errMsg = error.details.map(el => el.message).join(","); // Just to separate the message from object using coma
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};