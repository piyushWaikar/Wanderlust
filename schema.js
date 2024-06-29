
// Joi custom Schema error handler . To validate the Schema .

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(10).required(),
        image: Joi.string().allow("", null),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().positive().required()
    });


module.exports.reviewSchema = Joi.object({
        comments: Joi.string().min(3).required(),
        rating: Joi.number().integer().min(1).max(5).required()
});