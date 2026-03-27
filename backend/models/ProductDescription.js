const mongoose = require('mongoose');

const productDescriptionSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  desc:       { type: String, default: '' },
  img:        { type: String, default: '' },
}, {
  timestamps: true,
  collection: 'productdescriptions'
});

module.exports = mongoose.model('ProductDescription', productDescriptionSchema);
