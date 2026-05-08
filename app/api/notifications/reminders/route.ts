import { NextResponse } from 'next/server';
import { firebaseFirestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { sendChallengeReminder } from '@/lib/brevo';

/**
 * API route to trigger challenge reminders based on the current date.
 * Should be called by a cron job once per day.
 */
export async function GET(request: Request) {
  // Basic auth check (optional but recommended for production)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Check current date (Targeting May 11, 2026)
  const now = new Date();
  // Ensure we're using UTC or a specific timezone consistent with the user's intent
  const todayStr = now.toISOString().split('T')[0]; 
  
  const threeDaysBefore = '2026-05-08';
  const oneDayBefore = '2026-05-10';
  const startDay = '2026-05-11';
  
  let type: '3-days' | '1-day' | 'start' | null = null;
  
  if (todayStr === threeDaysBefore) type = '3-days';
  else if (todayStr === oneDayBefore) type = '1-day';
  else if (todayStr === startDay) type = 'start';
  
  if (!type) {
    return NextResponse.json({ 
      message: 'No notification scheduled for today',
      today: todayStr,
      nextScheduled: [threeDaysBefore, oneDayBefore, startDay].filter(d => d > todayStr)[0] || 'None'
    });
  }
  
  try {
    // 2. Fetch all registered challengers
    const usersSnapshot = await getDocs(collection(firebaseFirestore, 'users'));
    const recipients = usersSnapshot.docs
      .map(doc => ({
        email: doc.data().email,
        name: doc.data().username || 'Challenger',
      }))
      .filter(r => r.email); // Ensure valid email exists
    
    if (recipients.length === 0) {
      return NextResponse.json({ message: 'No users found in database' });
    }
    
    // 3. Batch send via Brevo
    await sendChallengeReminder(recipients, type);
    
    return NextResponse.json({ 
      success: true,
      message: `Notifications triggered for: ${type}`,
      recipients: recipients.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Notification system failure:', error);
    return NextResponse.json({ 
      error: 'Failed to process notifications',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
