import Link from 'next/link';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    cover_image_url?: string;
    category?: string;
    created_at: string;
    content?: string;
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
        day: 'numeric'
    });
}

export default function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
    const readingTime = calculateReadingTime(post.content);
    const cleanSlug = (post.slug || '').replace(/^\/+/g, '').replace(/\/+$/g, '');

    return (
        <Link
            href={`/blog/${cleanSlug}`}
            className="post-card"
            style={{
                animationDelay: `${index * 0.08}s`,
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
            }}
            aria-label={`Read: ${post.title}`}
        >
            <div className="post-card-image">
                {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt={post.title} loading="lazy" />
                ) : (
                    <div className="post-card-placeholder">⚡</div>
                )}
                {post.category && (
                    <span className="post-card-category">{post.category}</span>
                )}
            </div>
            <div className="post-card-body">
                <h3 className="post-card-title">{post.title}</h3>
                <p className="post-card-excerpt">{post.excerpt || ''}</p>
                <div className="post-card-meta">
                    <span className="post-card-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                        {formatDate(post.created_at)}
                    </span>
                    <span className="post-card-reading-time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {readingTime} min read
                    </span>
                </div>
            </div>
        </Link>
    );
}
