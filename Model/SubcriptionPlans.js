const mongoose = require('mongoose')

const PlanSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date},
    price:{type:Number,required:true}

})

PlanSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const Model = mongoose.model('plans',PlanSchema)

module.exports = Model;