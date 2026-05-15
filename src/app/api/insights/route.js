import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import DailyStats from '@/models/DailyStats';

// A mock function that simulates an AI prioritizing tasks
function calculateSmartPriority(task) {
  let score = 0;
  
  if (task.priority === 'high') score += 40;
  if (task.priority === 'medium') score += 20;
  
  if (task.urgency === 'high') score += 30;
  
  if (task.dueDate) {
    const today = new Date();
    const due = new Date(task.dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) score += 50; // Overdue is very high priority
    else if (diffDays === 0) score += 30; // Due today
    else if (diffDays < 3) score += 10;
  }
  
  // Penalize tasks that have been skipped many times
  score -= (task.skippedCount || 0) * 5;
  
  return Math.max(0, Math.min(100, score));
}

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Calculate Smart Priority for all pending tasks
    const tasks = await Task.find({ status: 'pending' });
    let totalTasks = tasks.length;
    
    // Bulk update tasks with their new AI Priority Score
    const bulkOps = tasks.map(task => {
      const score = calculateSmartPriority(task);
      return {
        updateOne: {
          filter: { _id: task._id },
          update: { $set: { aiPriorityScore: score } }
        }
      };
    });
    
    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
    }
    
    // 2. Generate Arion Insight
    // Fetch stats for the last 7 days
    const stats = await DailyStats.find({}).sort({ date: -1 }).limit(7);
    const avgFocus = stats.reduce((acc, curr) => acc + curr.totalFocusMinutes, 0) / (stats.length || 1);
    
    let insight = "";
    if (avgFocus > 120) {
      insight = "You've been highly focused lately! Keep up the great work, but remember to take breaks.";
    } else if (totalTasks > 10) {
      insight = "Your task list is growing. I've highlighted the most critical tasks in your Eisenhower Matrix.";
    } else {
      insight = "It's a quiet day. A perfect time to plan ahead or tackle some low-priority tasks.";
    }
    
    return NextResponse.json({ success: true, data: { insight, avgFocus } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
