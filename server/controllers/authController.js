// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Đăng ký người dùng mới
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Vui lòng điền đầy đủ thông tin' 
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email này đã được sử dụng' 
      });
    }

    // Tạo user mới
    const user = new User({
      name,
      email,
      password,
      role // 'worker' hoặc 'employer'
    });

    await user.save();

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Trả về response (không bao gồm password)
    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Đăng nhập người dùng
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập email và mật khẩu' 
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Trả về response
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login
};