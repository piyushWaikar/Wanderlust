const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = Schema({
        comments:String,
        rating:{
            type:Number,
            min:1,
            max:5
        },
        createdAt:{
            type:Date,
            default: Date.now()
        }
});

const review = mongoose.model("review",reviewSchema);

module.exports = {review};