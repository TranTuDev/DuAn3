function ensureAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function isAdmin(req, res, next) {
  if (req.session.user?.role !== 'admin') return res.status(403).send('Access denied');
  next();
}

module.exports = { ensureAuth, isAdmin };
