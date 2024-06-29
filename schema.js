
// Joi custom Schema error handler . To validate the Schema .

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
        title: Joi.string().required().messages({
                'string.empty': 'Title is required',
                'any.required': 'Title is required'
        }),
        description: Joi.string().required().messages({
                'string.empty': 'Description is required',
                'any.required': 'Description is required'
        }),
        image: Joi.string().allow('').uri().messages({
                'string.uri': 'Image URL must be a valid URI'
        }),
        price: Joi.number().positive().required().messages({
                'number.base': 'Price must be a number',
                'number.positive': 'Price must be a positive number',
                'any.required': 'Price is required'
        }),
        location: Joi.string().required().messages({
                'string.empty': 'Location is required',
                'any.required': 'Location is required'
        }),
        country: Joi.string().required().messages({
                'string.empty': 'Country is required',
                'any.required': 'Country is required'
        }),
        reviews: Joi.array().items(Joi.string().hex().length(24)).messages({
                'string.length': 'Review ID must be a valid ObjectId'
        }).default([])
});



module.exports.reviewSchema = Joi.object({
        comments: Joi.string().min(3).required(),
        rating: Joi.number().integer().min(1).max(5).required()
});