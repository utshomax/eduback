const adminAuth = (req, res, next) => {
  const token = req.headers.token;
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'madvert';
  if (token == ADMIN_TOKEN) {
    return next();
  } else {
    res.code(401).send({
      message: 'Unauthorized',
    });
    return new Error('Unauthorized');
  }
};

module.exports = adminAuth;
