// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Cấu hình CORS để cho phép frontend kết nối
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://job-connect-app-bay.vercel.app'
  ],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes cơ bản
app.get('/', (req, res) => {
  res.send('API đang chạy...');
});

// Route test database
app.get('/api/test-db', async (req, res) => {
  try {
    const User = require('./models/User');
    const Job = require('./models/job');
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    res.json({ 
      message: 'Kết nối database OK', 
      userCount, 
      jobCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi kiểm tra database', error: error.message });
  }
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Job routes
const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);

// Serve static files từ frontend (cho production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => {
    console.log('❌ Lỗi kết nối MongoDB:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy trên port ${PORT}`);
});
