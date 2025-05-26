const express = require('express');
const router = express.Router();

// ở đây root path là /users/trade do đã mount ở index.js

//Get page /users/trade
router.get('/', (req, res) => {
  res.render('trade', { user: req.session.user });
});

module.exports = router;
