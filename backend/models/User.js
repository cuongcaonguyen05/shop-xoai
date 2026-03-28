const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  phone:      { type: String, default: null, sparse: true },
  email:      { type: String, default: null, lowercase: true, sparse: true },
  password:   { type: String, default: null },
  avatar:     { type: String, default: '' },
  provider:   { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  providerId: { type: String, default: null },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true, collection: 'users' });

// Hash password trước khi lưu
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password || '');
};

module.exports = mongoose.model('User', userSchema);
