'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="logo">
                <Link href="/">
                    <Image src="/nexq-logo.png" alt="NEXQ" className="nav-logo" width={80} height={20} style={{ width: 'auto', height: 'auto' }} />
                    <span className="logo-subtitle">NextCharge</span>
                </Link>
            </div>

            <button
                className={`mobile-menu-btn${menuOpen ? ' active' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav-menu-wrapper${menuOpen ? ' active' : ''}`} id="navMenuWrapper">
                <ul className="nav-links">
                    <li><a href="/#feedback" onClick={() => setMenuOpen(false)}>Feedback</a></li>
                    <li><a href="/#app" onClick={() => setMenuOpen(false)}>App</a></li>
                    <li><a href="/#partners" onClick={() => setMenuOpen(false)}>Partners</a></li>
                    <li><Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
                </ul>

                <div className="nav-contact-info">
                    <a href="mailto:contact@nextcharge.in">contact@nextcharge.in</a>
                    <span className="separator">|</span>
                    <a href="tel:+918208746187">+91 8208746187</a>
                    <span className="separator">|</span>
                    <a href="tel:+917507902116">+91 7507902116</a>
                </div>
            </div>
        </nav>
    );
}
