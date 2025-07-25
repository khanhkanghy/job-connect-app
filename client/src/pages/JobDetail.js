// src/pages/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchJob = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/jobs/${id}`);
        setJob(res.data.job);
        setLoading(false);
      } catch (err) {
        setError('Không tìm thấy việc làm');
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập để ứng tuyển');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post(`${config.API_BASE_URL}/api/jobs/${id}/apply`, {}, config);
      alert('Ứng tuyển thành công!');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi ứng tuyển');
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!job) {
    return <div className="error">Không tìm thấy việc làm</div>;
  }

  return (
    <div className="job-detail">
      <div className="job-detail-header">
        <h1>{job.title}</h1>
        <p className="job-employer">Nhà tuyển dụng: {job.employer.name}</p>
      </div>

      <div className="job-detail-content">
        <div className="job-info">
          <div className="info-item">
            <strong>📍 Địa điểm:</strong> {job.location}
          </div>
          <div className="info-item">
            <strong>💰 Mức lương:</strong> {job.salary.toLocaleString()} VNĐ/{job.salaryType === 'hourly' ? 'giờ' : job.salaryType === 'daily' ? 'ngày' : 'cố định'}
          </div>
          <div className="info-item">
            <strong>📅 Ngày bắt đầu:</strong> {new Date(job.startDate).toLocaleDateString()}
          </div>
          <div className="info-item">
            <strong>⏰ Thời gian:</strong> {job.startTime} - {job.endTime || 'Không xác định'}
          </div>
          <div className="info-item">
            <strong>🔧 Kỹ năng yêu cầu:</strong> {job.skills.join(', ') || 'Không yêu cầu'}
          </div>
          <div className="info-item">
            <strong>🎓 Kinh nghiệm:</strong> {job.experience === 'no-experience' ? 'Không yêu cầu' : job.experience}
          </div>
        </div>

        <div className="job-description">
          <h3>Mô tả công việc:</h3>
          <p>{job.description}</p>
        </div>

        {user && user.role === 'worker' && (
          <button onClick={handleApply} className="btn btn-primary">
            Ứng tuyển ngay
          </button>
        )}

        {user && user.role === 'employer' && (
          <p className="employer-note">
            Bạn là nhà tuyển dụng. Đây là công việc của bạn.
          </p>
        )}

        {!user && (
          <div className="login-prompt">
            <p>Đăng nhập để ứng tuyển công việc này</p>
            <button onClick={() => navigate('/login')} className="btn btn-secondary">
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;