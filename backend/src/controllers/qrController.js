const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const QRSession = require('../models/QRSession');
const User = require('../models/User');

exports.generateQR = async (req, res) => {
  try {
    const userId = req.user.id;
    const tokenId = crypto.randomUUID();
    const expiryMinutes = parseInt(process.env.QR_EXPIRY_MINUTES) || 15;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await QRSession.create({ tokenId, userId, expiresAt });

    const qrPayload = { tokenId, userId, expiresAt };
    const qrSignature = jwt.sign(qrPayload, process.env.JWT_SECRET, { expiresIn: `${expiryMinutes}m` });

    res.status(201).json({ qrToken: qrSignature, expiresAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyQR = async (req, res) => {
  try {
    const { qrToken } = req.body;
    if (!qrToken) return res.status(400).json({ status: 'invalid', message: 'Token missing' });

    let decoded;
    try {
      decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ status: 'expired', message: 'QR token has expired' });
    }

    const session = await QRSession.findOne({ tokenId: decoded.tokenId });
    if (!session) return res.status(404).json({ status: 'invalid', message: 'Session not found' });
    if (session.used) return res.status(400).json({ status: 'reused', message: 'Token already used' });
    if (session.revoked) return res.status(403).json({ status: 'revoked', message: 'Session revoked' });

    // Mark as used upon first scan attempt to prevent reuse
    session.used = true;
    await session.save();

    const user = await User.findById(decoded.userId).select('name role facialEmbedding accountStatus');
    if (!user || user.accountStatus !== 'active') {
      return res.status(403).json({ status: 'inactive', message: 'User inactive or revoked' });
    }

    res.status(200).json({
      status: 'valid',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        facialEmbedding: user.facialEmbedding
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
