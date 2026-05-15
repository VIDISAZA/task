import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

export async function POST() {
  try {
    await dbConnect();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find tasks that are pending and have a dueDate strictly before today
    const overdueTasks = await Task.find({
      status: 'pending',
      dueDate: { $lt: today }
    });
    
    if (overdueTasks.length === 0) {
      return NextResponse.json({ success: true, message: 'No tasks to reschedule' });
    }
    
    // Smart Reschedule: move them to today and increment skippedCount
    const newDueDate = new Date(); // Today
    
    const bulkOps = overdueTasks.map(task => ({
      updateOne: {
        filter: { _id: task._id },
        update: { 
          $set: { dueDate: newDueDate },
          $inc: { skippedCount: 1 } 
        }
      }
    }));
    
    await Task.bulkWrite(bulkOps);
    
    return NextResponse.json({ 
      success: true, 
      message: `Rescheduled ${overdueTasks.length} tasks to today.` 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
