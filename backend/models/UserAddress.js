const mongoose = require('mongoose');

const userAddressSchema = new mongoose.Schema({
  phone:      { type: String, required: true, index: true }, // phone của user (FK)
  name:       { type: String, required: true },              // tên người nhận
  recipientPhone: { type: String, required: true },          // SĐT người nhận (có thể khác SĐT tài khoản)
  address:    { type: String, required: true },              // địa chỉ đầy đủ
  ward:       { type: String, default: '' },                 // phường/xã
  province:   { type: String, default: '' },                 // tỉnh/thành
  isDefault:  { type: Boolean, default: false },
}, { timestamps: true, collection: 'user_addresses' });

module.exports = mongoose.model('UserAddress', userAddressSchema);
