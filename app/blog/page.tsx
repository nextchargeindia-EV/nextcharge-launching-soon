import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import BlogSearch from './BlogSearch';
import './blog.css';

export const metadata: Metadata = {
    title: 'Blog — NextCharge | EV Charging Insights & Updates',
    description: 'Stay updated with the latest news, EV route guides, charging station reviews, and tips about EV charging in India from NextCharge.',
    alternates: {
        canonical: 'https://www.nextcharge.in/blog',
    },
    openGraph: {
        type: 'website',
        url: 'https://www.nextcharge.in/blog',
        title: 'Blog — NextCharge | EV Charging Insights & Updates',
        description: 'Stay updated with the latest news, EV route guides, charging station reviews, and tips about EV charging in India from NextCharge.',
        images: [{ url: 'https://www.nextcharge.in/nexq-logo.png' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog — NextCharge | EV Charging Insights & Updates',
        description: 'Stay updated with the latest news, EV route guides, charging station reviews, and tips about EV charging in India from NextCharge.',
        images: ['https://www.nextcharge.in/nexq-logo.png'],
    },
};

const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://www.nextcharge.in/blog#blog',
    name: 'NextCharge EV Insights & Updates',
    url: 'https://www.nextcharge.in/blog',
    description: 'Comprehensive guides, EV charging tips, highway route reviews, and news for electric vehicle drivers in India.',
    publisher: {
        '@type': 'Organization',
        name: 'NextCharge',
        logo: {
            '@type': 'ImageObject',
            url: 'https://www.nextcharge.in/nexq-logo.png',
        },
    },
};

export const revalidate = 10;

async function getAllPublishedPosts() {
    if (!isSupabaseConfigured) return [];
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('id, title, slug, excerpt, cover_image_url, category, tags, created_at')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching published posts:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('Exception fetching published posts:', err);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getAllPublishedPosts();
    const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
            />

            {/* Ambient Background Glows */}
            <div className="ambient-glow-container">
                <div className="glow-circle glow-1"></div>
                <div className="glow-circle glow-2"></div>
                <div className="glow-circle glow-3"></div>
            </div>

            <main className="main-wrapper">
                <Navbar />

                <section className="blog-hero">
                    <div className="blog-hero-glow"></div>
                    <h1 className="blog-hero-title">NextCharge Blog</h1>
                    <p className="blog-hero-subtitle">Insights, updates, and stories from India&apos;s smartest EV charging network.</p>

                    <BlogSearch posts={posts} categories={categories} />
                </section>

                <Footer />
            </main>
        </>
    );
}
