const mongoose = require("mongoose")

function connnectToDB(){
    mongoose.connect(process.env.MONGO_URI).then( () => {
        console.log("connected to db");
        
    })
}

module.exports = connnectToDB