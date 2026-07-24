-- ============================================================
-- NextCharge Database Schema for Supabase
-- Run this in: Supabase Dashboard > SQL Editor
-- This script is idempotent (safe to run multiple times)
-- ============================================================

-- Blog posts (replaces Firebase Firestore 'posts' collection)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author TEXT,
  seo_title TEXT,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings (for main page blog limits and config)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback submissions (replaces Formspree)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  problem TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Early access / waitlist signups
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partner inquiries
CREATE TABLE IF NOT EXISTS partner_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_type TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_inquiries ENABLE ROW LEVEL SECURITY;

-- Site Settings Policies
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin full access to site settings" ON site_settings;
CREATE POLICY "Admin full access to site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Posts Policies
DROP POLICY IF EXISTS "Public can read published posts" ON posts;
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access to posts" ON posts;
CREATE POLICY "Admin full access to posts"
  ON posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Feedback Policies
DROP POLICY IF EXISTS "Public can submit feedback" ON feedback;
CREATE POLICY "Public can submit feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can read feedback" ON feedback;
CREATE POLICY "Admin can read feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (true);

-- Waitlist Policies
DROP POLICY IF EXISTS "Public can join waitlist" ON waitlist;
CREATE POLICY "Public can join waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can read waitlist" ON waitlist;
CREATE POLICY "Admin can read waitlist"
  ON waitlist FOR SELECT
  TO authenticated
  USING (true);

-- Partner Inquiries Policies
DROP POLICY IF EXISTS "Public can submit partner inquiry" ON partner_inquiries;
CREATE POLICY "Public can submit partner inquiry"
  ON partner_inquiries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can read partner inquiries" ON partner_inquiries;
CREATE POLICY "Admin can read partner inquiries"
  ON partner_inquiries FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Indexes for Performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_posts_status_created ON posts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email);
CREATE INDEX IF NOT EXISTS idx_partner_inquiries_created ON partner_inquiries (created_at DESC);

-- ============================================================
-- Supabase Storage Bucket for Blog Images
-- ============================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
CREATE POLICY "Public can view blog images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
CREATE POLICY "Authenticated users can upload blog images" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
CREATE POLICY "Authenticated users can delete blog images" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'blog-images');
