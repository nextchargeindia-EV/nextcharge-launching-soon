'use client';

import { useState, FormEvent } from 'react';

export default function PartnerForm() {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        setSubmitting(true);
        try {
            const res = await fetch('/api/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('partner_name'),
                    business_type: formData.get('business_type'),
                    email: formData.get('partner_email'),
                    phone: formData.get('partner_phone'),
                }),
            });

            if (res.ok) {
                setMessage('Thanks for your interest! Our team will reach out to you shortly.');
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
        <form className="glass-form mt-4" onSubmit={handleSubmit}>
            <h3 className="form-title">Request a Consultation</h3>
            <div className="form-row">
                <input type="text" name="partner_name" placeholder="Name" required aria-label="Partner Name" minLength={2} maxLength={50} />
                <input type="text" name="business_type" placeholder="Business Type (Hotel, Mall, etc.)" required aria-label="Business Type" minLength={2} maxLength={100} />
            </div>
            <div className="form-row">
                <input type="email" name="partner_email" placeholder="Email Address" required aria-label="Partner Email" />
                <input type="tel" name="partner_phone" placeholder="Phone Number" required aria-label="Partner Phone Number" />
            </div>
            <button type="submit" className="btn-primary full-width" disabled={submitting}>
                <span>{submitting ? 'Submitting...' : 'Partner With Us'}</span>
            </button>
            {message && <p className={`form-message ${messageType}`}>{message}</p>}
        </form>
    );
}
