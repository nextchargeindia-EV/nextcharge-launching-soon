import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "600", "800"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["500", "700"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "NextCharge — India's Smartest EV Charging Network | Launching Soon",
    description:
        "Locate EV charging stations, plan trips with our AI planner, and turn parking spaces into revenue assets. India's smartest unified charging network, launching soon.",
    keywords:
        "EV charging station India, EV charger near me, EV trip planner, EV charging network, Delhi Jaipur EV charging, Tata Nexon EV charging, NextCharge app",
    metadataBase: new URL("https://www.nextcharge.in"),
    alternates: {
        canonical: "/",
        languages: {
            "en-IN": "/",
            "hi-IN": "/hi/",
            "mr-IN": "/mr/",
            "gu-IN": "/gu/",
            "ta-IN": "/ta/",
            "te-IN": "/te/",
            "kn-IN": "/kn/",
            "bn-IN": "/bn/",
            "pa-IN": "/pa/",
        },
    },
    openGraph: {
        type: "website",
        url: "https://www.nextcharge.in/",
        title: "NextCharge — India's Smartest EV Charging Network",
        description:
            "Locate EV charging stations, plan trips with our AI planner, and turn parking spaces into revenue assets. India's smartest unified charging network, launching soon.",
        images: [{ url: "https://www.nextcharge.in/nexq-logo.png" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "NextCharge — India's Smartest EV Charging Network",
        description:
            "Locate EV charging stations, plan trips with our AI planner, and turn parking spaces into revenue assets. India's smartest unified charging network, launching soon.",
        images: ["https://www.nextcharge.in/nexq-logo.png"],
    },
    icons: {
        icon: [
            { url: "/q-app-icon.png", type: "image/png" },
            { url: "/icon.png", type: "image/png" },
        ],
        shortcut: "/q-app-icon.png",
        apple: "/apple-icon.png",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://www.nextcharge.in/#organization",
            name: "NextCharge",
            url: "https://www.nextcharge.in/",
            logo: {
                "@type": "ImageObject",
                url: "https://www.nextcharge.in/nexq-logo.png",
            },
            contactPoint: {
                "@type": "ContactPoint",
                email: "contact@nextcharge.in",
                contactType: "customer support",
            },
        },
        {
            "@type": "SoftwareApplication",
            "@id": "https://www.nextcharge.in/#application",
            name: "NextCharge App",
            operatingSystem: "Android, iOS",
            applicationCategory: "UtilitiesApplication",
            offers: {
                "@type": "Offer",
                price: "0.00",
                priceCurrency: "INR",
            },
            description:
                "India's smartest EV charging network app. Locate charger stations, plan intercity highway trips with AI, and manage billing seamlessly.",
            publisher: { "@id": "https://www.nextcharge.in/#organization" },
        },
        {
            "@type": "WebPage",
            "@id": "https://www.nextcharge.in/#webpage",
            url: "https://www.nextcharge.in/",
            name: "NextCharge — India's Smartest EV Charging Network",
            description:
                "Locate EV charging stations, plan trips with our AI planner, and turn parking spaces into revenue assets. Launching soon in India.",
            about: { "@id": "https://www.nextcharge.in/#organization" },
        },
        {
            "@type": "BreadcrumbList",
            "@id": "https://www.nextcharge.in/#breadcrumb",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.nextcharge.in/" },
                { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.nextcharge.in/blog" },
            ],
        },
        {
            "@type": "FAQPage",
            "@id": "https://www.nextcharge.in/#faq",
            mainEntity: [
                {
                    "@type": "Question",
                    name: "What is NextCharge and how does it optimize EV charging in India?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "NextCharge is India's smartest unified EV charging network. It connects charging station operators (CPOs), fleet operators, and EV drivers through an AI-powered platform featuring real-time station discovery, automated trip planning for highway corridors, and revenue sharing for host locations.",
                    },
                },
                {
                    "@type": "Question",
                    name: "How much does EV charging cost in India?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Electric vehicle charging costs in India typically range between ₹15 to ₹24 per kWh for fast DC charging, making running costs up to 75% cheaper per kilometer compared to conventional petrol or diesel vehicles.",
                    },
                },
                {
                    "@type": "Question",
                    name: "How do I find EV charging stations near me?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "You can use the NextCharge app to locate verified charging stations near you across 50+ major Indian cities including Delhi NCR, Mumbai, Bangalore, Jaipur, and along major national highways like NH-48 and NH-4.",
                    },
                },
            ],
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-EC1BYN8B5K';

    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable}`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}

                {/* Google Analytics GA4 */}
                {gaId && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${gaId}', {
                                    page_path: window.location.pathname,
                                });
                            `}
                        </Script>
                    </>
                )}
            </body>
        </html>
    );
}
