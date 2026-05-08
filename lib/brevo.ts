import * as SibApiV3Sdk from '@getbrevo/brevo';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Initialize API key
const apiKey = process.env.BREVO_API_KEY || '';
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

export interface EmailRecipient {
  email: string;
  name?: string;
}

export async function sendChallengeReminder(
  recipients: EmailRecipient[],
  type: '3-days' | '1-day' | 'start'
) {
  if (!apiKey) {
    console.error('BREVO_API_KEY is not set');
    return;
  }

  const subjectMap = {
    '3-days': 'TADS 1K Challenge: 3 Days Remaining',
    '1-day': 'TADS 1K Challenge: COMMENCE IN 24 HOURS',
    'start': 'TADS 1K Challenge: PROTOCOL INITIATED',
  };

  const contentMap = {
    '3-days': `
      <div style="font-family: monospace; background-color: #000; color: #39FF14; padding: 40px; border: 2px solid #39FF14;">
        <h1 style="border-bottom: 1px solid #39FF14; padding-bottom: 10px;">[T-3 DAYS] CHALLENGE COMMENCEMENT</h1>
        <p>This is an automated reminder. The TADS 1K Challenge begins in 72 hours.</p>
        <p>Ensure your environment is ready. Zero excuses.</p>
        <p style="margin-top: 40px; opacity: 0.7;">-- SYSTEM_STATUS: READY</p>
      </div>
    `,
    '1-day': `
      <div style="font-family: monospace; background-color: #000; color: #39FF14; padding: 40px; border: 2px solid #39FF14;">
        <h1 style="border-bottom: 1px solid #39FF14; padding-bottom: 10px;">[T-24 HOURS] FINAL COUNTDOWN</h1>
        <p>The protocol initiates in 24 hours. Your 90-day sprint is about to begin.</p>
        <p>One thousand dollars. Three months. Industrialize your hustle.</p>
        <p style="margin-top: 40px; opacity: 0.7; color: #FF5F1F;">-- SYSTEM_STATUS: ARMED</p>
      </div>
    `,
    'start': `
      <div style="font-family: monospace; background-color: #000; color: #39FF14; padding: 40px; border: 2px solid #39FF14;">
        <h1 style="border-bottom: 1px solid #39FF14; padding-bottom: 10px;">[PROTOCOL INITIATED] DAY ZERO</h1>
        <p>The TADS 1K Challenge has officially started.</p>
        <p>Your 90-day countdown begins NOW. Access your dashboard to commit your first milestone.</p>
        <p style="margin-top: 40px; color: #39FF14;">&gt; Industrialize. Hustle. Succeed.</p>
      </div>
    `,
  };

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subjectMap[type];
  sendSmtpEmail.htmlContent = contentMap[type];
  sendSmtpEmail.sender = { name: 'TADS 1K Challenge', email: 'noreply@tadstech.dev' };
  sendSmtpEmail.to = recipients.map(r => ({ email: r.email, name: r.name }));

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error calling Brevo API:', error);
    throw error;
  }
}
