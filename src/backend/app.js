const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/products', require('./routes/product'));

app.listen(5000, () => {
  console.log('🚀 Server chạy tại http://localhost:5000');
});