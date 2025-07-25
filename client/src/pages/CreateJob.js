// src/pages/CreateJob.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import config from '../config';

const CreateJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    salaryType: 'hourly',
    workType: 'part-time',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    skills: '',
    experience: 'no-experience'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    title,
    description,
    location,
    salary,
    salaryType,
    workType,
    startDate,
    endDate,
    startTime,
    endTime,
    skills,
    experience
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!title || !description || !location || !salary || !startDate || !startTime) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      // Chuyển skills từ string sang array
      const jobData = {
        ...formData,
        salary: Number(salary),
        skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.post(`${config.API_BASE_URL}/api/jobs`, jobData, config);
      
      alert('Tạo việc làm thành công!');
      navigate(`/jobs/${res.data.job._id}`);
      
    } catch (err) {
      console.error('Lỗi tạo job:', err);
      setError(err.response?.data?.message || err.message || 'Lỗi khi tạo việc làm');
    } finally {
      setLoading(false);
    }
  };

  // Nếu chưa đăng nhập hoặc không phải employer
  if (!user) {
    return (
      <div className="create-job-page">
        <div className="not-authorized">
          <h2>Vui lòng đăng nhập để đăng việc</h2>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'employer') {
    return (
      <div className="create-job-page">
        <div className="not-authorized">
          <h2>Chỉ nhà tuyển dụng mới có thể đăng việc</h2>
          <button onClick={() => navigate('/jobs')} className="btn btn-primary">
            Tìm việc làm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-job-page">
      <div className="create-job-header">
        <h1>Đăng việc làm mới</h1>
        <p>Đăng tin tuyển dụng để tìm người làm phù hợp</p>
      </div>

      <div className="create-job-form-container">
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={onSubmit} className="create-job-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h3>Thông tin công việc</h3>
            
            <div className="form-group">
              <label htmlFor="title">Tiêu đề công việc <span className="required">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Ví dụ: Nhân viên phục vụ bán thời gian"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả công việc <span className="required">*</span></label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Mô tả chi tiết công việc, nhiệm vụ, yêu cầu..."
                rows="6"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="location">Địa điểm làm việc <span className="required">*</span></label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={onChange}
                placeholder="Ví dụ: Quận 1, TP.HCM"
                required
              />
            </div>
          </div>

          {/* Thông tin lương và thời gian */}
          <div className="form-section">
            <h3>Lương và Thời gian</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salary">Mức lương (VNĐ) <span className="required">*</span></label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={salary}
                  onChange={onChange}
                  placeholder="Ví dụ: 30000"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaryType">Loại lương</label>
                <select id="salaryType" name="salaryType" value={salaryType} onChange={onChange}>
                  <option value="hourly">Theo giờ</option>
                  <option value="daily">Theo ngày</option>
                  <option value="fixed">Cố định</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="workType">Loại công việc</label>
                <select id="workType" name="workType" value={workType} onChange={onChange}>
                  <option value="part-time">Bán thời gian</option>
                  <option value="full-time">Toàn thời gian</option>
                  <option value="contract">Hợp đồng</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Kinh nghiệm yêu cầu</label>
                <select id="experience" name="experience" value={experience} onChange={onChange}>
                  <option value="no-experience">Không yêu cầu</option>
                  <option value="beginner">Mới bắt đầu</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="experienced">Có kinh nghiệm</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Ngày bắt đầu <span className="required">*</span></label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Ngày kết thúc (nếu có)</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Giờ bắt đầu <span className="required">*</span></label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={startTime}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">Giờ kết thúc</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={endTime}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* Kỹ năng yêu cầu */}
          <div className="form-section">
            <h3>Yêu cầu kỹ năng</h3>
            
            <div className="form-group">
              <label htmlFor="skills">Kỹ năng yêu cầu (ngăn cách bằng dấu phẩy)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={skills}
                onChange={onChange}
                placeholder="Ví dụ: giao tiếp, chịu khó, nhanh nhẹn"
              />
              <small className="form-help">Ví dụ: giao tiếp, chịu khó, nhanh nhẹn, biết tiếng Anh</small>
            </div>
          </div>

          {/* Nút submit */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang đăng...' : 'Đăng việc ngay'}
            </button>
            <button type="button" onClick={() => navigate('/my-jobs')} className="btn btn-secondary">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;