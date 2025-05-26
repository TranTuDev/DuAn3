const express = require('express');
const router = express.Router();
const pool = require('../model/db');
const bcrypt = require('bcrypt');

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check trùng email
        const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) return res.status(400).json({ error: 'Email đã tồn tại' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
            [name, email, hashedPassword, 'user']
        );

        res.json({ message: 'Registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) return res.status(400).json({ error: 'Email không tồn tại' });

        const user = userResult.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Sai mật khẩu' });

        req.session.user = {
            id: user.id,
            name: user.name,
            role: user.role,
        };

        res.json({ message: 'Đăng nhập thành công', role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/index');
    });
});


async function updatePassword(email, plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  await pool.query('UPDATE users SET password=$1 WHERE email=$2', [hashedPassword, email]);
  console.log(`Password updated for ${email}`);
}

updatePassword('a@example.com', 'password123');  // chạy cho từng user
updatePassword('c@example.com', '123456');
updatePassword('b@example.com', 'pass456'); 
updatePassword('d@example.com', 'pwd789');
updatePassword('e@example.com', 'qwerty');

module.exports = router;
