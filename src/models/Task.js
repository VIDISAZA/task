import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for this task.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  category: {
    type: String,
    default: 'General',
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  urgency: {
    type: String,
    enum: ['high', 'low'],
    default: 'low',
  },
  dueDate: {
    type: Date,
  },
  skippedCount: {
    type: Number,
    default: 0,
  },
  aiPriorityScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
