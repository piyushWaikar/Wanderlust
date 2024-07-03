    const mongoose = require('mongoose');
    
    main()
    .then((res) => {
        console.log("Connection Successful");
    })
    .catch((err) => { console.log(err.message); });
    async function main() {
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    }



    const listing = require('../models/listing')
    const sampleData = require('./data');
    
    const pushSampleData = async()=>{
        await listing.deleteMany({}); // Clearing Database if needed
        sampleData.data = sampleData.data.map((obj)=>({...obj,owner:'6682b1473a43c7f164998cc6'})) // singup as a user and taken the obj id and put manually here
        await listing.insertMany(sampleData.data);
        console.log("Data was re-initialized");
    };
    
    pushSampleData();


 // To push data in DB       1. cd init        2.node index.js      3. cd ..