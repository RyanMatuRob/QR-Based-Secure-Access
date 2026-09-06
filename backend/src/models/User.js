const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['regular', 'visitor', 'guard', 'admin'], 
    default: 'regular' 
  },
  facialEmbedding: { type: [Number], default: [] },
  accountStatus: { 
    type: String, 
    enum: ['active', 'revoked', 'pending'], 
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);