// src/pages/Profile.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import config from '../config';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (user && user.role === 'worker') {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          
          const res = await axios.get(`${config.API_BASE_URL}/api/jobs/my/applied`, config);
          setAppliedJobs(res.data.jobs);
        } catch (err) {
          console.error('Lỗi khi tải danh sách việc đã ứng tuyển');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (user && user.role === 'worker') {
      fetchAppliedJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="not-logged-in">
          <h2>Vui lòng đăng nhập để xem profile</h2>
          <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'accepted': return 'Đã chấp nhận';
      case 'rejected': return 'Đã từ chối';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <div className="info-item">
            <strong>Họ tên:</strong> {user.name}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="info-item">
            <strong>Vai trò:</strong> 
            {user.role === 'worker' ? ' Người tìm việc' : ' Nhà tuyển dụng'}
          </div>
        </div>

        {user.role === 'worker' && (
          <div className="profile-section">
            <h3>Việc làm đã ứng tuyển</h3>
            {loading ? (
              <p>Đang tải...</p>
            ) : appliedJobs.length === 0 ? (
              <p>Bạn chưa ứng tuyển công việc nào.</p>
            ) : (
              <div className="applied-jobs-list">
                {appliedJobs.map(job => (
                  <div key={job._id} className="applied-job-card">
                    <h4>
                      <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                    </h4>
                    <p className="job-employer">Nhà tuyển dụng: {job.employer.name}</p>
                    <p className="job-location">📍 {job.location}</p>
                    <p className="job-salary">
                      💰 {job.salary.toLocaleString()} VNĐ/{job.salaryType === 'hourly' ? 'giờ' : job.salaryType === 'daily' ? 'ngày' : 'cố định'}
                    </p>
                    <p className={`job-status ${getStatusClass(job.status)}`}>
                      Trạng thái: {getStatusText(job.status)}
                    </p>
                    <p className="applied-date">
                      Ứng tuyển ngày: {new Date(job.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user.role === 'employer' && (
          <div className="profile-section">
            <h3>Quản lý việc làm</h3>
            <div className="employer-actions">
              <Link to="/create-job" className="btn btn-primary">
                Đăng việc mới
              </Link>
              <Link to="/my-jobs" className="btn btn-secondary">
                Việc làm của tôi
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;