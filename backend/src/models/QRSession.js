const mongoose = require('mongoose');

const qrSessionSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('QRSession', qrSessionSchema);