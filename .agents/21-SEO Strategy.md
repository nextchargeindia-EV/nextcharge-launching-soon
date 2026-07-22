# NextCharge — SEO Strategy

**Version 1.0 | For Marketing & Engineering Teams**

---

## 1. Core SEO Pillars

| Pillar | Objective | Target Traffic |
|--------|-----------|----------------|
| **Charger & Network Pages** | Capture "EV charging near me" & "EV charging station in [city]" | 60% of total organic |
| **Trip Planning & Route Guides** | Capture "Delhi to Jaipur EV route" & intercity trip queries | 20% |
| **EV Education & Cost** | Capture "EV vs petrol cost India" & beginner EV info | 10% |
| **EV Database** | Capture "Tata Nexon EV range" & model-specific queries | 10% |

---

## 2. Keyword Strategy (Detailed in Doc 22 — Keyword Research Plan)

| Keyword Type | Examples | Intent | Content Strategy |
|--------------|----------|--------|------------------|
| **Transactional** | "EV charging station near me", "book EV charger Delhi" | High → Download app / charge | Charger detail pages, city + near-me pages |
| **Commercial** | "best EV charger network India", "EV charging franchise cost" | Medium → Compare | Comparison pages, pricing, franchise pages |
| **Informational** | "how does EV charging work", "EV vs petrol cost India" | Low → Subscribe / Learn | Blog, guides, FAQ, glossary |

---

## 3. Topic Clusters

### Cluster 1: EV Charging Stations by City (Local SEO — Highest Priority)

| Pillar Page | Supporting Content |
|-------------|-------------------|
| `/network/city/delhi` | Blog: "EV Charging in Delhi", Charger pages in Delhi, "Delhi EV guide" |
| `/network/city/mumbai` | Blog: "EV Charging in Mumbai", Charger pages in Mumbai |
| `/network/city/bangalore` | Blog: "EV Charging in Bangalore", Charger pages in Bangalore |
| `/network/city/jaipur` | Blog: "EV Charging in Jaipur", Charger pages in Jaipur |
| *(Repeat for 50+ cities)* | |

### Cluster 2: EV Highway Corridors (Long-Tail, Low Competition)

| Pillar Page | Supporting Content |
|-------------|-------------------|
| `/network/highway/nh48-delhi-jaipur` | Blog: "Delhi-Jaipur EV Route Guide", Charger pages on NH-48 |
| `/network/highway/nh48-delhi-chandigarh` | Blog: "Delhi-Chandigarh EV Route Guide" |
| `/network/highway/nh4-mumbai-pune` | Blog: "Mumbai-Pune EV Route Guide" |
| `/network/highway/nh7-hyderabad-bangalore` | Blog: "Hyderabad-Bangalore EV Route Guide" |

### Cluster 3: EV Database (Programmatic SEO)

| Pillar Page | Supporting Content |
|-------------|-------------------|
| `/resources/ev/tata/nexon-ev` | Blog: "Tata Nexon EV Review", Compatible Charger list |
| `/resources/ev/mg/zs-ev` | Blog: "MG ZS EV Review", Compatible Charger list |
| *(150+ models — auto-generated pages)* | |

### Cluster 4: EV Cost & Savings (Competitor Keywords)

| Pillar | Content |
|--------|---------|
| "EV charging cost India" | `/resources/calculators/trip-cost`, Blog, FAQ |
| "EV vs petrol cost India 2025" | Blog post, Calculator, Infographic |
| "cheapest EV charging India" | Pricing pages, Comparison page |

---

## 4. EEAT Strategy (Experience, Expertise, Authoritativeness, Trustworthiness)

| Factor | Implementation |
|--------|----------------|
| **Experience** | Real driver testimonials with photos; "Verified Driver" badge; real session screenshots |
| **Expertise** | Team page: founder backgrounds (EE grads); Blog co-authored by EV engineers; Guest posts on EV publications |
| **Authoritativeness** | OEM partnership logos (when secured); NHAI/state govt partnership; Linkedin presence; EV industry conference talks |
| **Trustworthiness** | Published uptime data (not claimed); Green energy third-party audit; Transparent pricing; DPDP Act compliant privacy policy; SSL, secure payment |

---

## 5. Core Web Vitals Target

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | SSR for charger detail/hub pages; lazy-load images; CDN (CloudFront); preload hero image |
| FID (First Input Delay) | < 100ms | Code-split JS; defer non-critical; minimal third-party scripts |
| CLS (Cumulative Layout Shift) | < 0.1 | Set explicit width/height on images; convert to WebP; font-display: swap |

---

## 6. Mobile-First Indexing

- All pages optimized for 320px viewport
- Touch targets ≥48x48dp
- Font scaling for readability
- No interstitials that block content
- responsive `meta viewport` tag on every page

---

## 7. International SEO (Languages)

- `hreflang` tags on every page (en-in, hi-in, mr-in, gu-in, ta-in, te-in, kn-in, bn-in, pa-in)
- `x-default` → en-in
- Language prefix in URL: `/hi/network/...`
- `<link rel="alternate" hreflang="hi-in" href="https://nextcharge.in/hi/network..." />`
- Avoid auto-translate; content team translates high-value pages

---

## 8. Technical SEO (Detailed in Document 25)

| Requirement | Implementation |
|-------------|----------------|
| Sitemap | Auto-generated XML sitemap; split by type (chargers, cities, hubs, blog, EV DB); submit to Google Search Console |
| Robots.txt | Allow all; disallow `/admin/*`, `/api/*`, `/auth/*`, `/profile/*` |
| Canonical tags | All pages; no duplicate content (city pages with same chargers = different cities) |
| Segmentation | City pages with same chargers → use `canonical` + unique intro content per city |
| SSL | TLS 1.3, HSTS preload |
| Structured data | EVChargingStation, Place, LocalBusiness, Car, Article, FAQPage, Product, BreadcrumbList |
