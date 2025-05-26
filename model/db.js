const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres', // Tên user của bạn
  host: 'localhost', // Địa chỉ host, thường là localhost
  database: 'DuAnCaNhan', // Tên database
  password: 'abc123', // Mật khẩu user
  port: 5432, // Cổng mặc định của PostgreSQL
});
module.exports = pool;