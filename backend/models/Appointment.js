const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  date: { type: Date, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Appointment', appointmentSchema);