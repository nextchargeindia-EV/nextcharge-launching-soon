import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendEmailNotification } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, business_type, email, phone } = body;

        if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        if (name.length > 100 || email.length > 254) {
            return NextResponse.json({ error: 'Input length exceeds maximum allowed limit' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const cleanName = name.trim().slice(0, 100);
        const cleanBusinessType = typeof business_type === 'string' ? business_type.trim().slice(0, 100) : null;
        const cleanEmail = email.toLowerCase().trim().slice(0, 254);
        const cleanPhone = typeof phone === 'string' ? phone.trim().slice(0, 30) : null;

        const { error } = await supabaseAdmin
            .from('partner_inquiries')
            .insert({
                name: cleanName,
                business_type: cleanBusinessType,
                email: cleanEmail,
                phone: cleanPhone,
            });

        if (error) {
            console.error('Partner inquiry insert error:', error);
            return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
        }

        // Send instant email notification
        await sendEmailNotification({
            subject: `🤝 New Business Partner Lead: ${cleanName} (${cleanBusinessType || 'Partner'})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #111;">
                    <h2 style="color: #ff5a22;">New Partner Consultation Request</h2>
                    <p>A new potential partner requested a consultation on NextCharge:</p>
                    <hr />
                    <p><strong>Name:</strong> ${cleanName}</p>
                    <p><strong>Business Type:</strong> ${cleanBusinessType || 'N/A'}</p>
                    <p><strong>Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
                    <p><strong>Phone:</strong> ${cleanPhone || 'N/A'}</p>
                    <p style="font-size: 0.85rem; color: #666; margin-top: 20px;">Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
                </div>
            `,
        });

        return NextResponse.json({ message: 'Partner inquiry submitted successfully!' }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
