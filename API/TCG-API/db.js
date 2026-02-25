// db.js
const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',     // để '' nếu không có password
  password: '',     // bỏ trống nếu root không có mật khẩu
  database: 'tcgear'
};

// hàm kết nối
async function connectDb() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Kết nối thành công MySQL');
    return connection;
  } catch (err) {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
    throw err;
  }
}

module.exports = connectDb;
