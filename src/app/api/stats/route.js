import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DailyStats from '@/models/DailyStats';
import Task from '@/models/Task';

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Get DailyStats (e.g. for the last 7 days)
    const stats = await DailyStats.find({}).sort({ date: -1 }).limit(7);
    
    // Reverse it so the oldest is first for chart display
    const chartData = stats.reverse().map(stat => ({
      name: stat.date.substring(5), // just MM-DD
      hours: +(stat.totalFocusMinutes / 60).toFixed(1),
      completed: stat.tasksCompleted
    }));
    
    // 2. Get overall task completion rate
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    
    const completionRate = {
      completed: completedTasks,
      pending: totalTasks - completedTasks,
    };
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        chartData, 
        completionRate 
      } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
