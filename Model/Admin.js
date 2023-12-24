
const mongoose = require('mongoose')
const AdminSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    city: { type: String, default: "Hisar" },
    password: { type: String, required: true },
    mobile: { type: Number },
    bio: { type: String },
    username: { type: String },
    image: { type: String },
})


const Model = mongoose.model('admins',AdminSchema)

module.exports = Model;