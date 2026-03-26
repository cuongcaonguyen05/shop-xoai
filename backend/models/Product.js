const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  old_price:   { type: Number, default: null },
  category:    { type: String, default: '' },   // ← thêm dòng này
  image:       { type: String, default: '' },   // ← thêm dòng này
  tag:         { type: String, default: '' },
  rating:      { type: Number, default: 0 },
}, {
  timestamps: true,
  collection: 'productcards'
});

module.exports = mongoose.model('Product', productSchema);