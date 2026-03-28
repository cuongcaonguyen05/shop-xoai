const Product = require('../models/Product');
const ProductDescription = require('../models/ProductDescription');
const crypto  = require('crypto');

const genProductId = (name) => {
  const raw = `${name.trim().toLowerCase()}_${Date.now()}`;
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 12).toUpperCase();
};

exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductDescription = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('product_id');
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    const desc = await ProductDescription.findOne({ product_id: product.product_id });
    res.json(desc || { desc: '', img: '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(product);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'ID không hợp lệ' });
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { description, image, ...rest } = req.body;
    const product_id = genProductId(rest.name || '');
    const product = new Product({ ...rest, product_id });
    await product.save();

    await ProductDescription.create({
      product_id,
      desc: description || '',
      img:  image       || '',
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { product_id, description, image, ...updateData } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id, updateData, { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Không tìm thấy' });

    // Cập nhật productdescriptions nếu có thay đổi
    if (description !== undefined || image !== undefined) {
      await ProductDescription.findOneAndUpdate(
        { product_id: product.product_id },
        { ...(description !== undefined && { desc: description }),
          ...(image       !== undefined && { img:  image       }) },
        { upsert: true }
      );
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy' });
    await ProductDescription.deleteOne({ product_id: product.product_id });
    res.json({ message: 'Đã xóa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
