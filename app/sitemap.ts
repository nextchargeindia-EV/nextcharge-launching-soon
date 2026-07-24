import type { MetadataRoute } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const today = new Date().toISOString().split('T')[0];

    // Core pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: 'https://www.nextcharge.in/', lastModified: today, changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.nextcharge.in/about', lastModified: today, changeFrequency: 'monthly', priority: 0.9 },
        { url: 'https://www.nextcharge.in/blog', lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    ];

    // Dynamic blog posts
    let posts: { slug: string; updated_at?: string; created_at: string }[] | null = null;
    if (isSupabaseConfigured) {
        try {
            const { data } = await supabase
                .from('posts')
                .select('slug, updated_at, created_at')
                .eq('status', 'published');
            posts = data;
        } catch {
            posts = [];
        }
    }

    const blogPages: MetadataRoute.Sitemap = (posts || []).map(post => {
        const cleanSlug = (post.slug || '').replace(/^\/+/g, '').replace(/\/+$/g, '');
        return {
            url: `https://www.nextcharge.in/blog/${cleanSlug}`,
            lastModified: post.updated_at || post.created_at,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        };
    });

    /* 
     * NOTE: The following sections (cityPages, highwayPages, evPages, calcPages)
     * are commented out until the corresponding dynamic page routes are implemented in the app directory.
     * Uncomment these as the page components are built to include them in the sitemap.
     */

    /*
    // City pages (Tier 1, Tier 2, Tier 3 Local SEO & GEO Hubs)
    const cities = [
        'delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad',
        'jaipur', 'surat', 'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal', 'visakhapatnam',
        'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut',
        'rajkot', 'varanasi', 'srinagar', 'chhatrapati-sambhaji-nagar', 'dhanbad', 'amritsar',
        'navi-mumbai', 'allahabad', 'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior',
        'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'guwahati', 'chandigarh', 'solapur',
        'hubballi-dharwad', 'bareilly', 'moradabad', 'mysore', 'gurgaon', 'aligarh', 'jalandhar',
        'tiruchirappalli', 'bhubaneswar', 'salem', 'mira-bhayandar', 'warangal', 'thiruvananthapuram',
        'bhiwandi', 'saharanpur', 'guntur', 'amravati', 'noida', 'jamshedpur', 'bhilai', 'cuttack',
        'firozabad', 'kochi', 'nellore', 'bhavnagar', 'dehradun', 'durgapur', 'asansol', 'rourkela',
        'nanded', 'kolhapur', 'ajmer', 'gulbarga', 'jamnagar', 'ujjain', 'siliguri', 'jhansi',
        'satara', 'sangli', 'latur', 'karad', 'ratnagiri', 'ahmednagar', 'jalgaon', 'dhule',
        'solan', 'shimla', 'dharamshala', 'mandi', 'haridwar', 'rishikesh', 'roorkee', 'haldwani',
        'rudrapur', 'mathura', 'vrindavan', 'ayodhya', 'gorakhpur', 'muzaffarnagar', 'jhajjar',
        'panipat', 'sonipat', 'karnal', 'ambala', 'hisar', 'rohtak', 'bathinda', 'pathankot',
        'hoshiarpur', 'mohali', 'panchkula', 'udaipur', 'bhilwara', 'alwar', 'bharatpur', 'sikar',
        'pali', 'anand', 'vapi', 'navsari', 'mehsana', 'gandhidham', 'gandhinagar', 'bharuch',
        'morbi', 'somnath', 'dwarka', 'tirupati', 'kakinada', 'rajahmundry', 'kadapa', 'anantapur',
        'kurnool', 'eluru', 'ongole', 'vellore', 'erode', 'thoothukudi', 'thanjavur', 'dindigul',
        'hospet', 'belgaum', 'bellary', 'davangere', 'tumkur', 'shimoga', 'bidar', 'mangalore',
        'udupi', 'kasaragod', 'kannur', 'calicut', 'malappuram', 'palakkad', 'thrissur', 'alappuzha',
        'kottayam', 'kollam', 'pathanamthitta', 'muzaffarpur', 'gaya', 'bhagalpur', 'darbhanga',
        'purnia', 'bilaspur', 'korba', 'durg', 'sambalpur', 'puri', 'balasore', 'tezpur', 'jorhat',
        'silchar', 'dibrugarh'
    ];
    const cityPages: MetadataRoute.Sitemap = cities.map(city => ({
        url: `https://www.nextcharge.in/network/city/${city}`,
        lastModified: today,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Highway corridor pages
    const highways = [
        'nh48-delhi-jaipur', 'nh48-delhi-chandigarh', 'nh4-mumbai-pune',
        'nh7-hyderabad-bangalore', 'yamuna-expressway-delhi-agra', 'nh44-delhi-agra',
        'nh48-mumbai-ahmedabad', 'nh44-bengaluru-chennai', 'samruddhi-mahamarg-mumbai-nagpur',
        'nh66-mumbai-goa', 'nh44-chandigarh-manali', 'nh48-pune-kolhapur',
    ];
    const highwayPages: MetadataRoute.Sitemap = highways.map(hw => ({
        url: `https://www.nextcharge.in/network/highway/${hw}`,
        lastModified: today,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // EV model pages
    const evModels = [
        'tata/nexon-ev', 'tata/punch-ev', 'tata/tiago-ev', 'mg/zs-ev', 'mg/comet-ev',
        'hyundai/ioniq-5', 'mahindra/xuv400', 'byd/atto-3', 'kia/ev6',
    ];
    const evPages: MetadataRoute.Sitemap = evModels.map(model => ({
        url: `https://www.nextcharge.in/resources/ev/${model}`,
        lastModified: today,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Calculator pages
    const calculators = ['trip-cost', 'ev-vs-petrol', 'charging-time'];
    const calcPages: MetadataRoute.Sitemap = calculators.map(calc => ({
        url: `https://www.nextcharge.in/resources/calculators/${calc}`,
        lastModified: today,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));
    */

    return [...staticPages, ...blogPages];
}
