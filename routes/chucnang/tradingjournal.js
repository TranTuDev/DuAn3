const express = require('express');
const router = express.Router();
const pool = require('../../model/db');
const { ensureAuth } = require('../authMiddleware');
// ở đây root path là /users/trade do đã mount ở index.js



// GET tất cả nhật ký giao dịch của user
router.get('/', ensureAuth, async (req, res) => {
  const { search, result } = req.query;
  let query = 'SELECT * FROM diary WHERE user_id = $1';
  let params = [req.session.user.id];

  if (search) {
    query += ' AND LOWER(cap_trade) LIKE $2';
    params.push(`%${search.toLowerCase()}%`);
  }

  if (result) {
    query += ` AND LOWER(ket_qua) = $${params.length + 1}`;
    params.push(result.toLowerCase());
  }

  query += ' ORDER BY date_trade DESC';

  try {
    const { rows } = await pool.query(query, params);
    res.render('tradingjournal', { trades: rows, user: req.session.user, search, result });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});



// POST thêm giao dịch mới
// 📌 Tạo mã lệnh tự động theo thời gian, ví dụ: LENH_20250525153012
function generateMaLenh() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const code = `LENH_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
  return code;
}

router.post('/', ensureAuth, async (req, res) => {
  const {
    cap_trade,
    chieu_lenh,
    vao_entry,
    dat_tp,
    dinh_sl,
    tien_volum,
    date_trade,
    ket_qua,
    ghi_chu
  } = req.body;

  const dateValue = date_trade && date_trade.trim() !== '' ? date_trade : null;
  const ma_lenh = generateMaLenh(dateValue); // ✅

  try {
    await pool.query(
      `INSERT INTO diary (ma_lenh, cap_trade, chieu_lenh, vao_entry, dat_tp, dinh_sl, tien_volum, date_trade, ket_qua, ghi_chu, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [ma_lenh, cap_trade, chieu_lenh, vao_entry, dat_tp, dinh_sl, tien_volum, dateValue, ket_qua, ghi_chu, req.session.user.id]
    );
    res.redirect('/users/tradingjournal');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});




//Get form edit giao dịch
router.get('/edit/:id', ensureAuth, async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM diary WHERE id = $1 AND user_id = $2', [id, req.session.user.id]);
  res.render('editTrade', { trade: result.rows[0], user: req.session.user });
});

//Post edit giao dich
router.post('/edit/:id', ensureAuth, async (req, res) => {
  const { id } = req.params;
  const { ma_lenh, cap_trade, chieu_lenh, vao_entry, dat_tp, dinh_sl, tien_volum, date_trade, ket_qua, ghi_chu } = req.body;

  await pool.query(
    `UPDATE diary SET ma_lenh=$1, cap_trade=$2, chieu_lenh=$3, vao_entry=$4, dat_tp=$5, dinh_sl=$6, 
     tien_volum=$7, date_trade=$8, ket_qua=$9, ghi_chu=$10 WHERE id=$11 AND user_id=$12`,
    [ma_lenh, cap_trade, chieu_lenh, vao_entry, dat_tp, dinh_sl, tien_volum, date_trade, ket_qua, ghi_chu, id, req.session.user.id]
  );

  res.redirect('/users/tradingjournal');
});


//post xoa trade
router.post('/delete/:id', ensureAuth, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM diary WHERE id = $1 AND user_id = $2', [id, req.session.user.id]);
  res.redirect('/users/tradingjournal');
});





module.exports = router;
