const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    name:{type:String,required:true,},
    email:{type:String,required:true,unique:true},
city:{type:String,required:true},
password:{type:String,required:true}
})
UserSchema.set("toJSON", {   virtuals: true,   versionKey: false,   transform: function(doc, ret) {     delete ret._id;   } }); 
const Model = mongoose.model('users',UserSchema)
module.exports = Model;