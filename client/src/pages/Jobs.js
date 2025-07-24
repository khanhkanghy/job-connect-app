// src/pages/Jobs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        setJobs(res.data.jobs);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách việc làm');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>Việc làm bán thời gian</h1>
        <p>Tìm công việc phù hợp với nhu cầu của bạn</p>
      </div>

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p>Chưa có việc làm nào được đăng.</p>
        ) : (
          jobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>
                <Link to={`/jobs/${job._id}`} className="job-title">
                  {job.title}
                </Link>
              </h3>
              <p className="job-employer">Nhà tuyển dụng: {job.employer.name}</p>
              <p className="job-location">📍 {job.location}</p>
              <p className="job-salary">
                💰 {job.salary.toLocaleString()} VNĐ/{job.salaryType === 'hourly' ? 'giờ' : job.salaryType === 'daily' ? 'ngày' : 'cố định'}
              </p>
              <p className="job-date">📅 Bắt đầu: {new Date(job.startDate).toLocaleDateString()}</p>
              <p className="job-description">
                {job.description.substring(0, 100)}...
              </p>
              <Link to={`/jobs/${job._id}`} className="btn btn-secondary">
                Xem chi tiết
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;