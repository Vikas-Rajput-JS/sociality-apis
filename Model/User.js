const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: { type: String, default: "Hisar" },
  password: { type: String, required: true },
  mobile: { type: Number },
  bio: { type: String },
  username: { type: String },
  image: { type: String },
  bannerImage:{type:String},
  followers:[{type:mongoose.Schema.Types.ObjectId,ref:'users'}],
followings:[{type:mongoose.Schema.Types.ObjectId,ref:'users'}]
});
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
UserSchema.index({ followers: 1 }, { unique: true });
UserSchema.index({ followings: 1 }, { unique: true });
const Model = mongoose.model("users", UserSchema);
module.exports = Model;
