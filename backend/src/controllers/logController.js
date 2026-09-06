const AccessLog = require('../models/AccessLog');

exports.createLog = async (req, res) => {
  try {
    const { userId, locationId, qrResult, facialResult, finalDecision, manualOverride } = req.body;
    const log = await AccessLog.create({
      userId,
      guardId: req.user.id,
      locationId: locationId || 'main_gate',
      qrResult,
      facialResult,
      finalDecision,
      manualOverride: Boolean(manualOverride),
      synchronised: true
    });

    res.status(201).json({ message: 'Access log recorded', log });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
