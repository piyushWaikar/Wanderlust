# Packages used = ejs-mate
# Custom Error handling = wrapAsync , ExpressError.js
# Schema Validator : Joi(npm i joi) = schema.js
# Authentication & Authorization = npm i passport , passport-local , passport-local-mongoose . visit passportjs.org for models and search packages on npm 
# MVC(Model-View-Controller) Framework based Application .
# Multer (npm i multer) : For encoding multipart form body . ie the files or image from form .
# dotenv (npm i dotenv)=>(process.env)has all the secret keys : To use secret / private KEYs into the devleopment process . 


# Hosting process = 
# 1. Mongodb Atlas DB : signup free , for free access of database over the internet . Complete all the setup and then get the connection URL for the DB Connection . 
# 2. Mongodb Session : Setup mongodb session because, in development process we are using express session which stores the session information on the local memory , for production , we need to host the session over the internet . step1: npm i connect-mongo . step2 : use the documentation for basic code and also requrie express session for this process . 
# 3 . Hosting website : Free platform - render, netlify, cyclic, etc . :-
# I. for hosting the application , we have to make changes into our package.json - we have to add the object named as "engine":{node:"18.17.1"} just to define the node version. You can check node version by cli command node -v .
# II. We have to push or whole code on our github account for hosting.