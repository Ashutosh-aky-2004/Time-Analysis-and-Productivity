import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  suspendedMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  removedMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  managingUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  invitedMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalDuration: {
    type: Number, // in minutes
    default: 0
  },
  projectStartedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to calculate total duration
projectSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const duration = this.endDate - this.startDate;
    this.totalDuration = Math.round(duration / (1000 * 60)); // Convert to minutes
  }
  this.updatedAt = Date.now();
  next();
});

// Static method to get project name
projectSchema.statics.getProjectName = async function(projectId) {
  const project = await this.findOne({ projectId });
  return project ? project.name : null;
};

export default mongoose.model('Project', projectSchema);