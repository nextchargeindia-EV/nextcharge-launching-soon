export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-nav" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '16px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <a href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</a>
                <a href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</a>
                <a href="/#feedback" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Feedback</a>
                <a href="/#partners" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Partners</a>
            </div>
            <div className="footer-contact">
                <a href="mailto:contact@nextcharge.in">contact@nextcharge.in</a>
                <a href="tel:+918208746187">+91 8208746187</a>
                <a href="tel:+917507902116">+91 7507902116</a>
            </div>
            <div className="footer-socials">
                <a href="https://www.instagram.com/nextcharge.in/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                </a>
                <a href="https://www.linkedin.com/company/next-charge/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                </a>
                <a href="https://x.com/nextchargeindia" target="_blank" rel="noopener noreferrer" aria-label="X">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </a>
            </div>
            <p>&copy; 2026 NextCharge. Made with <span className="highlight">❤︎⁠</span> in India.</p>
        </footer>
    );
}
