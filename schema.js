
// Joi custom Schema error handler . To validate the Schema .

const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        image: joi.string().allow("", null),
        decription: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().min(100).required(),
    }).required()
});