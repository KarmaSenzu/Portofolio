const express = require('express');
const { supabase } = require('../config/supabase');
const { verifyAuth } = require('../middleware/supabaseAuth');

const router = express.Router();

// GET /api/settings - get all settings (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('setting_key', { ascending: true });

    if (error) throw error;

    // Transform to a key-value object
    const settings = {};
    for (const row of data) {
      // PostgreSQL JSONB handles JSON natively, no need to parse
      settings[row.setting_key] = row.setting_value;
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

// GET /api/settings/:key - get setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('setting_key', req.params.key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Setting not found - return empty value instead of 404
        // This prevents frontend Promise.all from failing when a setting doesn't exist yet
        return res.json({
          key: req.params.key,
          value: null,
          updatedAt: null
        });
      }
      throw error;
    }

    // PostgreSQL JSONB handles JSON natively, no need to parse
    res.json({
      key: data.setting_key,
      value: data.setting_value,
      updatedAt: data.updated_at
    });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting.' });
  }
});

// PUT /api/settings/:key - update setting (auth required)
router.put('/:key', verifyAuth, async (req, res) => {
  try {
    const { value } = req.body;
    const key = req.params.key;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required.' });
    }

    // PostgreSQL JSONB handles JSON natively, no need to stringify
    // Upsert: insert or update
    const { data, error } = await supabase
      .from('settings')
      .upsert(
        { setting_key: key, setting_value: value },
        { onConflict: 'setting_key' }
      )
      .select()
      .single();

    if (error) throw error;

    // PostgreSQL JSONB handles JSON natively, no need to parse
    res.json({
      key: data.setting_key,
      value: data.setting_value,
      updatedAt: data.updated_at
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting.' });
  }
});

module.exports = router;
