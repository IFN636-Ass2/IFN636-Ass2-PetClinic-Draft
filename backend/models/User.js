
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    position: { type: String },
    address: { type: String },
    role: { type: String, enum: ['admin', 'staff'], default: 'staff' }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
