import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutInteractive from './AboutInteractive';
import './about.css';

export const metadata: Metadata = {
    title: "About Us — NextCharge (NEXQ) | India's Smartest EV Charging Network",
    description:
        "Learn how NextCharge (NEXQ) is solving EV range anxiety across India. We build ultra-fast EV charging hubs, AI-powered route planning, and unified charging solutions.",
    keywords:
        "About NextCharge, NEXQ EV network, EV charging company India, EV fast charger infrastructure, AI trip planner EV, electric vehicle charging network India",
    alternates: {
        canonical: "https://www.nextcharge.in/about",
    },
    openGraph: {
        type: "website",
        url: "https://www.nextcharge.in/about",
        title: "About Us — NextCharge | Building India's Smartest EV Network",
        description:
            "NextCharge is on a mission to power seamless electric mobility across India with ultra-fast chargers and AI-driven navigation.",
        images: [{ url: "https://www.nextcharge.in/nexq-logo.png" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us — NextCharge | Building India's Smartest EV Network",
        description:
            "Discover how NextCharge is transforming EV charging in India with ultra-fast charging stations and unified smart app integration.",
        images: ["https://www.nextcharge.in/nexq-logo.png"],
    },
};

// SEO & GEO (Generative Engine Optimization) Schema Structured Data
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "AboutPage",
            "@id": "https://www.nextcharge.in/about#webpage",
            url: "https://www.nextcharge.in/about",
            name: "About Us — NextCharge (NEXQ)",
            description:
                "NextCharge is building India's default smart EV charging network with ultra-fast stations, AI-powered trip planning, and seamless app management.",
            isPartOf: {
                "@type": "WebSite",
                "@id": "https://www.nextcharge.in/#website",
                name: "NextCharge",
                url: "https://www.nextcharge.in/",
            },
        },
        {
            "@type": "Organization",
            "@id": "https://www.nextcharge.in/#organization",
            name: "NextCharge",
            alternateName: "NEXQ",
            url: "https://www.nextcharge.in/",
            logo: "https://www.nextcharge.in/nexq-logo.png",
            email: "contact@nextcharge.in",
            telephone: ["+918208746187", "+917507902116"],
            slogan: "India's Smartest EV Charging Network",
            knowsAbout: [
                "Electric Vehicles",
                "EV Fast Charging Stations",
                "AI EV Trip Planner",
                "Intercity Highway EV Infrastructure",
                "CCS2 DC Fast Charging",
            ],
            sameAs: [
                "https://instagram.com/nextcharge.india",
                "https://linkedin.com/company/nextcharge-india",
                "https://twitter.com/nextchargeindia",
            ],
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.nextcharge.in/",
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "About Us",
                    item: "https://www.nextcharge.in/about",
                },
            ],
        },
        {
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: "What is NextCharge (NEXQ)?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "NextCharge (NEXQ) is building India's smartest unified EV charging network. It combines high-speed DC charging stations, an AI-powered trip planner, and an all-in-one mobile app to make EV charging dependable and frictionless across Indian cities and national highways.",
                    },
                },
                {
                    "@type": "Question",
                    name: "How does NextCharge solve EV charging issues in India?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "NextCharge addresses offline chargers, fragmented app ecosystems, and range anxiety by deploying ultra-reliable fast chargers with 99.9% uptime monitoring, real-time station availability, transparent billing, and intelligent route planning tailored to Indian driving conditions.",
                    },
                },
                {
                    "@type": "Question",
                    name: "Which electric vehicles are compatible with NextCharge?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "NextCharge stations support universal charging standards including CCS2 DC fast charging and Type-2 AC charging, making them compatible with all major EV brands in India such as Tata Motors (Nexon, Punch, Tiago EV), MG (ZS EV, Comet), Hyundai (Ioniq 5), Mahindra (XUV400), BYD, Kia, and 2W/3W fleets.",
                    },
                },
                {
                    "@type": "Question",
                    name: "How can property hosts partner with NextCharge?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Commercial property owners, hotel operators, highway restaurants, and parking space owners can partner with NextCharge to install EV fast chargers on their premises, turning idle land or parking lots into high-yield revenue assets.",
                    },
                },
            ],
        },
    ],
};

export default function AboutPage() {
    return (
        <>
            {/* Inject JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Background image & gradient overlay */}
            <div className="video-background-container">
                <Image
                    src="/bg-placeholder.webp"
                    alt="NextCharge EV Network Background"
                    id="bg-image"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div className="video-overlay"></div>
            </div>

            <main className="main-wrapper">
                <Navbar />

                {/* Hero Header */}
                <section className="container" style={{ paddingTop: '130px', paddingBottom: '60px' }}>
                    <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
                        <div className="badge" style={{ display: 'inline-block', marginBottom: '20px' }}>
                            ABOUT NEXTCHARGE (NEXQ)
                        </div>
                        <h1 className="headline" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: '1.2' }}>
                            Accelerating India&apos;s Transition to{' '}
                            <span className="highlight-text">Electric Mobility.</span>
                        </h1>
                        <p className="subheadline" style={{ marginTop: '20px', fontSize: '1.15rem', color: 'var(--text-muted)' }}>
                            We are building India&apos;s default EV charging network. By integrating ultra-fast charging hardware, real-time diagnostic telematics, and AI route planning, NextCharge eliminates range anxiety for every EV driver in India.
                        </p>
                    </div>
                </section>

                {/* Key Metrics / Highlights Grid */}
                <section className="container" style={{ marginBottom: '70px' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        <div className="feature-card" style={cardStyle}>
                            <div style={numberStyle}>99.9%</div>
                            <h3 style={cardTitleStyle}>Target Network Uptime</h3>
                            <p style={cardTextStyle}>
                                Continuous automated monitoring to ensure chargers are operational when you arrive.
                            </p>
                        </div>
                        <div className="feature-card" style={cardStyle}>
                            <div style={numberStyle}>100kW+</div>
                            <h3 style={cardTitleStyle}>Ultra-Fast DC Charging</h3>
                            <p style={cardTextStyle}>
                                Rapid charging capabilities designed to add 200+ km of range in under 25 minutes.
                            </p>
                        </div>
                        <div className="feature-card" style={cardStyle}>
                            <div style={numberStyle}>AI-Native</div>
                            <h3 style={cardTitleStyle}>Smart Route Planning</h3>
                            <p style={cardTextStyle}>
                                Intelligent elevation, weather, battery degradation, and live charger status calculations.
                            </p>
                        </div>
                        <div className="feature-card" style={cardStyle}>
                            <div style={numberStyle}>Pan-India</div>
                            <h3 style={cardTitleStyle}>Highway Corridors</h3>
                            <p style={cardTextStyle}>
                                Connecting key national highways and Tier 1, 2, and 3 cities seamlessly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="section-container" style={{ background: 'rgba(11, 14, 39, 0.65)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <h2 className="section-title">Our Vision & Mission</h2>
                            <p className="section-subtitle">
                                Built by EV enthusiasts and infrastructure engineers to fix the broken charging ecosystem.
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '30px',
                            }}
                        >
                            <div style={glassBoxStyle}>
                                <div style={iconBadgeStyle}>🎯</div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '14px', color: 'var(--primary-color)' }}>
                                    The Challenge We are Solving
                                </h3>
                                <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '0.98rem' }}>
                                    EV owners in India frequently encounter offline chargers, long queues, incompatible plugs, and a fragmented landscape of dozens of different apps. This friction slows down electric vehicle adoption and creates unnecessary travel anxiety.
                                </p>
                            </div>

                            <div style={glassBoxStyle}>
                                <div style={iconBadgeStyle}>🚀</div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '14px', color: 'var(--primary-color)' }}>
                                    Our Solution
                                </h3>
                                <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '0.98rem' }}>
                                    NextCharge delivers a unified experience. One app to discover chargers, reserve slots, start charging via Auto-Plug & Charge or RFID, and pay securely. We combine high-reliability hardware with intelligent software to make charging as natural as parking.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive Components Section */}
                <AboutInteractive />

                {/* Call To Action Banner */}
                <section className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <div style={ctaBannerStyle}>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '16px' }}>
                            Be Part of India&apos;s EV Revolution
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 30px' }}>
                            Join our early access waitlist to receive launch updates, exclusive charging discounts, and early access to the NextCharge mobile app.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/#waitlist" className="cta-btn-orange">
                                Join Waitlist
                            </Link>
                            <Link href="/#partners" className="cta-btn-outline">
                                Become a Partner
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}

// Inline Styles for Visual Polish
const cardStyle: React.CSSProperties = {
    background: 'rgba(245, 246, 241, 0.04)',
    border: '1px solid rgba(245, 246, 241, 0.1)',
    borderRadius: '16px',
    padding: '30px 24px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
};

const numberStyle: React.CSSProperties = {
    fontSize: '2.4rem',
    fontWeight: '800',
    color: 'var(--primary-color)',
    marginBottom: '10px',
    letterSpacing: '-0.5px',
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.15rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#ffffff',
};

const cardTextStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
};

const glassBoxStyle: React.CSSProperties = {
    background: 'rgba(245, 246, 241, 0.03)',
    border: '1px solid rgba(245, 246, 241, 0.08)',
    borderRadius: '20px',
    padding: '36px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
};

const iconBadgeStyle: React.CSSProperties = {
    fontSize: '2rem',
    marginBottom: '16px',
};

const featureBoxStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.025)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '28px',
};

const featureTitleStyle: React.CSSProperties = {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '10px',
};

const featureTextStyle: React.CSSProperties = {
    fontSize: '0.92rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
};

const faqCardStyle: React.CSSProperties = {
    background: 'rgba(245, 246, 241, 0.03)',
    border: '1px solid rgba(245, 246, 241, 0.08)',
    borderRadius: '14px',
    padding: '24px',
};

const faqQuestionStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '10px',
};

const faqAnswerStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
};

const ctaBannerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255, 90, 34, 0.15) 0%, rgba(22, 26, 58, 0.8) 100%)',
    border: '1px solid rgba(255, 90, 34, 0.3)',
    borderRadius: '24px',
    padding: '60px 30px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
};
