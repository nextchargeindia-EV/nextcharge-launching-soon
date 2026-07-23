import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/admin'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: ['/admin'],
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: ['/admin'],
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/admin'],
            },
            {
                userAgent: 'anthropic-ai',
                allow: '/',
                disallow: ['/admin'],
            },
        ],
        sitemap: 'https://www.nextcharge.in/sitemap.xml',
    };
}
