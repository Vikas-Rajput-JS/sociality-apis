const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    email:{
type:String,
required:true
    },
    otp:{
        type:String,
        required:true,
       

    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*1,
    }   
})

const OtpModel = mongoose.model('otp',Schema)

module.exports=OtpModel;