const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  old_price: { type: Number, default: null },
  image:     { type: String, default: '' },
  qty:       { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  phone:     { type: String, required: true, index: true }, // FK → users.phone
  name:      { type: String, required: true },              // tên người nhận
  recipientPhone: { type: String, required: true },         // SĐT người nhận
  address:   { type: String, required: true },              // địa chỉ giao hàng
  note:      { type: String, default: '' },
  payment:   { type: String, enum: ['cod', 'bank', 'momo'], default: 'cod' },
  items:     [orderItemSchema],
  subtotal:  { type: Number, required: true },
  shipping:  { type: Number, default: 0 },
  total:     { type: Number, required: true },
  order_id: { type: String, unique: true, sparse: true },
  status:    { type: String, enum: ['Đang xử lý', 'Đang vận chuyển', 'Đã giao hàng', 'Đã hủy đơn'], default: 'Đang xử lý' },
}, { timestamps: true, collection: 'orders' });

module.exports = mongoose.model('Order', orderSchema);
