const express = require('express');
const { supabase } = require('../config/supabase');
const { verifyAuth } = require('../middleware/supabaseAuth');

const router = express.Router();

// Transform DB row to frontend format
function transformSkill(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    category: row.category,
    color: row.color,
    sortOrder: row.sort_order
  };
}

// GET /api/skills - list all skills (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = supabase.from('skills').select('*');
    query = query.is('deleted_at', null);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data.map(transformSkill));
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
});

// POST /api/skills - create skill (auth required)
router.post('/', verifyAuth, async (req, res) => {
  try {
    const { name, icon, category, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Skill name is required.' });
    }

    // Get max sort_order
    const { data: maxData, error: maxError } = await supabase
      .from('skills')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (maxError) throw maxError;
    const sortOrder = (maxData?.sort_order || 0) + 1;

    const { data, error } = await supabase
      .from('skills')
      .insert({
        name,
        icon: icon || null,
        category: category || 'frontend',
        color: color || null,
        sort_order: sortOrder
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(transformSkill(data));
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Failed to create skill.' });
  }
});

// PUT /api/skills/:id - update skill (auth required)
router.put('/:id', verifyAuth, async (req, res) => {
  try {
    const skillId = req.params.id;
    const { name, icon, category, color, sortOrder } = req.body;

    const { data: existing, error: fetchError } = await supabase
      .from('skills')
      .select('*')
      .eq('id', skillId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Skill not found.' });
      }
      throw fetchError;
    }

    const { data, error } = await supabase
      .from('skills')
      .update({
        name: name ?? existing.name,
        icon: icon ?? existing.icon,
        category: category ?? existing.category,
        color: color ?? existing.color,
        sort_order: sortOrder ?? existing.sort_order
      })
      .eq('id', skillId)
      .select()
      .single();

    if (error) throw error;

    res.json(transformSkill(data));
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Failed to update skill.' });
  }
});

// DELETE /api/skills/:id - soft delete skill (auth required) → masuk recycle bin
router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('skills')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Skill not found.' });
      }
      throw fetchError;
    }

    // Soft delete: set deleted_at (masuk recycle bin)
    const { error } = await supabase
      .from('skills')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Skill moved to recycle bin.' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill.' });
  }
});

module.exports = router;
