const express = require('express');
const { supabase } = require('../config/supabase');
const { verifyAuth } = require('../middleware/supabaseAuth');

const router = express.Router();

// Transform DB row to frontend format
function transformExperience(row) {
  return {
    id: row.id,
    title: { en: row.title_en, id: row.title_id },
    company: row.company,
    period: { en: row.period_en, id: row.period_id },
    description: { en: row.description_en, id: row.description_id },
    current: Boolean(row.is_current),
    isEducation: Boolean(row.is_education),
    sortOrder: row.sort_order
  };
}

// GET /api/experiences - list all (public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query = supabase.from('experiences').select('*');
    query = query.is('deleted_at', null);

    if (type === 'education') {
      query = query.eq('is_education', true);
    } else if (type === 'work') {
      query = query.eq('is_education', false);
    }

    query = query.order('sort_order', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    res.json(data.map(transformExperience));
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ error: 'Failed to fetch experiences.' });
  }
});

// POST /api/experiences - create (auth required)
router.post('/', verifyAuth, async (req, res) => {
  try {
    const { title, company, period, description, current, isEducation } = req.body;

    if (!title || !title.en) {
      return res.status(400).json({ error: 'Title (en) is required.' });
    }

    // Get max sort_order
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('experiences')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const sortOrder = (maxOrderData?.sort_order || 0) + 1;

    const { data, error } = await supabase
      .from('experiences')
      .insert({
        title_en: title.en || '',
        title_id: title.id || '',
        company: company || null,
        period_en: period?.en || null,
        period_id: period?.id || null,
        description_en: description?.en || null,
        description_id: description?.id || null,
        is_current: current || false,
        is_education: isEducation || false,
        sort_order: sortOrder
        // NOTE: 'created_by'/'updated_by' removed - columns do not exist in
        // the experiences table (supabase-schema.sql lines 141-154)
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(transformExperience(data));
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ error: 'Failed to create experience.' });
  }
});

// PUT /api/experiences/:id - update (auth required)
router.put('/:id', verifyAuth, async (req, res) => {
  try {
    const expId = req.params.id;
    const { title, company, period, description, current, isEducation, sortOrder } = req.body;

    const { data: existing, error: existError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', expId)
      .single();

    if (existError || !existing) {
      return res.status(404).json({ error: 'Experience not found.' });
    }

    const { data, error } = await supabase
      .from('experiences')
      .update({
        title_en: title?.en ?? existing.title_en,
        title_id: title?.id ?? existing.title_id,
        company: company ?? existing.company,
        period_en: period?.en ?? existing.period_en,
        period_id: period?.id ?? existing.period_id,
        description_en: description?.en ?? existing.description_en,
        description_id: description?.id ?? existing.description_id,
        is_current: current !== undefined ? current : existing.is_current,
        is_education: isEducation !== undefined ? isEducation : existing.is_education,
        sort_order: sortOrder ?? existing.sort_order
        // NOTE: 'updated_by' removed - column does not exist in the
        // experiences table (supabase-schema.sql lines 141-154)
      })
      .eq('id', expId)
      .select()
      .single();

    if (error) throw error;

    res.json(transformExperience(data));
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Failed to update experience.' });
  }
});

// DELETE /api/experiences/:id - soft delete (auth required) → masuk recycle bin
router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    const { data: existing, error: existError } = await supabase
      .from('experiences')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (existError || !existing) {
      return res.status(404).json({ error: 'Experience not found.' });
    }

    // Soft delete: set deleted_at (masuk recycle bin)
    const { error } = await supabase
      .from('experiences')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Experience moved to recycle bin.' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Failed to delete experience.' });
  }
});

module.exports = router;
