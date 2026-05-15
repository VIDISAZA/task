import mongoose from 'mongoose';

const DailyStatsSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true,
  },
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  totalFocusMinutes: {
    type: Number,
    default: 0,
  },
  streakActive: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.DailyStats || mongoose.model('DailyStats', DailyStatsSchema);
