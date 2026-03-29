const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id:  { type: String, unique: true, immutable: true },
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  old_price:   { type: Number, default: null },
  image:       { type: String, default: '' },
  category:    { type: String, default: '' },
  tag:          { type: String, default: '' },
  rating:       { type: Number, default: 0 },
  brand:        { type: String, default: '' },
  like:         { type: Number, default: 0 },
  product_code: { type: String, default: '' },
}, {
  timestamps: true,
  collection: 'productcards'
});

module.exports = mongoose.model('Product', productSchema);