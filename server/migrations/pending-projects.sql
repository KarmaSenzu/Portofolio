-- ================================================
-- PENDING PROJECTS MIGRATION
-- ================================================
-- Tambah kolom is_pending untuk project yang di-pending
-- Project pending TIDAK tampil di website publik
-- ================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_pending BOOLEAN DEFAULT FALSE;

-- Index untuk query pending
CREATE INDEX IF NOT EXISTS idx_projects_is_pending ON projects(is_pending);
