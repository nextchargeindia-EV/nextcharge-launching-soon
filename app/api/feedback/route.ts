import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendEmailNotification } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, location, problem } = body;

        if (!name || typeof name !== 'string' || !email || typeof email !== 'string' || !problem || typeof problem !== 'string') {
            return NextResponse.json({ error: 'Name, email, and feedback are required' }, { status: 400 });
        }

        if (name.length > 100 || email.length > 254 || problem.length > 2000) {
            return NextResponse.json({ error: 'Input length exceeds maximum allowed limit' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const cleanName = name.trim().slice(0, 100);
        const cleanEmail = email.toLowerCase().trim().slice(0, 254);
        const cleanPhone = typeof phone === 'string' ? phone.trim().slice(0, 30) : null;
        const cleanLocation = typeof location === 'string' ? location.trim().slice(0, 100) : null;
        const cleanProblem = problem.trim().slice(0, 2000);

        const { error } = await supabaseAdmin
            .from('feedback')
            .insert({
                name: cleanName,
                email: cleanEmail,
                phone: cleanPhone,
                location: cleanLocation,
                problem: cleanProblem,
            });

        if (error) {
            console.error('Feedback insert error:', error);
            return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
        }

        // Send instant email notification
        await sendEmailNotification({
            subject: `💬 New EV Feedback from ${cleanName} (${cleanLocation || 'India'})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #111;">
                    <h2 style="color: #ff5a22;">New EV Feedback Received</h2>
                    <p>A user submitted feedback on NextCharge:</p>
                    <hr />
                    <p><strong>Name:</strong> ${cleanName}</p>
                    <p><strong>Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
                    <p><strong>Phone:</strong> ${cleanPhone || 'N/A'}</p>
                    <p><strong>Location / City:</strong> ${cleanLocation || 'N/A'}</p>
                    <p><strong>Problem / Feedback:</strong></p>
                    <blockquote style="background: #f4f4f4; padding: 12px; border-left: 4px solid #ff5a22; margin: 0;">${cleanProblem}</blockquote>
                    <p style="font-size: 0.85rem; color: #666; margin-top: 20px;">Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
                </div>
            `,
        });

        return NextResponse.json({ message: 'Feedback submitted successfully!' }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
