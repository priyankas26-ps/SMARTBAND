import mongoose from 'mongoose';
const readingSchema = new mongoose.Schema({
  heartRate: Number, spo2: Number, temperature: Number, battery: Number,
  recordedAt: { type: Date, default: Date.now }
});
export const Reading = mongoose.models.Reading || mongoose.model('Reading', readingSchema);
