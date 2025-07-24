// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Tìm việc bán thời gian dễ dàng</h1>
        <p>Kết nối người tìm việc với nhà tuyển dụng theo giờ, theo ngày</p>
        <div className="cta-buttons">
          <Link to="/jobs" className="btn btn-primary">Tìm việc ngay</Link>
          <Link to="/register" className="btn btn-secondary">Đăng ký nhà tuyển dụng</Link>
        </div>
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>✅ Việc làm linh hoạt</h3>
          <p>Theo giờ, theo ngày, theo nhu cầu</p>
        </div>
        <div className="feature">
          <h3>🚀 Kết nối nhanh chóng</h3>
          <p>Kết nối trực tiếp với nhà tuyển dụng</p>
        </div>
        <div className="feature">
          <h3>💰 Thanh toán minh bạch</h3>
          <p>Thanh toán qua ứng dụng hoặc thỏa thuận</p>
        </div>
      </div>
    </div>
  );
};

export default Home;