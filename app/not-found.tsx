import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '24px',
            background: 'radial-gradient(circle at top right, #161a3a, #0b0e27 70%)',
            color: '#f5f6f1',
            fontFamily: "'Inter', sans-serif",
        }}>
            <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff5a22, #ff8a5c, #ffbe76)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px',
            }}>
                404
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#8c99a6', marginBottom: '32px', maxWidth: '400px' }}>
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/" style={{
                background: '#ff5a22',
                color: '#000',
                padding: '14px 32px',
                borderRadius: '100px',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(255, 90, 34, 0.4)',
                transition: 'transform 0.3s ease',
            }}>
                Back to Home
            </Link>
        </div>
    );
}
