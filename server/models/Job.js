// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true
  },
  salaryType: {
    type: String,
    enum: ['hourly', 'daily', 'fixed'],
    default: 'hourly'
  },
  workType: {
    type: String,
    enum: ['part-time', 'full-time', 'contract'],
    default: 'part-time'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  startTime: {
    type: String, // Ví dụ: "09:00"
    required: true
  },
  endTime: {
    type: String, // Ví dụ: "17:00"
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    enum: ['no-experience', 'beginner', 'intermediate', 'experienced'],
    default: 'no-experience'
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Cập nhật phần applicants
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);