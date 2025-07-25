// routes/jobRoutes.js
const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  applyToJob,
  getJobApplicants,
  getAppliedJobs, // Đảm bảo dòng này có trong import
  acceptApplicant,
  rejectApplicant
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes công khai
router.get('/', getJobs);
router.get('/:jobId', getJobById);

// Routes cần xác thực
router.post('/', protect, createJob);
router.get('/my/jobs', protect, getMyJobs);
router.get('/my/applied', protect, getAppliedJobs); // Lấy việc đã ứng tuyển
router.get('/:jobId/applicants', protect, getJobApplicants); // Lấy danh sách ứng viên
router.post('/:jobId/apply', protect, applyToJob); // Ứng tuyển job
router.put('/:jobId/applicants/:applicantId/accept', protect, acceptApplicant); // Chấp nhận ứng viên
router.put('/:jobId/applicants/:applicantId/reject', protect, rejectApplicant); // Từ chối ứng viên

module.exports = router;