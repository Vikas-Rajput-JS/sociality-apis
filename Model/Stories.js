const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  title: { type: String },
  video: { type: String },
  image: { type: String },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,unque:true
  },
  createdAt: { type: Date, default: Date.now,expires:'1440m'}
});

const Model = mongoose.model("stories", Schema);
module.exports = Model;
