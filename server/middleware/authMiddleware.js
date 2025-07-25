// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra header có chứa token không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      message: 'Không có token, vui lòng đăng nhập' 
    });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user tương ứng với token
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ 
        message: 'Token không hợp lệ, vui lòng đăng nhập lại' 
      });
    }

    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    return res.status(401).json({ 
      message: 'Token không hợp lệ, vui lòng đăng nhập lại' 
    });
  }
};

module.exports = { protect };