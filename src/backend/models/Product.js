const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  description:  { type: String },
  price:        { type: Number, required: true },
  old_price:    { type: Number, default: null },
}, {
  timestamps: true,
  collection: 'productcards'  // ← khớp đúng tên collection trên Atlas
});

module.exports = mongoose.model('Product', productSchema);