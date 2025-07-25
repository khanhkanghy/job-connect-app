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

// Routes cần xác thực
router.use(protect);

// Routes cho employer - đặt trước routes có parameter
router.post('/', createJob);
router.get('/my/jobs', getMyJobs);

// Routes cho worker - đặt trước routes có parameter
router.get('/my/applied', getAppliedJobs); // Lấy việc đã ứng tuyển

// Routes có parameter - đặt sau các routes cụ thể
router.get('/:jobId', getJobById);
router.get('/:jobId/applicants', getJobApplicants); // Lấy danh sách ứng viên
router.post('/:jobId/apply', applyToJob); // Ứng tuyển job
router.put('/:jobId/applicants/:applicantId/accept', acceptApplicant); // Chấp nhận ứng viên
router.put('/:jobId/applicants/:applicantId/reject', rejectApplicant); // Từ chối ứng viên

module.exports = router;