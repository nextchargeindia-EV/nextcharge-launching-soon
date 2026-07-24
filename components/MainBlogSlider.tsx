'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import BlogCard from '@/components/BlogCard';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    cover_image_url?: string;
    category?: string;
    created_at: string;
    content?: string;
}

interface MainBlogSliderProps {
    posts: Post[];
}

export default function MainBlogSlider({ posts }: MainBlogSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);

    const updateSliderState = useCallback(() => {
        if (!sliderRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

        // Calculate current active slide index based on card width
        const itemWidth = clientWidth < 640 ? 290 + 24 : 340 + 24;
        const newIndex = Math.min(
            posts.length - 1,
            Math.max(0, Math.round(scrollLeft / itemWidth))
        );
        setActiveIndex(newIndex);
    }, [posts.length]);

    useEffect(() => {
        updateSliderState();
        const slider = sliderRef.current;
        if (!slider) return;

        const handleScroll = () => updateSliderState();
        slider.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            slider.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [posts, updateSliderState]);

    const scrollToIndex = (index: number) => {
        if (!sliderRef.current) return;
        const itemWidth = sliderRef.current.clientWidth < 640 ? 290 + 24 : 340 + 24;
        sliderRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    };

    const scrollByAmount = (direction: 'left' | 'right') => {
        if (!sliderRef.current) return;
        const itemWidth = sliderRef.current.clientWidth < 640 ? 290 + 24 : 340 + 24;
        const scrollOffset = direction === 'left' ? -itemWidth : itemWidth;
        sliderRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    };

    // Continuous auto-shuffle / auto-play loop (pauses when hovered or dragged)
    useEffect(() => {
        if (posts.length <= 1 || isHovered || isDragging) return;

        const interval = setInterval(() => {
            setActiveIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % posts.length;
                scrollToIndex(nextIndex);
                return nextIndex;
            });
        }, 3500);

        return () => clearInterval(interval);
    }, [posts.length, isHovered, isDragging]);

    // Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!sliderRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeftPos(sliderRef.current.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        sliderRef.current.scrollLeft = scrollLeftPos - walk;
    };

    if (!posts || posts.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4 }}>📭</div>
                <h3>No articles published yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '4px' }}>Check back soon for latest insights!</p>
            </div>
        );
    }

    return (
        <div
            className="main-blog-slider-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
        >
            {/* Left Scroll Navigation Button */}
            {canScrollLeft && (
                <button
                    className="slider-arrow slider-arrow-left"
                    onClick={() => scrollByAmount('left')}
                    aria-label="Previous posts"
                    type="button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            )}

            {/* Sliding Track */}
            <div
                className={`main-blog-slider-track${isDragging ? ' dragging' : ''}`}
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
            >
                {posts.map((post, index) => (
                    <div key={post.id} className="slider-card-item">
                        <BlogCard post={post} index={index} />
                    </div>
                ))}
            </div>

            {/* Right Scroll Navigation Button */}
            {canScrollRight && (
                <button
                    className="slider-arrow slider-arrow-right"
                    onClick={() => scrollByAmount('right')}
                    aria-label="Next posts"
                    type="button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            )}

            {/* Dots Navigation Indicators */}
            {posts.length > 1 && (
                <div className="slider-dots-container">
                    {posts.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className={`slider-dot${idx === activeIndex ? ' active' : ''}`}
                            onClick={() => scrollToIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
