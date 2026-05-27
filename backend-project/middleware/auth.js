const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

const requireAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden. Admin access required.' });
};

module.exports = { requireAuth, requireAdmin };
