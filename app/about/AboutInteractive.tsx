'use client';

import { useState } from 'react';

// EV Specs database for interactive calculator
const EV_MODELS = [
    { id: 'nexon', name: 'Tata Nexon EV (40.5 kWh)', batteryKwh: 40.5, fastChargeMins: 28, kmPerKwh: 7.2 },
    { id: 'zs', name: 'MG ZS EV (50.3 kWh)', batteryKwh: 50.3, fastChargeMins: 32, kmPerKwh: 6.8 },
    { id: 'tiago', name: 'Tata Tiago EV (24 kWh)', batteryKwh: 24.0, fastChargeMins: 20, kmPerKwh: 8.5 },
    { id: 'xuv400', name: 'Mahindra XUV400 (39.4 kWh)', batteryKwh: 39.4, fastChargeMins: 26, kmPerKwh: 7.0 },
    { id: 'ioniq5', name: 'Hyundai Ioniq 5 (72.6 kWh)', batteryKwh: 72.6, fastChargeMins: 18, kmPerKwh: 6.2 },
    { id: 'atto3', name: 'BYD Atto 3 (60.4 kWh)', batteryKwh: 60.4, fastChargeMins: 35, kmPerKwh: 6.5 },
];

// Corridor dataset
const HIGHWAY_CORRIDORS = [
    {
        id: 'delhi-jaipur',
        name: 'Delhi ➔ Jaipur (NH48)',
        distance: '280 km',
        interval: 'Every 35 km',
        speed: '120 kW Ultra-Fast DC',
        amenities: '24/7 Rest Stop, Cafe, Washrooms, Canopy',
        status: 'Active Hubs',
    },
    {
        id: 'mumbai-pune',
        name: 'Mumbai ➔ Pune Express',
        distance: '150 km',
        interval: 'Every 25 km',
        speed: '150 kW Dual-Gun DC',
        amenities: 'Food Court, EV Lounge, 24/7 Security',
        status: 'Active Hubs',
    },
    {
        id: 'bengaluru-chennai',
        name: 'Bengaluru ➔ Chennai (NH44)',
        distance: '340 km',
        interval: 'Every 40 km',
        speed: '120 kW Fast DC',
        amenities: 'Highway Plaza, Coffee Hub, Rest Area',
        status: 'Expanding',
    },
    {
        id: 'yamuna-expressway',
        name: 'Delhi ➔ Agra (Yamuna Expy)',
        distance: '210 km',
        interval: 'Every 30 km',
        speed: '100 kW Dual-Gun DC',
        amenities: 'Plaza Food Court, Family Restroom, Solar Canopy',
        status: 'Active Hubs',
    },
];

// Accordion dataset
const FAQ_DATA = [
    {
        category: 'drivers',
        question: 'What makes NextCharge faster and more reliable than other networks?',
        answer: 'NextCharge deploys heavy-duty 100kW+ liquid-cooled & air-cooled DC fast chargers with dual-gun redundancy. Our telematics monitoring system runs automated health diagnostic pings every 30 seconds, catching issues remotely before a driver even arrives.',
    },
    {
        category: 'drivers',
        question: 'How does the AI Trip Planner eliminate range anxiety?',
        answer: 'Unlike basic map apps that calculate distance in a straight line, NextCharge\'s AI Trip Planner factors in your specific vehicle model, real-time elevation topology, ambient temperature, AC load, and live charger availability to guarantee you reach every station with battery margin to spare.',
    },
    {
        category: 'hosts',
        question: 'How can commercial property owners turn parking lots into revenue hubs?',
        answer: 'NextCharge offers turnkey host solutions. We provide hardware installation, grid synchronization, automated host payouts, and listed visibility on our app. Host partners earn passive monthly revenue from every kWh dispensed.',
    },
    {
        category: 'hosts',
        question: 'What power grid requirements are needed for a NextCharge DC Fast Charger?',
        answer: 'Our team conducts site surveys to assess 3-phase commercial grid capacity (typically 30kW to 150kW loads). We also support hybrid solar + energy storage buffer systems for locations with limited grid transformer headroom.',
    },
    {
        category: 'tech',
        question: 'Which charging connectors and protocols does NextCharge support?',
        answer: 'NextCharge stations adhere to strict international and Indian standards: CCS Combo-2 (CCS2) for DC Fast Charging, Type-2 for AC Fast Charging, and OCCP 1.6J / 2.0.1 protocol backend integration.',
    },
];

export default function AboutInteractive() {
    // 1. Ecosystem Tabs State
    const [activeTab, setActiveTab] = useState<'drivers' | 'hosts' | 'fleets'>('drivers');

    // 2. EV Calculator State
    const [selectedEvId, setSelectedEvId] = useState<string>('nexon');
    const [monthlyKm, setMonthlyKm] = useState<number>(1500);

    // 3. FAQ Filter & Accordion State
    const [faqFilter, setFaqFilter] = useState<'all' | 'drivers' | 'hosts' | 'tech'>('all');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Calculator Math
    const currentEv = EV_MODELS.find(e => e.id === selectedEvId) || EV_MODELS[0];
    const annualKm = monthlyKm * 12;

    // Petrol cost assumption: ₹100/L @ 14 km/L = ~₹7.14 per km
    // EV charging cost assumption: ~₹1.20 per km on NextCharge
    const annualPetrolCost = annualKm * 7.14;
    const annualEvCost = annualKm * 1.20;
    const annualSavings = Math.round(annualPetrolCost - annualEvCost);

    // CO2 offset: approx 120g CO2 saved per km
    const co2SavedKg = Math.round((annualKm * 120) / 1000);

    const filteredFaqs = faqFilter === 'all'
        ? FAQ_DATA
        : FAQ_DATA.filter(f => f.category === faqFilter);

    return (
        <div className="about-interactive-container">
            {/* Interactive Tabbed Ecosystem Section */}
            <section className="container" style={{ margin: '60px auto 90px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div className="badge" style={{ display: 'inline-block', marginBottom: '16px' }}>
                        INTERACTIVE ECOSYSTEM EXPLORER
                    </div>
                    <h2 className="section-title">Built for Everyone in the EV Mobility Chain</h2>
                    <p className="section-subtitle">Select a perspective below to see how NextCharge powers your journey.</p>
                </div>

                {/* Tab Switcher */}
                <div className="tabs-header">
                    <button
                        className={`tab-btn${activeTab === 'drivers' ? ' active' : ''}`}
                        onClick={() => setActiveTab('drivers')}
                    >
                        <span>🚗</span> EV Drivers
                    </button>
                    <button
                        className={`tab-btn${activeTab === 'hosts' ? ' active' : ''}`}
                        onClick={() => setActiveTab('hosts')}
                    >
                        <span>🏨</span> Property & Highway Hosts
                    </button>
                    <button
                        className={`tab-btn${activeTab === 'fleets' ? ' active' : ''}`}
                        onClick={() => setActiveTab('fleets')}
                    >
                        <span>🚚</span> Commercial Fleets
                    </button>
                </div>

                {/* Tab Content Cards */}
                {activeTab === 'drivers' && (
                    <div className="tab-content-grid">
                        <div className="interactive-card">
                            <span className="card-badge-pill">Zero Range Anxiety</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                ⚡ Live Charger Telematics
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                Know before you arrive. Check real-time gun status, queue status, charging speeds, and price per kWh directly on the NextCharge unified app.
                            </p>
                        </div>
                        <div className="interactive-card">
                            <span className="card-badge-pill">AI Intelligence</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                🗺️ Predictive Route Planner
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                Automatically plans your charging stops based on battery state-of-charge, air conditioning consumption, and terrain elevation profile.
                            </p>
                        </div>
                        <div className="interactive-card">
                            <span className="card-badge-pill">Frictionless Pay</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                📲 1-Tap Auto-Plug & Charge
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                Plug in the CCS2 gun and charging starts automatically via encrypted RFID or wallet integration with instant invoice receipts.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'hosts' && (
                    <div className="tab-content-grid">
                        <div className="interactive-card">
                            <span className="card-badge-pill">Passive Revenue</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                💰 Turn Idle Parking Into Profit
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                Earn automated monthly revenue shares on every unit of power sold at your hotel, highway restaurant, shopping complex, or parking space.
                            </p>
                        </div>
                        <div className="interactive-card">
                            <span className="card-badge-pill">Turnkey Hardware</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                🛠️ Full Installation & Maintenance
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                NextCharge handles site engineering, transformer load balancing, 24/7 remote monitoring, and physical maintenance.
                            </p>
                        </div>
                        <div className="interactive-card">
                            <span className="card-badge-pill">Increased Footfall</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                📍 High-Value Customer Footfall
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                Attract premium EV drivers to your venue who stay and spend at your restaurant or retail store while their vehicle charges.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'fleets' && (
                    <div className="tab-content-grid">
                        <div className="interactive-card">
                            <span className="card-badge-pill">High Uptime</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                ⚡ Dedicated Fast Charging Hubs
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                Guaranteed charging slot reservations and high-speed DC depots tailored for 2W, 3W, and 4W commercial delivery fleets.
                            </p>
                        </div>
                        <div className="interactive-card">
                            <span className="card-badge-pill">Central Control</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                📊 Fleet Management Dashboard
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                Real-time driver telemetry, centralized billing, automated GST invoicing, and custom API integrations for logistic fleets.
                            </p>
                        </div>
                        <div className="interactive-card">
                            <span className="card-badge-pill">Cost Optimization</span>
                            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', fontWeight: '700' }}>
                                🏷️ Bulk Corporate Rates
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                                Enjoy discounted off-peak tariff rates and customized billing contracts for high-volume commercial electric vehicle operations.
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Interactive EV Savings & Charging Speed Calculator */}
            <section className="container" style={{ marginBottom: '100px' }}>
                <div className="calculator-box">
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div className="badge" style={{ display: 'inline-block', marginBottom: '12px' }}>
                            INTERACTIVE CALCULATOR
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#fff', fontWeight: '800' }}>
                            Calculate Your EV Savings & Charging Performance
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.95rem' }}>
                            See how much you save driving electric with NextCharge fast chargers.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
                        {/* Controls */}
                        <div>
                            <label style={{ display: 'block', color: '#fff', fontWeight: '700', marginBottom: '10px', fontSize: '0.95rem' }}>
                                Select Your EV Model:
                            </label>
                            <select
                                className="calc-select"
                                value={selectedEvId}
                                onChange={(e) => setSelectedEvId(e.target.value)}
                            >
                                {EV_MODELS.map(ev => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.name}
                                    </option>
                                ))}
                            </select>

                            <div className="range-slider-wrapper">
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.92rem', fontWeight: '600', marginBottom: '8px' }}>
                                    <span>Monthly Driving Distance:</span>
                                    <span style={{ color: 'var(--primary-color)', fontWeight: '800' }}>{monthlyKm.toLocaleString()} km / month</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="5000"
                                    step="100"
                                    value={monthlyKm}
                                    onChange={(e) => setMonthlyKm(Number(e.target.value))}
                                    className="range-slider"
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '6px' }}>
                                    <span>500 km</span>
                                    <span>2,500 km</span>
                                    <span>5,000 km</span>
                                </div>
                            </div>
                        </div>

                        {/* Calculated Results */}
                        <div className="calc-results-grid">
                            <div className="calc-result-card">
                                <div className="calc-val">₹{annualSavings.toLocaleString()}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Annual Petrol Savings</div>
                            </div>

                            <div className="calc-result-card">
                                <div className="calc-val">{currentEv.fastChargeMins} mins</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>10% ➔ 80% Fast Charge</div>
                            </div>

                            <div className="calc-result-card">
                                <div className="calc-val">{co2SavedKg.toLocaleString()} kg</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>CO₂ Emissions Offset / Yr</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Highway Corridor Explorer */}
            <section className="section-container" style={{ background: 'rgba(11, 14, 39, 0.7)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '46px' }}>
                        <div className="badge" style={{ display: 'inline-block', marginBottom: '12px' }}>
                            HIGHWAY NETWORK EXPLORER
                        </div>
                        <h2 className="section-title">Key Intercity Fast-Charging Corridors</h2>
                        <p className="section-subtitle">
                            NextCharge is strategically deploying high-speed DC hubs across critical interstate transit routes.
                        </p>
                    </div>

                    <div className="corridor-grid">
                        {HIGHWAY_CORRIDORS.map(corridor => (
                            <div key={corridor.id} className="corridor-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: '700' }}>{corridor.name}</h3>
                                    <span className="corridor-tag">{corridor.status}</span>
                                </div>
                                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div>📍 Route Distance: <strong style={{ color: '#fff' }}>{corridor.distance}</strong></div>
                                    <div>⚡ Station Spacing: <strong style={{ color: 'var(--primary-color)' }}>{corridor.interval}</strong></div>
                                    <div>🔋 Charger Power: <span style={{ color: '#fff' }}>{corridor.speed}</span></div>
                                    <div style={{ marginTop: '6px', fontSize: '0.82rem', color: '#8c99a6' }}>✨ Amenities: {corridor.amenities}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive FAQ Accordion */}
            <section className="container" style={{ margin: '90px auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div className="badge" style={{ display: 'inline-block', marginBottom: '12px' }}>
                        FAQS & INSIGHTS
                    </div>
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <p className="section-subtitle">Everything you need to know about NextCharge (NEXQ)</p>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
                        {(['all', 'drivers', 'hosts', 'tech'] as const).map(filter => (
                            <button
                                key={filter}
                                onClick={() => setFaqFilter(filter)}
                                style={{
                                    background: faqFilter === filter ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
                                    color: '#fff',
                                    border: faqFilter === filter ? '1px solid var(--primary-color)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '6px 16px',
                                    borderRadius: '50px',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {filter === 'all' ? 'All Questions' : filter === 'drivers' ? 'For Drivers' : filter === 'hosts' ? 'For Hosts' : 'Technology'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="accordion-wrapper" style={{ maxWidth: '840px', margin: '0 auto' }}>
                    {filteredFaqs.map((faq, index) => {
                        const isOpen = openFaqIndex === index;
                        return (
                            <div key={index} className={`accordion-item${isOpen ? ' active' : ''}`}>
                                <button
                                    className="accordion-header"
                                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                >
                                    <span>{faq.question}</span>
                                    <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
                                </button>
                                {isOpen && (
                                    <div className="accordion-body">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
