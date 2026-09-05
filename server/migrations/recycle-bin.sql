-- ================================================
-- RECYCLE BIN (SOFT DELETE) MIGRATION
-- ================================================
-- Tambah kolom deleted_at untuk soft delete
-- Item yang dihapus masuk recycle bin (deleted_at di-set)
-- Auto-delete permanen setelah 30 hari (via cron/trigger)
-- ================================================

-- Tambah kolom deleted_at ke semua tabel content
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Index untuk mempercepat query recycle bin
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_blog_deleted_at ON blog_posts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_skills_deleted_at ON skills(deleted_at);
CREATE INDEX IF NOT EXISTS idx_experiences_deleted_at ON experiences(deleted_at);
CREATE INDEX IF NOT EXISTS idx_certificates_deleted_at ON certificates(deleted_at);

-- ================================================
-- FUNGSI AUTO-DELETE PERMANEN (30 hari)
-- ================================================
-- Jalankan via pg_cron (Supabase extension) setiap hari:
-- SELECT cron.schedule('cleanup-recycle-bin', '0 0 * * *', $$
--   DELETE FROM projects WHERE deleted_at < NOW() - INTERVAL '30 days';
--   DELETE FROM blog_posts WHERE deleted_at < NOW() - INTERVAL '30 days';
--   DELETE FROM skills WHERE deleted_at < NOW() - INTERVAL '30 days';
--   DELETE FROM experiences WHERE deleted_at < NOW() - INTERVAL '30 days';
--   DELETE FROM certificates WHERE deleted_at < NOW() - INTERVAL '30 days';
-- $$);
-- ================================================
-- Note: pg_cron butuh di-enable di Supabase Dashboard → Extensions
-- ================================================
