// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, loading } = useContext(AuthContext); // Destructure user và loading
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          JobConnect
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Trang chủ</Link>
          </li>
          <li className="nav-item">
            <Link to="/jobs" className="nav-link">Việc làm</Link>
          </li>

          {user ? (
            <>
              {user.role === 'employer' && (
                <li className="nav-item">
                  <Link to="/create-job" className="nav-link">Đăng việc</Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn-logout">
                  Đăng xuất
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Đăng nhập</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Đăng ký</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;