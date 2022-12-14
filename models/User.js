const mongoose = require('mongoose')
//create user schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    score:{
        type: Number,
        default:0
    }
})

const User = mongoose.model('User',userSchema)

//export user model
module.exports = User