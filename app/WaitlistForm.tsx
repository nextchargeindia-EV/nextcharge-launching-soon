'use client';

import { useState, FormEvent } from 'react';

export default function WaitlistForm() {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get('email') as string;

        if (!email) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setMessage("You're on the list! We'll notify you when we launch.");
                setMessageType('success');
                form.reset();
            } else {
                const data = await res.json();
                setMessage(data.error || 'Oops! There was a problem.');
                setMessageType('error');
            }
        } catch {
            setMessage('Oops! There was a problem submitting.');
            setMessageType('error');
        }
        setSubmitting(false);
        setTimeout(() => { setMessage(''); setMessageType(''); }, 5000);
    }

    return (
        <form className="waitlist-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <input type="email" name="email" placeholder="Enter your email address" required aria-label="Email address" />
                <button type="submit" className="btn-primary" disabled={submitting}>
                    <span>{submitting ? 'Submitting...' : 'Get Early Access'}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            {message && <p className={`form-message ${messageType}`}>{message}</p>}
        </form>
    );
}
