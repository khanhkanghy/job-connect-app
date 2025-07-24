// controllers/jobController.js
const Job = require('../models/job_temp');
const User = require('../models/User');

// Tạo job mới (chỉ nhà tuyển dụng)
const createJob = async (req, res) => {
  try {
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
    } = req.body;

    // Kiểm tra user có phải employer không
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        message: 'Chỉ nhà tuyển dụng mới có thể đăng việc'
      });
    }

    // Tạo job mới
    const job = new Job({
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
      skills: skills || [],
      experience,
      employer: req.user._id
    });

    await job.save();

    // Populate employer info
    await job.populate('employer', 'name email');

    res.status(201).json({
      message: 'Đăng việc thành công',
      job
    });

  } catch (error) {
    console.error('Lỗi tạo job:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy danh sách job (cho người tìm việc)
const getJobs = async (req, res) => {
  try {
    const { location, salaryMin, workType, experience } = req.query;
    
    // Build filter object
    let filter = { status: 'open' };
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (salaryMin) {
      filter.salary = { $gte: Number(salaryMin) };
    }
    
    if (workType) {
      filter.workType = workType;
    }
    
    if (experience) {
      filter.experience = experience;
    }

    // Lấy jobs với filter và populate employer
    const jobs = await Job.find(filter)
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Lấy danh sách việc làm thành công',
      count: jobs.length,
      jobs
    });

  } catch (error) {
    console.error('Lỗi lấy jobs:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy job theo ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findById(id)
      .populate('employer', 'name email');
    
    if (!job) {
      return res.status(404).json({
        message: 'Không tìm thấy việc làm'
      });
    }

    res.json({
      message: 'Lấy thông tin việc làm thành công',
      job
    });

  } catch (error) {
    console.error('Lỗi lấy job:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy jobs của employer hiện tại
const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        message: 'Chỉ nhà tuyển dụng mới có thể xem danh sách việc đã đăng'
      });
    }

    const jobs = await Job.find({ employer: req.user._id })
      .populate('applicants.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Lấy danh sách việc làm của bạn thành công',
      count: jobs.length,
      jobs
    });

  } catch (error) {
    console.error('Lỗi lấy my jobs:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Ứng tuyển job (chỉ worker)
const applyToJob = async (req, res) => {
  try {
    const { id } = req.params; // job ID
    const userId = req.user._id;

    // Kiểm tra user có phải worker không
    if (req.user.role !== 'worker') {
      return res.status(403).json({
        message: 'Chỉ người tìm việc mới có thể ứng tuyển'
      });
    }

    // Tìm job
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: 'Không tìm thấy việc làm'
      });
    }

    // Kiểm tra job có còn mở không
    if (job.status !== 'open') {
      return res.status(400).json({
        message: 'Việc làm này đã đóng hoặc đã tuyển đủ'
      });
    }

    // Kiểm tra đã ứng tuyển chưa
    const alreadyApplied = job.applicants.some(app => 
      app.user.toString() === userId.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        message: 'Bạn đã ứng tuyển công việc này rồi'
      });
    }

    // Thêm applicant vào job
    job.applicants.push({
      user: userId,
      appliedAt: new Date(),
      status: 'pending'
    });

    await job.save();

    // Populate applicant info
    await job.populate('applicants.user', 'name email');

    res.json({
      message: 'Ứng tuyển thành công',
      job
    });

  } catch (error) {
    console.error('Lỗi ứng tuyển:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy danh sách ứng viên của 1 job (chỉ employer)
const getJobApplicants = async (req, res) => {
  try {
    const { id } = req.params; // job ID
    const userId = req.user._id;

    // Tìm job
    const job = await Job.findById(id)
      .populate('applicants.user', 'name email')
      .populate('employer', 'name email');

    if (!job) {
      return res.status(404).json({
        message: 'Không tìm thấy việc làm'
      });
    }

    // Kiểm tra user có phải owner của job không
    if (job.employer._id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Bạn không có quyền xem danh sách ứng viên của công việc này'
      });
    }

    res.json({
      message: 'Lấy danh sách ứng viên thành công',
      applicants: job.applicants
    });

  } catch (error) {
    console.error('Lỗi lấy applicants:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy danh sách việc đã ứng tuyển (chỉ worker)
const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Kiểm tra user có phải worker không
    if (req.user.role !== 'worker') {
      return res.status(403).json({
        message: 'Chỉ người tìm việc mới có thể xem danh sách việc đã ứng tuyển'
      });
    }

    // Tìm tất cả jobs mà user đã ứng tuyển
    const jobs = await Job.find({ 'applicants.user': userId })
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });

    // Lọc thông tin applicants để chỉ hiển thị thông tin của user hiện tại
    const appliedJobs = jobs.map(job => {
      const applicant = job.applicants.find(app => 
        app.user.toString() === userId.toString()
      );
      
      return {
        _id: job._id,
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        salaryType: job.salaryType,
        workType: job.workType,
        startDate: job.startDate,
        employer: job.employer,
        appliedAt: applicant.appliedAt,
        status: applicant.status,
        createdAt: job.createdAt
      };
    });

    res.json({
      message: 'Lấy danh sách việc đã ứng tuyển thành công',
      count: appliedJobs.length,
      jobs: appliedJobs
    });

  } catch (error) {
    console.error('Lỗi lấy applied jobs:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Chấp nhận ứng viên (chỉ employer)
const acceptApplicant = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;
    const userId = req.user._id;

    // Tìm job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: 'Không tìm thấy việc làm'
      });
    }

    // Kiểm tra user có phải owner của job không
    if (job.employer.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }

    // Tìm applicant và cập nhật status
    const applicantIndex = job.applicants.findIndex(app => 
      app.user.toString() === applicantId
    );

    if (applicantIndex === -1) {
      return res.status(404).json({
        message: 'Không tìm thấy ứng viên'
      });
    }

    job.applicants[applicantIndex].status = 'accepted';
    job.status = 'filled'; // Đánh dấu job đã tuyển đủ

    await job.save();

    // Populate thông tin
    await job.populate('applicants.user', 'name email');
    await job.populate('employer', 'name email');

    res.json({
      message: 'Chấp nhận ứng viên thành công',
      job
    });

  } catch (error) {
    console.error('Lỗi chấp nhận applicant:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Từ chối ứng viên (chỉ employer)
const rejectApplicant = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;
    const userId = req.user._id;

    // Tìm job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: 'Không tìm thấy việc làm'
      });
    }

    // Kiểm tra user có phải owner của job không
    if (job.employer.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }

    // Tìm applicant và cập nhật status
    const applicantIndex = job.applicants.findIndex(app => 
      app.user.toString() === applicantId
    );

    if (applicantIndex === -1) {
      return res.status(404).json({
        message: 'Không tìm thấy ứng viên'
      });
    }

    job.applicants[applicantIndex].status = 'rejected';

    await job.save();

    // Populate thông tin
    await job.populate('applicants.user', 'name email');
    await job.populate('employer', 'name email');

    res.json({
      message: 'Từ chối ứng viên thành công',
      job
    });

  } catch (error) {
    console.error('Lỗi từ chối applicant:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  applyToJob,
  getJobApplicants,
  getAppliedJobs,
  acceptApplicant,
  rejectApplicant
};