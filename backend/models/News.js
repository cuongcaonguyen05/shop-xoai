const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author:  { type: String, default: 'Ẩn danh' },
  content: { type: String, required: true },
}, { timestamps: true });

const newsSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  author:   { type: String, default: '' },
  category: { type: String, enum: ['info', 'recipe'], default: 'info' },
  content:  { type: String, default: '' },
  comments: { type: [commentSchema], default: [] },
}, {
  timestamps: true,
  collection: 'news'
});

module.exports = mongoose.model('News', newsSchema);
