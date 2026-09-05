const express = require('express');
const { supabase } = require('../config/supabase');
const { verifyAuth } = require('../middleware/supabaseAuth');

const router = express.Router();

// Transform DB row to frontend format
function transformCertificate(row) {
  return {
    id: row.id,
    title: { en: row.title_en, id: row.title_id },
    issuer: row.issuer,
    date: row.date,
    credentialId: row.credential_id,
    image: row.image,
    credentialUrl: row.credential_url,
    sortOrder: row.sort_order
  };
}

// GET /api/certificates - list all (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('date', { ascending: false });

    if (error) throw error;

    res.json(data.map(transformCertificate));
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates.' });
  }
});

// POST /api/certificates - create (auth required)
router.post('/', verifyAuth, async (req, res) => {
  try {
    const { title, issuer, date, credentialId, image, credentialUrl } = req.body;

    if (!title || !title.en) {
      return res.status(400).json({ error: 'Title (en) is required.' });
    }

    // Get max sort_order
    const { data: maxData, error: maxError } = await supabase
      .from('certificates')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (maxError) throw maxError;
    const sortOrder = (maxData?.sort_order || 0) + 1;

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        title_en: title.en || '',
        title_id: title.id || '',
        issuer: issuer || null,
        date: date || null,
        credential_id: credentialId || null,
        image: image || null,
        credential_url: credentialUrl || null,
        sort_order: sortOrder
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(transformCertificate(data));
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: 'Failed to create certificate.' });
  }
});

// PUT /api/certificates/:id - update (auth required)
router.put('/:id', verifyAuth, async (req, res) => {
  try {
    const certId = req.params.id;
    const { title, issuer, date, credentialId, image, credentialUrl, sortOrder } = req.body;

    const { data: existing, error: fetchError } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Certificate not found.' });
      }
      throw fetchError;
    }

    const { data, error } = await supabase
      .from('certificates')
      .update({
        title_en: title?.en ?? existing.title_en,
        title_id: title?.id ?? existing.title_id,
        issuer: issuer ?? existing.issuer,
        date: date ?? existing.date,
        credential_id: credentialId ?? existing.credential_id,
        image: image ?? existing.image,
        credential_url: credentialUrl ?? existing.credential_url,
        sort_order: sortOrder ?? existing.sort_order
      })
      .eq('id', certId)
      .select()
      .single();

    if (error) throw error;

    res.json(transformCertificate(data));
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ error: 'Failed to update certificate.' });
  }
});

// DELETE /api/certificates/:id - soft delete (auth required) → masuk recycle bin
router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('certificates')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Certificate not found.' });
      }
      throw fetchError;
    }

    // Soft delete: set deleted_at (masuk recycle bin)
    const { error } = await supabase
      .from('certificates')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Certificate moved to recycle bin.' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Failed to delete certificate.' });
  }
});

module.exports = router;
