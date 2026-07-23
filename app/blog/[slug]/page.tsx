import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReadingProgress from './ReadingProgress';
import '../blog.css';

interface PostData {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    cover_image_url?: string;
    category?: string;
    tags?: string[];
    author?: string;
    seo_title?: string;
    seo_description?: string;
    created_at: string;
    updated_at?: string;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

async function getPost(slug: string): Promise<PostData | null> {
    if (!isSupabaseConfigured) return null;
    const cleanSlug = (slug || '').trim().replace(/^\/+/g, '').replace(/\/+$/g, '');
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .or(`slug.eq.${cleanSlug},slug.eq./${cleanSlug}`)
            .eq('status', 'published')
            .limit(1)
            .maybeSingle();

        if (error || !data) return null;
        return data;
    } catch {
        return null;
    }
}

export async function generateStaticParams() {
    if (!isSupabaseConfigured) return [];
    try {
        const { data } = await supabase
            .from('posts')
            .select('slug')
            .eq('status', 'published');

        return (data || []).map((post) => ({ slug: post.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: 'Post Not Found — NextCharge Blog' };

    const title = `${post.seo_title || post.title} — NextCharge Blog`;
    const description = post.seo_description || post.excerpt || 'EV charging guide and article on NextCharge.';
    const url = `https://www.nextcharge.in/blog/${post.slug}`;

    return {
        title,
        description,
        robots: 'index, follow',
        alternates: { canonical: url },
        openGraph: {
            type: 'article',
            url,
            title,
            description,
            images: post.cover_image_url ? [{ url: post.cover_image_url }] : [{ url: 'https://www.nextcharge.in/nexq-logo.png' }],
            publishedTime: post.created_at,
            modifiedTime: post.updated_at || post.created_at,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: post.cover_image_url ? [post.cover_image_url] : ['https://www.nextcharge.in/nexq-logo.png'],
        },
    };
}

function calculateReadingTime(html: string | undefined): number {
    const text = (html || '').replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const readingTime = calculateReadingTime(post.content);

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.seo_description || post.excerpt || 'EV charging guide and article on NextCharge.',
        image: post.cover_image_url || 'https://www.nextcharge.in/nexq-logo.png',
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        mainEntityOfPage: `https://www.nextcharge.in/blog/${post.slug}`,
        author: {
            '@type': 'Organization',
            name: 'NextCharge Editorial Team',
            url: 'https://www.nextcharge.in/',
        },
        publisher: {
            '@type': 'Organization',
            name: 'NextCharge',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.nextcharge.in/nexq-logo.png',
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />

            {/* Ambient Background Glows */}
            <div className="ambient-glow-container">
                <div className="glow-circle glow-1"></div>
                <div className="glow-circle glow-2"></div>
                <div className="glow-circle glow-3"></div>
            </div>

            <ReadingProgress />

            <main className="main-wrapper">
                <Navbar />

                {/* Post Hero Image */}
                <div className="post-hero">
                    {post.cover_image_url ? (
                        <img src={post.cover_image_url} alt={post.title} />
                    ) : null}
                </div>

                {/* Post Header */}
                <div className="post-header">
                    <Link href="/blog" className="post-back-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                        Back to Blog
                    </Link>

                    {post.category && (
                        <span className="post-category-badge">{post.category}</span>
                    )}

                    <h1 className="post-title">{post.title}</h1>

                    <div className="post-meta">
                        <span className="post-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                            <span>{formatDate(post.created_at)}</span>
                        </span>
                        <span className="post-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span>{readingTime} min read</span>
                        </span>
                        <span className="post-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span>NextCharge</span>
                        </span>
                    </div>
                </div>

                {/* Post Content */}
                <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content || '' }} />

                <Footer />
            </main>
        </>
    );
}
