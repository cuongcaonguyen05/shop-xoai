const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/products',  require('./routes/product'));
app.use('/api/news',      require('./routes/news'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/addresses', require('./routes/address'));
app.use('/api/orders',    require('./routes/order'));

// Xóa các index cũ không hợp lệ
const User  = require('./models/User');
const Order = require('./models/Order');
User.collection.dropIndex('email_1').catch(() => {});
Order.collection.dropIndex('trackingCode_1').catch(() => {});

app.listen(5000, () => {
  console.log('🚀 Server chạy tại http://localhost:5000');
});