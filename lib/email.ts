import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const recipientEmail = process.env.NOTIFICATION_EMAIL || 'contact@nextcharge.in';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmailNotification({
    subject,
    html,
}: {
    subject: string;
    html: string;
}) {
    if (!resend) {
        console.log(`[Email Notification Skipped] Set RESEND_API_KEY in .env.local to send live emails to ${recipientEmail}`);
        return { success: false, reason: 'RESEND_API_KEY missing' };
    }

    try {
        const data = await resend.emails.send({
            from: 'NextCharge Website <onboarding@resend.dev>', // Replace with your domain once verified on Resend
            to: [recipientEmail],
            subject: subject,
            html: html,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Failed to send email notification:', error);
        return { success: false, error };
    }
}
