import mongoose from 'mongoose';

const FocusSessionSchema = new mongoose.Schema({
  durationMinutes: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
});

export default mongoose.models.FocusSession || mongoose.model('FocusSession', FocusSessionSchema);
