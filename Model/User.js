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

});
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Model = mongoose.model("users", UserSchema);
module.exports = Model;
