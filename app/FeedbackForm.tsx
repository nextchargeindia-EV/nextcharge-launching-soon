'use client';

import { useState, FormEvent } from 'react';

export default function FeedbackForm() {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        setSubmitting(true);
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    location: formData.get('location'),
                    problem: formData.get('problem'),
                }),
            });

            if (res.ok) {
                setMessage('Thank you for your feedback! It helps us build a better network.');
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
        <form className="glass-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <input type="text" name="name" placeholder="Your Name" required aria-label="Your Name" minLength={2} maxLength={50} />
                <input type="email" name="email" placeholder="Email Address" required aria-label="Email Address" />
            </div>
            <div className="form-row">
                <input type="tel" name="phone" placeholder="Phone Number" required aria-label="Phone Number" />
                <input type="text" name="location" placeholder="City / Location" required aria-label="City or Location" minLength={2} maxLength={100} />
            </div>
            <div className="form-row">
                <textarea name="problem" placeholder="Describe the problems you face (e.g., broken chargers, payment issues...)" rows={4} required aria-label="Describe your problem" minLength={10} maxLength={1000}></textarea>
            </div>
            <button type="submit" className="btn-primary full-width" disabled={submitting}>
                <span>{submitting ? 'Submitting...' : 'Share Feedback'}</span>
            </button>
            {message && <p className={`form-message ${messageType}`}>{message}</p>}
        </form>
    );
}
