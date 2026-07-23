'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function handleScroll() {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setProgress(Math.min((window.scrollY / scrollHeight) * 100, 100));
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="reading-progress" style={{ width: `${progress}%` }} />
    );
}
