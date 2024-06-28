try {
    const mongoose = require('mongoose');
    
    main()
    .then((res) => {
        console.log("Connection Successful");
    })
    .catch((err) => { console.log(err.message); });
    async function main() {
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    }
} catch(err){
    console.log(err.message);
}

try {

    const listing = require('../models/listing')
    const sampleData = require('./data');
    
    const pushSampleData = async()=>{
        await listing.deleteMany({}); // Clearing Database if needed
        await listing.insertMany(sampleData.data);
    };
    
    pushSampleData();
}catch(err){
    console.log(err.message);
}

 // To push data in DB       1. cd init        2.node index.js      3. cd ..