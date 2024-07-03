const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// We are selected the passportLocalMongoose which have the model of username and password . so by default we are having username and password present inside this model so we do not have to delcare explicitly.
// visit npm i passport-local-mongoose for more info 
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = { User }; 