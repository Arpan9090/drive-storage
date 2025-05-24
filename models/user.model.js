const mongoose = require("mongoose")

const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength: [3, 'Username must be 3 letters long']
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength: [10, 'Invalid Email']
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: [5, 'Password must be 5 characters long']
    }
})

const user = mongoose.model('user', userSchema)

module.exports = user