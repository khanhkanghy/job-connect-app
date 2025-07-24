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
router.get('/:id', getJobById);

// Routes cần xác thực
router.use(protect);

// Routes cho employer
router.post('/', createJob);
router.get('/my/jobs', getMyJobs);
router.get('/:id/applicants', getJobApplicants); // Lấy danh sách ứng viên
router.put('/:id/applicants/:applicantId/accept', acceptApplicant); // Chấp nhận ứng viên
router.put('/:id/applicants/:applicantId/reject', rejectApplicant); // Từ chối ứng viên

// Routes cho worker
router.post('/:id/apply', applyToJob); // Ứng tuyển job
router.get('/my/applied', getAppliedJobs); // Lấy việc đã ứng tuyển

module.exports = router;