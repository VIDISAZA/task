import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FocusSession from '@/models/FocusSession';
import DailyStats from '@/models/DailyStats';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const session = await FocusSession.create(body);

    // Update DailyStats
    const dateStr = new Date().toISOString().split('T')[0];
    await DailyStats.findOneAndUpdate(
      { date: dateStr },
      { $inc: { totalFocusMinutes: body.durationMinutes } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const sessions = await FocusSession.find({}).sort({ completedAt: -1 }).limit(50);
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
