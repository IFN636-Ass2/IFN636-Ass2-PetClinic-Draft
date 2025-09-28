const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true, index: true },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  vet: { type: String, required: true },
  date: { type: Date, required: true, index: true },
  description: { type: String, required: true },
  treatmentCost: { type: Number, min: 0 },
  medicineCost: { type: Number, default: 0, min: 0 },
  totalCost: { type: Number, min: 0 },
  paymentMethod: { type: String, enum: ['Cash', 'Credit Card', 'Apple Pay'] },
  paymentFee: { type: Number, default: 0, min: 0 }
},
  { timestamps: true });

treatmentSchema.index({ petId: 1, date: -1 });

module.exports = mongoose.model("Treatment", treatmentSchema);
