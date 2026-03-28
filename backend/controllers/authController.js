const jwt    = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User   = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'shopmethuysecret2024';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

const userPayload = (user) => ({
  id:     user._id,
  name:   user.name,
  email:  user.email,
  avatar: user.avatar,
  role:   user.role,
});

// ── Đăng ký số điện thoại/password ──
exports.register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password)
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    if (!/^(0|\+84)\d{9,10}$/.test(phone))
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Mật khẩu ít nhất 6 ký tự.' });

    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'Số điện thoại đã được sử dụng.' });

    const user = await User.create({ name, phone, password, provider: 'local' });
    res.status(201).json({ token: signToken(user), user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Đăng nhập số điện thoại/password ──
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ message: 'Vui lòng nhập số điện thoại và mật khẩu.' });

    const user = await User.findOne({ phone });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không đúng.' });

    res.json({ token: signToken(user), user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Google OAuth ──
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken:  credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const { sub, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, avatar: picture, provider: 'google', providerId: sub });
    } else if (user.provider !== 'google') {
      // Email đã tồn tại với provider khác — cập nhật avatar
      user.avatar = user.avatar || picture;
      await user.save();
    }

    res.json({ token: signToken(user), user: userPayload(user) });
  } catch (err) {
    res.status(401).json({ message: 'Xác thực Google thất bại: ' + err.message });
  }
};

// ── Google (access_token flow từ useGoogleLogin) ──
exports.googleTokenLogin = async (req, res) => {
  try {
    const { access_token, userInfo } = req.body;
    // Verify access_token bằng cách gọi Google userinfo
    const gRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!gRes.ok) return res.status(401).json({ message: 'Token Google không hợp lệ.' });
    const info = await gRes.json();

    const email  = info.email;
    const name   = info.name   || userInfo?.name || 'Google User';
    const avatar = info.picture || '';
    const sub    = info.sub;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, avatar, provider: 'google', providerId: sub });
    } else {
      if (!user.avatar) { user.avatar = avatar; await user.save(); }
    }
    res.json({ token: signToken(user), user: userPayload(user) });
  } catch (err) {
    res.status(401).json({ message: 'Xác thực Google thất bại: ' + err.message });
  }
};

// ── Facebook OAuth ──
exports.facebookLogin = async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    // Verify với Facebook Graph API
    const fbRes = await fetch(
      `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`
    );
    if (!fbRes.ok) return res.status(401).json({ message: 'Xác thực Facebook thất bại.' });
    const fbData = await fbRes.json();
    if (fbData.id !== userID) return res.status(401).json({ message: 'Token Facebook không hợp lệ.' });

    const email    = fbData.email || `fb_${userID}@facebook.com`;
    const name     = fbData.name;
    const avatar   = fbData.picture?.data?.url || '';

    let user = await User.findOne({ $or: [{ providerId: userID, provider: 'facebook' }, { email }] });
    if (!user) {
      user = await User.create({ name, email, avatar, provider: 'facebook', providerId: userID });
    } else {
      user.avatar = user.avatar || avatar;
      await user.save();
    }

    res.json({ token: signToken(user), user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Lấy thông tin user hiện tại (từ token) ──
exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Chưa đăng nhập.' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user.' });
    res.json(userPayload(user));
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ.' });
  }
};
