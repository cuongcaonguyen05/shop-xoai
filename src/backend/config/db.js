const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://cuongcaonguyen05:BichNgoc0201@ac-7nj7obm-shard-00-00.p8o7wea.mongodb.net:27017,ac-7nj7obm-shard-00-01.p8o7wea.mongodb.net:27017,ac-7nj7obm-shard-00-02.p8o7wea.mongodb.net:27017/shop-xoai?ssl=true&replicaSet=atlas-107sob-shard-0&authSource=admin&appName=Cluster0';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      family: 4,                        // fix DNS IPv4 trên Windows
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;