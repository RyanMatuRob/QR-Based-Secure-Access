const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guardId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locationId: { type: String, default: 'main_gate' },
  qrResult: { type: String, enum: ['valid', 'expired', 'reused', 'invalid'], required: true },
  facialResult: { type: String, enum: ['match', 'mismatch', 'skipped'], required: true },
  finalDecision: { type: String, enum: ['granted', 'denied'], required: true },
  manualOverride: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  synchronised: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AccessLog', accessLogSchema);
