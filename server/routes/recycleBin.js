/**
 * ================================================
 * RECYCLE BIN ROUTES
 * ================================================
 * Soft delete + restore + permanent delete
 * Untuk semua entity: projects, blog, skills, experiences, certificates
 * ================================================
 */

const express = require('express');
const { supabase } = require('../config/supabase');
const { verifyAuth } = require('../middleware/supabaseAuth');

const router = express.Router();

// Daftar entity yang support recycle bin
const ENTITIES = ['projects', 'blog_posts', 'skills', 'experiences', 'certificates'];

// Map label untuk tiap entity
const ENTITY_META = {
  projects: { label: 'Project', titleField: 'title_en' },
  blog_posts: { label: 'Blog Post', titleField: 'title_en' },
  skills: { label: 'Skill', titleField: 'name' },
  experiences: { label: 'Experience', titleField: 'title_en' },
  certificates: { label: 'Certificate', titleField: 'title_en' },
};

// ================================================
// GET /api/recycle-bin - list semua item yang dihapus (soft deleted)
// ================================================
router.get('/', verifyAuth, async (req, res) => {
  try {
    const allItems = [];

    for (const entity of ENTITIES) {
      const { data, error } = await supabase
        .from(entity)
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) {
        console.error(`Error fetching recycle bin ${entity}:`, error);
        continue; // skip entity yang error, lanjut yang lain
      }

      data.forEach(row => {
        allItems.push({
          entity: entity,
          entityLabel: ENTITY_META[entity]?.label || entity,
          id: row.id,
          title: row[ENTITY_META[entity]?.titleField] || row.title_en || row.name || 'Untitled',
          slug: row.slug || null,
          deletedAt: row.deleted_at,
        });
      });
    }

    // Sort by deletedAt descending
    allItems.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

    res.json(allItems);
  } catch (error) {
    console.error('Get recycle bin error:', error);
    res.status(500).json({ error: 'Failed to fetch recycle bin.' });
  }
});

// ================================================
// POST /api/recycle-bin/restore - restore item(s)
// Body: { items: [{ entity, id }, ...] } atau { entity, id }
// ================================================
router.post('/restore', verifyAuth, async (req, res) => {
  try {
    const { items, entity, id } = req.body;

    // Support single restore (entity + id) atau bulk (items array)
    const restoreList = items || (entity && id ? [{ entity, id }] : []);

    if (restoreList.length === 0) {
      return res.status(400).json({ error: 'No items to restore.' });
    }

    const results = [];
    for (const item of restoreList) {
      const { entity: e, id: itemId } = item;
      if (!ENTITIES.includes(e)) continue;

      const { data, error } = await supabase
        .from(e)
        .update({ deleted_at: null })
        .eq('id', itemId)
        .select();

      if (error) {
        results.push({ entity: e, id: itemId, success: false, error: error.message });
      } else {
        results.push({ entity: e, id: itemId, success: true });
      }
    }

    res.json({ message: 'Items restored.', results });
  } catch (error) {
    console.error('Restore error:', error);
    res.status(500).json({ error: 'Failed to restore items.' });
  }
});

// ================================================
// DELETE /api/recycle-bin/permanent - permanent delete item(s)
// Body: { items: [{ entity, id }, ...] } atau { entity, id }
// ================================================
router.delete('/permanent', verifyAuth, async (req, res) => {
  try {
    const { items, entity, id } = req.body;
    const deleteList = items || (entity && id ? [{ entity, id }] : []);

    if (deleteList.length === 0) {
      return res.status(400).json({ error: 'No items to delete.' });
    }

    const results = [];
    for (const item of deleteList) {
      const { entity: e, id: itemId } = item;
      if (!ENTITIES.includes(e)) continue;

      const { error } = await supabase
        .from(e)
        .delete()
        .eq('id', itemId);

      if (error) {
        results.push({ entity: e, id: itemId, success: false, error: error.message });
      } else {
        results.push({ entity: e, id: itemId, success: true });
      }
    }

    res.json({ message: 'Items permanently deleted.', results });
  } catch (error) {
    console.error('Permanent delete error:', error);
    res.status(500).json({ error: 'Failed to permanently delete items.' });
  }
});

// ================================================
// POST /api/recycle-bin/empty - kosongkan seluruh recycle bin
// ================================================
router.post('/empty', verifyAuth, async (req, res) => {
  try {
    const results = [];
    for (const entity of ENTITIES) {
      const { error } = await supabase
        .from(entity)
        .delete()
        .not('deleted_at', 'is', null);

      results.push({ entity, success: !error });
    }

    res.json({ message: 'Recycle bin emptied.', results });
  } catch (error) {
    console.error('Empty recycle bin error:', error);
    res.status(500).json({ error: 'Failed to empty recycle bin.' });
  }
});

module.exports = router;
