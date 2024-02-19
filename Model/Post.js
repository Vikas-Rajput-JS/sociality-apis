const mongoose = require('mongoose')
const PostSchema = mongoose.Schema({
    name:{type:String,required:true,},
    image:{type:String,required:true,unique:true},
caption:{type:String,required:true},
isLike:{type:Boolean,default:false},
addedBy:{type:mongoose.Schema.Types.ObjectId,ref:'users',required:true},
createdAt:{type:Date,default:Date.now},

})
PostSchema.set("toJSON", {   virtuals: true,   versionKey: false,   transform: function(doc, ret) {     delete ret._id;   } }); 
const Model = mongoose.model('posts',PostSchema)
module.exports = Model;