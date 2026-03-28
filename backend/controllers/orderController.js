const jwt   = require('jsonwebtoken');
const User  = require('../models/User');
const Order = require('../models/Order');

function genTrackingCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const JWT_SECRET = process.env.JWT_SECRET || 'shopmethuysecret2024';

async function getUser(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ message: 'Chưa đăng nhập.' }); return null; }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('phone');
    if (!user) { res.status(404).json({ message: 'Không tìm thấy user.' }); return null; }
    return user;
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ.' });
    return null;
  }
}

// POST /api/orders — tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return;

    const { name, recipientPhone, address, note, payment, items, subtotal, shipping, total } = req.body;
    if (!name || !recipientPhone || !address || !items?.length)
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng.' });

    // Sinh mã vận đơn duy nhất
    let order_id, exists = true;
    while (exists) {
      order_id = genTrackingCode();
      exists = await Order.exists({ order_id });
    }

    const order = await Order.create({
      phone: user.phone,
      name, recipientPhone, address,
      note: note || '',
      payment: payment || 'cod',
      items, subtotal, shipping, total,
      order_id,
    });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/orders — lấy đơn hàng của user (mới nhất trước)
exports.getOrders = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return;
    const orders = await Order.find({ phone: user.phone }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/orders/:id/status — admin cập nhật trạng thái
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Đang xử lý', 'Đang vận chuyển', 'Đã giao hàng', 'Đã hủy đơn'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/orders/all — admin lấy tất cả đơn hàng
exports.getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/orders/:id — lấy chi tiết 1 đơn
exports.getOrder = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return;
    const order = await Order.findOne({ _id: req.params.id, phone: user.phone });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
