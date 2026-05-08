import { BrevoClient } from '@getbrevo/brevo';

export interface EmailRecipient {
  email: string;
  name?: string;
}

export async function sendChallengeReminder(
  recipients: EmailRecipient[],
  type: '3-days' | '1-day' | 'start'
) {
  const apiKey = process.env.BREVO_API_KEY || '';
  
  if (!apiKey) {
    console.error('BREVO_API_KEY is not set');
    return;
  }

  const client = new BrevoClient({ apiKey });

  const subjectMap = {
    '3-days': 'TADS 1K Challenge: 3 Days Remaining',
    '1-day': 'TADS 1K Challenge: COMMENCE IN 24 HOURS',
    'start': 'TADS 1K Challenge: PROTOCOL INITIATED',
  };

  const contentMap = {
    '3-days': `
      <div style="font-family: monospace; background-color: #000; color: #39FF14; padding: 40px; border: 2px solid #39FF14;">
        <h1 style="border-bottom: 1px solid #39FF14; padding-bottom: 10px;">[T-3 DAYS] CHALLENGE COMMENCEMENT</h1>
        <p>This is an automated reminder. The TADS 1K Challenge begins on <b>May 11 at 00:00</b>.</p>
        <p>Ensure your environment is ready. Zero excuses.</p>
        <p style="margin-top: 20px;">
          <a href="https://1kchallenge.tadstech.dev" style="color: #39FF14; text-decoration: none; border: 1px solid #39FF14; padding: 10px 20px;">ACCESS DASHBOARD</a>
        </p>
        <p style="margin-top: 40px; opacity: 0.7;">-- SYSTEM_STATUS: READY</p>
      </div>
    `,
    '1-day': `
      <div style="font-family: monospace; background-color: #000; color: #39FF14; padding: 40px; border: 2px solid #39FF14;">
        <h1 style="border-bottom: 1px solid #39FF14; padding-bottom: 10px;">[T-24 HOURS] FINAL COUNTDOWN</h1>
        <p>The protocol initiates at <b>00:00 on May 11</b>. Your 90-day sprint is about to begin.</p>
        <p>One thousand dollars. Three months. Industrialize your hustle.</p>
        <p style="margin-top: 20px;">
          <a href="https://1kchallenge.tadstech.dev" style="color: #39FF14; text-decoration: none; border: 1px solid #39FF14; padding: 10px 20px;">PREPARE FOR INITIATION</a>
        </p>
        <p style="margin-top: 40px; opacity: 0.7; color: #FF5F1F;">-- SYSTEM_STATUS: ARMED</p>
      </div>
    `,
    'start': `
      <div style="font-family: monospace; background-color: #000; color: #39FF14; padding: 40px; border: 2px solid #39FF14;">
        <h1 style="border-bottom: 1px solid #39FF14; padding-bottom: 10px;">[PROTOCOL INITIATED] DAY ZERO</h1>
        <p>The TADS 1K Challenge has officially started (May 11, 00:00).</p>
        <p>Your 90-day countdown begins NOW. Access your dashboard to commit your first milestone.</p>
        <p style="margin-top: 20px;">
          <a href="https://1kchallenge.tadstech.dev" style="color: #39FF14; text-decoration: none; border: 1px solid #39FF14; padding: 10px 20px;">DASHBOARD_LOGIN</a>
        </p>
        <p style="margin-top: 40px; color: #39FF14;">&gt; Industrialize. Hustle. Succeed.</p>
      </div>
    `,
  };

  try {
    const data = await client.transactionalEmails.sendTransacEmail({
      subject: subjectMap[type],
      htmlContent: contentMap[type],
      sender: { name: 'TADS 1K Challenge', email: 'noreply@tadstech.dev' },
      to: recipients.map(r => ({ email: r.email, name: r.name })),
    });
    
    return data;
  } catch (error) {
    console.error('Error calling Brevo API:', error);
    throw error;
  }
}
