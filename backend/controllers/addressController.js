const jwt         = require('jsonwebtoken');
const User        = require('../models/User');
const UserAddress = require('../models/UserAddress');

const JWT_SECRET = process.env.JWT_SECRET || 'shopmethuysecret2024';

// Middleware: lấy user từ token
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

// GET /api/addresses — lấy tất cả địa chỉ của user
exports.getAddresses = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return;
    const list = await UserAddress.find({ phone: user.phone }).sort({ isDefault: -1, createdAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/addresses — thêm địa chỉ mới
exports.addAddress = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return;
    const { name, recipientPhone, address, province, ward, isDefault } = req.body;
    if (!name || !recipientPhone || !address)
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });

    // Nếu set mặc định → bỏ default các địa chỉ cũ
    if (isDefault) await UserAddress.updateMany({ phone: user.phone }, { isDefault: false });

    const doc = await UserAddress.create({
      phone: user.phone, name, recipientPhone, address,
      province: province || '', ward: ward || '',
      isDefault: !!isDefault,
    });
    res.status(201).json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/addresses/:id — cập nhật địa chỉ
exports.updateAddress = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return;
    const doc = await UserAddress.findOne({ _id: req.params.id, phone: user.phone });
    if (!doc) return res.status(404).json({ message: 'Không tìm thấy địa chỉ.' });

    const { name, recipientPhone, address, province, ward, isDefault } = req.body;
    if (isDefault) await UserAddress.updateMany({ phone: user.phone }, { isDefault: false });

    doc.name           = name           ?? doc.name;
    doc.recipientPhone = recipientPhone ?? doc.recipientPhone;
    doc.address        = address        ?? doc.address;
    doc.province       = province       ?? doc.province;
    doc.ward           = ward           ?? doc.ward;
    doc.isDefault      = isDefault !== undefined ? !!isDefault : doc.isDefault;
    await doc.save();
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/addresses/:id — xóa địa chỉ
exports.deleteAddress = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return;
    await UserAddress.deleteOne({ _id: req.params.id, phone: user.phone });
    res.json({ message: 'Đã xóa.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/addresses/:id/default — đặt làm mặc định
exports.setDefault = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return;
    await UserAddress.updateMany({ phone: user.phone }, { isDefault: false });
    const doc = await UserAddress.findOneAndUpdate(
      { _id: req.params.id, phone: user.phone },
      { isDefault: true },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Không tìm thấy địa chỉ.' });
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
