const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    age: { type: Number },
    // gender: { type: String, enum: ["Female", "Male"] },
    species: { type: String , required: true},
    breed: { type: String },
    owner: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String }}
});

module.exports = mongoose.model('Pet', petSchema);
