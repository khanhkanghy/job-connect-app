// src/pages/MyJobs.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import config from '../config';

const MyJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const res = await axios.get(`${config.API_BASE_URL}/api/jobs/my/jobs`, config);
        setJobs(res.data.jobs);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách việc làm');
        setLoading(false);
      }
    };

    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  const handleAcceptApplicant = async (jobId, applicantId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put(`${config.API_BASE_URL}/api/jobs/${jobId}/applicants/${applicantId}/accept`, {}, config);
      alert('Chấp nhận ứng viên thành công!');
      
      // Reload lại danh sách
      const token2 = localStorage.getItem('token');
      const config2 = {
        headers: {
          'Authorization': `Bearer ${token2}`
        }
      };
      const res = await axios.get(`${config.API_BASE_URL}/api/jobs/my/jobs`, config2);
      setJobs(res.data.jobs);
    } catch (err) {
      alert('Lỗi khi chấp nhận ứng viên');
    }
  };

  const handleRejectApplicant = async (jobId, applicantId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put(`${config.API_BASE_URL}/api/jobs/${jobId}/applicants/${applicantId}/reject`, {}, config);
      alert('Từ chối ứng viên thành công!');
      
      // Reload lại danh sách
      const token2 = localStorage.getItem('token');
      const config2 = {
        headers: {
          'Authorization': `Bearer ${token2}`
        }
      };
      const res = await axios.get(`${config.API_BASE_URL}/api/jobs/my/jobs`, config2);
      setJobs(res.data.jobs);
    } catch (err) {
      alert('Lỗi khi từ chối ứng viên');
    }
  };

  if (!user) {
    return (
      <div className="my-jobs-page">
        <div className="not-logged-in">
          <h2>Vui lòng đăng nhập để xem việc làm của bạn</h2>
          <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'employer') {
    return (
      <div className="my-jobs-page">
        <div className="access-denied">
          <h2>Chỉ nhà tuyển dụng mới có thể xem trang này</h2>
          <Link to="/jobs" className="btn btn-primary">Tìm việc làm</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Mở';
      case 'closed': return 'Đóng';
      case 'filled': return 'Đã tuyển đủ';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'closed': return 'status-closed';
      case 'filled': return 'status-filled';
      default: return '';
    }
  };

  return (
    <div className="my-jobs-page">
      <div className="my-jobs-header">
        <h1>Việc làm của tôi</h1>
        <Link to="/create-job" className="btn btn-primary">Đăng việc mới</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="no-jobs">
          <p>Bạn chưa đăng việc làm nào.</p>
          <Link to="/create-job" className="btn btn-primary">Đăng việc đầu tiên</Link>
        </div>
      ) : (
        <div className="my-jobs-list">
          {jobs.map(job => (
            <div key={job._id} className="my-job-card">
              <div className="job-header">
                <h3>
                  <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                </h3>
                <span className={`job-status-badge ${getStatusClass(job.status)}`}>
                  {getStatusText(job.status)}
                </span>
              </div>
              
              <div className="job-info">
                <p className="job-location">📍 {job.location}</p>
                <p className="job-salary">
                  💰 {job.salary.toLocaleString()} VNĐ/{job.salaryType === 'hourly' ? 'giờ' : job.salaryType === 'daily' ? 'ngày' : 'cố định'}
                </p>
                <p className="job-date">📅 Bắt đầu: {new Date(job.startDate).toLocaleDateString()}</p>
              </div>

              <div className="job-applicants">
                <h4>Ứng viên ({job.applicants.length})</h4>
                {job.applicants.length === 0 ? (
                  <p>Chưa có ứng viên nào.</p>
                ) : (
                  <div className="applicants-list">
                    {job.applicants.map(applicant => (
                      <div key={applicant.user._id} className="applicant-item">
                        <div className="applicant-info">
                          <strong>{applicant.user.name}</strong>
                          <p>{applicant.user.email}</p>
                          <p className="applied-date">
                            Ứng tuyển: {new Date(applicant.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="applicant-actions">
                          {applicant.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleAcceptApplicant(job._id, applicant.user._id)}
                                className="btn btn-success"
                              >
                                Chấp nhận
                              </button>
                              <button 
                                onClick={() => handleRejectApplicant(job._id, applicant.user._id)}
                                className="btn btn-danger"
                              >
                                Từ chối
                              </button>
                            </>
                          )}
                          {applicant.status === 'accepted' && (
                            <span className="status-accepted">Đã chấp nhận</span>
                          )}
                          {applicant.status === 'rejected' && (
                            <span className="status-rejected">Đã từ chối</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;