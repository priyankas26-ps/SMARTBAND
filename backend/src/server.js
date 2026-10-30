import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Reading } from './reading.js';

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
const PORT = process.env.PORT || 5000;
let latest = { heartRate: 86, spo2: 98, temperature: 36.7, battery: 87, recordedAt: new Date() };
let currentLocation = { latitude: 17.348954, longitude: 78.339502, updatedAt: new Date() };
let sosEvents = [];

// Demo sensor simulator. Replace with a real band/Bluetooth or IoT gateway integration when available.
function simulateReading() {
  latest = {
    heartRate: Math.round(82 + Math.random() * 18),
    spo2: Math.round(96 + Math.random() * 3),
    temperature: Number((36.4 + Math.random() * 0.7).toFixed(1)),
    battery: latest.battery,
    recordedAt: new Date()
  };
}
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'KidBand API', bandId: 'KB1024' }));
app.get('/api/readings/latest', (_req, res) => res.json({ ...latest, simulated: true }));
app.get('/api/readings/history', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const rows = await Reading.find().sort({ recordedAt: -1 }).limit(30).lean();
      if (rows.length) return res.json(rows.reverse());
    }
  } catch (e) { console.error('History read:', e.message); }
  res.json(Array.from({ length: 12 }, (_, i) => ({ ...latest, heartRate: 80 + (i % 6) * 3, recordedAt: new Date(Date.now() - (11 - i) * 3600000) })));
});
app.get('/api/location', (_req, res) => res.json(currentLocation));
app.put('/api/location', (req, res) => {
  const { latitude, longitude } = req.body;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return res.status(400).json({ message: 'latitude and longitude must be numbers' });
  currentLocation = { latitude, longitude, updatedAt: new Date() };
  res.json(currentLocation);
});
app.post('/api/sos', (req, res) => {
  const event = { id: Date.now().toString(), childName: req.body.childName || 'Arnav', bandId: 'KB1024', message: 'SOS button pressed on the child band', createdAt: new Date(), status: 'ACTIVE' };
  sosEvents.unshift(event);
  res.status(201).json(event);
});
app.get('/api/sos', (_req, res) => res.json(sosEvents));
app.patch('/api/sos/:id/resolve', (req, res) => {
  const event = sosEvents.find(x => x.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'SOS event not found' });
  event.status = 'RESOLVED'; res.json(event);
});

setInterval(async () => {
  simulateReading();
  if (mongoose.connection.readyState === 1) {
    try { await Reading.create(latest); } catch (e) { console.error('Reading save:', e.message); }
  }
}, 15000);

try {
  if (process.env.MONGODB_URI) await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
} catch (e) { console.warn('MongoDB unavailable; demo runs in memory:', e.message); }
app.listen(PORT, () => console.log(`KidBand API running at http://localhost:${PORT}`));
