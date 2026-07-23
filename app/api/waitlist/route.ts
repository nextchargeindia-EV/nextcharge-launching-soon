import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendEmailNotification } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string' || email.length > 254) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();

        const { error } = await supabaseAdmin
            .from('waitlist')
            .insert({ email: cleanEmail });

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
            }
            console.error('Waitlist insert error:', error);
            return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
        }

        // Send instant email notification
        await sendEmailNotification({
            subject: `⚡ New Waitlist Signup: ${cleanEmail}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #111;">
                    <h2 style="color: #ff5a22;">New Early Access / Waitlist Signup</h2>
                    <p>A new user just requested early access on NextCharge!</p>
                    <hr />
                    <p><strong>Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
                    <p style="font-size: 0.85rem; color: #666;">Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
                </div>
            `,
        });

        return NextResponse.json({ message: 'Successfully joined the waitlist!' }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
