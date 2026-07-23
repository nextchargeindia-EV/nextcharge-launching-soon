'use client';

import { useState, useMemo } from 'react';
import BlogCard from '@/components/BlogCard';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    cover_image_url?: string;
    category?: string;
    tags?: string[];
    created_at: string;
    content?: string;
}

export default function BlogSearch({ posts, categories }: { posts: Post[]; categories: string[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCategory, setCurrentCategory] = useState('all');

    const filteredPosts = useMemo(() => {
        let filtered = posts;

        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(term) ||
                (p.excerpt && p.excerpt.toLowerCase().includes(term)) ||
                (p.category && p.category.toLowerCase().includes(term)) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
            );
        }

        return filtered;
    }, [posts, searchTerm, currentCategory]);

    return (
        <>
            <div className="blog-search-bar">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Search articles..."
                    aria-label="Search blog posts"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="category-tabs">
                <button
                    className={`category-tab${currentCategory === 'all' ? ' active' : ''}`}
                    onClick={() => setCurrentCategory('all')}
                >
                    All Posts
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`category-tab${currentCategory === cat ? ' active' : ''}`}
                        onClick={() => setCurrentCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="blog-grid">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => (
                        <BlogCard key={post.id} post={post} index={index} />
                    ))
                ) : (
                    <div className="blog-empty">
                        <div className="blog-empty-icon">📭</div>
                        <h3>No posts found</h3>
                        <p>Check back later for new content!</p>
                    </div>
                )}
            </div>
        </>
    );
}
