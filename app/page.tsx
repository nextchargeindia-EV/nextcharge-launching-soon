import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import WaitlistForm from './WaitlistForm';
import FeedbackForm from './FeedbackForm';
import PartnerForm from './PartnerForm';

export const revalidate = 10;

async function getLatestPosts() {
    if (!isSupabaseConfigured) return [];
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('id, title, slug, excerpt, cover_image_url, category, created_at, content')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) {
            console.error('Error fetching latest blog posts:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('Exception fetching latest blog posts:', err);
        return [];
    }
}

export default async function Home() {
    const latestPosts = await getLatestPosts();

    return (
        <>
            <div className="video-background-container">
                <Image src="/bg-placeholder.webp" alt="Background" id="bg-image" fill style={{ objectFit: 'cover' }} priority />
                <div className="video-overlay"></div>
            </div>

            <main className="main-wrapper">
                <Navbar />

                {/* Hero Section */}
                <section className="hero-section container">
                    <div className="hero-content">
                        <div className="badge">NextCharge will be the default EV charging network</div>
                        <h1 className="headline">
                            Launching Soon<br />
                            <span className="highlight-text"> India&apos;s Smartest EV Charging Network.</span>
                        </h1>
                        <p className="subheadline">
                            NextCharge is building an EV charging smart network with ultra-fast and smart EV charging stations.
                            A smart app that lets you manage everything all-in-one with an AI-powered trip planner.
                        </p>

                        <WaitlistForm />

                        <div className="features">
                            <div className="feature-item">
                                <div className="icon"></div>
                                <span>Ultra-Fast Stations</span>
                            </div>
                            <div className="feature-item">
                                <div className="icon"></div>
                                <span>AI Trip Planner</span>
                            </div>
                            <div className="feature-item">
                                <div className="icon"></div>
                                <span>All-In-One App</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feedback Section */}
                <section className="section-container" id="feedback">
                    <div className="section-content">
                        <h2 className="section-title">Facing issues with EV charging?</h2>
                        <p className="section-subtitle">Tell us about the problems you encounter. We are building NextCharge to solve them.</p>
                        <FeedbackForm />
                    </div>
                </section>

                {/* App Coming Soon Section */}
                <section className="section-container" id="app">
                    <div className="section-content">
                        <Image src="/q-app-icon.png" alt="NEXQ App Icon" className="app-icon" width={100} height={100} />
                        <h2 className="section-title">The Unified App is Coming Soon</h2>
                        <p className="section-subtitle">Experience the ultimate EV charging ecosystem right from your pocket. Unifying your experience on iOS and Android.</p>
                        <div className="app-store-buttons">
                            <a href="#" className="store-badge" aria-label="Download on the App Store" rel="noopener noreferrer">
                                <svg className="store-icon" viewBox="0 0 384 512" width="28" height="28">
                                    <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                </svg>
                                <div className="store-text">
                                    <span className="store-small">Download on the</span>
                                    <span className="store-large">App Store</span>
                                </div>
                            </a>
                            <a href="#" className="store-badge" aria-label="Get it on Google Play" rel="noopener noreferrer">
                                <svg className="store-icon" viewBox="0 0 512 512" width="28" height="28">
                                    <path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                                </svg>
                                <div className="store-text">
                                    <span className="store-small">GET IT ON</span>
                                    <span className="store-large">Google Play</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Business Partners Section */}
                <section className="section-container" id="partners">
                    <div className="section-content partner-section-content">
                        <h2 className="section-title">Partner with NextCharge</h2>
                        <p className="section-subtitle">Are you a hotel owner, commercial property owner, or fleet operator? Turn your parking space into a revenue-generating asset with our ultra-fast smart chargers.</p>

                        <div className="partner-cards">
                            <div className="partner-card">
                                <div className="partner-img-wrapper">
                                    <Image src="/hotel.webp" alt="Hotel Owners" className="partner-img" width={400} height={200} style={{ objectFit: 'cover', width: '100%', height: '200px', borderRadius: '16px' }} />
                                    <span className="partner-badge">Hotels & Resorts</span>
                                </div>
                                <h3>Hotel Owners</h3>
                                <p>Attract premium EV drivers to stay at your property by offering reliable, high-speed charging infrastructure.</p>
                            </div>
                            <div className="partner-card">
                                <div className="partner-img-wrapper">
                                    <Image src="/commercial.jpg" alt="Commercial Properties" className="partner-img" width={400} height={200} style={{ objectFit: 'cover', width: '100%', height: '200px', borderRadius: '16px' }} />
                                    <span className="partner-badge">Malls & Retail</span>
                                </div>
                                <h3>Commercial Properties</h3>
                                <p>Monetize your parking spaces and increase customer dwell time & footfall across malls, offices, and hubs.</p>
                            </div>
                            <div className="partner-card">
                                <div className="partner-img-wrapper">
                                    <Image src="/fleet.webp" alt="Fleet Operators" className="partner-img" width={400} height={200} style={{ objectFit: 'cover', width: '100%', height: '200px', borderRadius: '16px' }} />
                                    <span className="partner-badge">Fleets & Depots</span>
                                </div>
                                <h3>Fleet Operators</h3>
                                <p>Smarter, high-uptime charging solutions tailored for electric commercial fleets, logistics, and transit buses.</p>
                            </div>
                        </div>

                        <PartnerForm />
                    </div>
                </section>

                {/* Blog Section */}
                <section className="section-container" id="latest-blog">
                    <div className="section-content">
                        <h2 className="section-title">Latest from our Blog</h2>
                        <p className="section-subtitle">Insights, tips, and updates about the EV ecosystem in India.</p>

                        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
                            {latestPosts.length > 0 ? (
                                latestPosts.map((post, index) => (
                                    <BlogCard key={post.id} post={post} index={index} />
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4 }}>📭</div>
                                    <h3>No articles published yet</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>Check back soon for latest insights!</p>
                                </div>
                            )}
                        </div>

                        <div className="blog-view-all-container">
                            <a href="/blog" className="btn-primary">
                                <span>View All Articles</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
