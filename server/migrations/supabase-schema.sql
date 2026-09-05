-- ================================================
-- PORTFOLIO CMS - SUPABASE MIGRATION SCHEMA
-- ================================================
-- Migration from MySQL to PostgreSQL (Supabase)
-- Date: 2026-09-04
-- Note: Run this in Supabase SQL Editor
-- ================================================

-- ================================================
-- 1. CREATE CUSTOM TYPES (ENUMS)
-- ================================================

-- Project categories
CREATE TYPE project_category AS ENUM (
  'web-app',
  'mobile',
  'open-source',
  'design'
);

-- Project roles
CREATE TYPE project_role AS ENUM (
  'frontend',
  'backend',
  'fullstack'
);

-- Project status
CREATE TYPE project_status AS ENUM (
  'completed',
  'in-progress',
  'planned'
);

-- Blog categories
CREATE TYPE blog_category AS ENUM (
  'tutorials',
  'tips',
  'thoughts'
);

-- Skill categories
CREATE TYPE skill_category AS ENUM (
  'frontend',
  'backend',
  'devops',
  'design',
  'tools'
);

-- Analytics event types
CREATE TYPE analytics_event AS ENUM (
  'page_view',
  'demo_click',
  'repo_click'
);

-- ================================================
-- 2. CREATE MAIN TABLES
-- ================================================

-- Admin profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_en VARCHAR(500) NOT NULL,
  title_id VARCHAR(500) NOT NULL,
  description_en TEXT,
  description_id TEXT,
  about_en TEXT,
  about_id TEXT,
  category project_category DEFAULT 'web-app',
  role project_role DEFAULT 'fullstack',
  tech_stack JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  live_url VARCHAR(500),
  repo_url VARCHAR(500),
  date VARCHAR(100),
  duration VARCHAR(100),
  status project_status DEFAULT 'completed',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  case_study_problem_en TEXT,
  case_study_problem_id TEXT,
  case_study_solution_en TEXT,
  case_study_solution_id TEXT,
  case_study_result_en TEXT,
  case_study_result_id TEXT,
  challenges JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_en VARCHAR(500) NOT NULL,
  title_id VARCHAR(500) NOT NULL,
  excerpt_en TEXT,
  excerpt_id TEXT,
  content_en TEXT,
  content_id TEXT,
  category blog_category DEFAULT 'tutorials',
  tags JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  read_time INTEGER DEFAULT 5,
  published BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  category skill_category DEFAULT 'frontend',
  color VARCHAR(20),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences table
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(300) NOT NULL,
  title_id VARCHAR(300) NOT NULL,
  company VARCHAR(300),
  period_en VARCHAR(100),
  period_id VARCHAR(100),
  description_en TEXT,
  description_id TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  is_education BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates table
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(300) NOT NULL,
  title_id VARCHAR(300) NOT NULL,
  issuer VARCHAR(200),
  date VARCHAR(100),
  credential_id VARCHAR(200),
  image TEXT,
  credential_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (key-value store)
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type analytics_event NOT NULL,
  page VARCHAR(200),
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table (track all changes)
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ================================================

-- Projects indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_sort_order ON projects(sort_order);

-- Blog indexes
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_category ON blog_posts(category);
CREATE INDEX idx_blog_published ON blog_posts(published);
CREATE INDEX idx_blog_created_at ON blog_posts(created_at DESC);

-- Skills indexes
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_sort_order ON skills(sort_order);

-- Analytics indexes
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX idx_analytics_project_id ON analytics(project_id);

-- Audit logs indexes
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);

-- ================================================
-- 4. CREATE FUNCTIONS FOR AUTO-UPDATED TIMESTAMPS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required for reading public content)
CREATE POLICY "Allow public read on projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Allow public read on published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Allow public read on skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Allow public read on experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Allow public read on certificates"
  ON certificates FOR SELECT
  USING (true);

CREATE POLICY "Allow public read on settings"
  ON settings FOR SELECT
  USING (true);

-- Admin write access (authenticated users can write)
CREATE POLICY "Allow admin insert on projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin update on projects"
  ON projects FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete on projects"
  ON projects FOR DELETE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin all on blog_posts"
  ON blog_posts FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin all on skills"
  ON skills FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin all on experiences"
  ON experiences FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin all on certificates"
  ON certificates FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin all on settings"
  ON settings FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Analytics: public can insert, admin can read
CREATE POLICY "Allow public insert on analytics"
  ON analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin read on analytics"
  ON analytics FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Profiles: users can read their own, admin can read all
CREATE POLICY "Allow users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Audit logs: only authenticated users can read
CREATE POLICY "Allow admin read audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ================================================
-- 6. INITIAL DATA SETUP
-- ================================================

-- Note: Insert admin user via Supabase Dashboard or auth.users table
-- Then create profile entry:

-- Example: Create profile for admin user (replace UUID with actual auth.users.id)
-- INSERT INTO profiles (id, username, full_name, role)
-- VALUES ('your-auth-user-uuid', 'admin', 'Portfolio Admin', 'admin');

-- ================================================
-- MIGRATION COMPLETE
-- ================================================

-- Verification queries:
-- SELECT * FROM profiles;
-- SELECT COUNT(*) FROM projects;
-- SELECT COUNT(*) FROM blog_posts;
-- SELECT * FROM settings;

-- To check RLS policies:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
