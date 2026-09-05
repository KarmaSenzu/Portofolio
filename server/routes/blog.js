const express = require('express');
const slugify = require('slugify');
const { supabase } = require('../config/supabase');
const { verifyAuth } = require('../middleware/supabaseAuth');

const router = express.Router();

// Transform DB row to frontend format
function transformPost(row) {
  return {
    id: row.slug,
    dbId: row.id,
    title: { en: row.title_en, id: row.title_id },
    excerpt: { en: row.excerpt_en, id: row.excerpt_id },
    content: { en: row.content_en, id: row.content_id },
    category: row.category,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    image: row.image,
    readTime: row.read_time,
    published: Boolean(row.published),
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/blog - list all posts (public, only published)
router.get('/', async (req, res) => {
  try {
    const { category, published, includeDrafts } = req.query;
    
    let query = supabase.from('blog_posts').select('*');
    query = query.is('deleted_at', null);

    if (category) {
      query = query.eq('category', category);
    }

    // SECURITY: default tampilkan hanya yang published (kecuali admin minta includeDrafts)
    if (includeDrafts === 'true') {
      if (published !== undefined) {
        query = query.eq('published', published === 'true');
      }
    } else {
      query = query.eq('published', true);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Get blog posts error:', error);
      return res.status(500).json({ error: 'Failed to fetch blog posts.' });
    }

    res.json(data.map(transformPost));
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
});

// GET /api/blog/:slug - get single post (public, only published)
router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', req.params.slug)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    // SECURITY: jangan tampilkan draft ke publik
    if (!data.published) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    res.json(transformPost(data));
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post.' });
  }
});

// POST /api/blog - create post (auth required)
router.post('/', verifyAuth, async (req, res) => {
  try {
    const {
      title, excerpt, content, category, tags,
      image, readTime, published
    } = req.body;

    if (!title || !title.en) {
      return res.status(400).json({ error: 'Title (en) is required.' });
    }

    const slug = slugify(title.en, { lower: true, strict: true });

    // Check for duplicate slug
    const { data: existing, error: checkError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing && !checkError) {
      return res.status(409).json({ error: 'A blog post with this title already exists.' });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        title_en: title.en || '',
        title_id: title.id || '',
        excerpt_en: excerpt?.en || null,
        excerpt_id: excerpt?.id || null,
        content_en: content?.en || null,
        content_id: content?.id || null,
        category: category || 'tutorials',
        tags: JSON.stringify(tags || []),
        image: image || null,
        read_time: readTime || 5,
        published: published !== undefined ? published : true,
        created_by: req.userId,
        updated_by: req.userId
      })
      .select()
      .single();

    if (error) {
      console.error('Create blog post error:', error);
      return res.status(500).json({ error: 'Failed to create blog post.' });
    }

    res.status(201).json(transformPost(data));
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Failed to create blog post.' });
  }
});

// PUT /api/blog/:id - update post (auth required)
router.put('/:id', verifyAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const {
      title, excerpt, content, category, tags,
      image, readTime, published
    } = req.body;

    const { data: existing, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    // Generate new slug if title changed
    let slug = existing.slug;
    if (title && title.en && title.en !== existing.title_en) {
      slug = slugify(title.en, { lower: true, strict: true });
      const { data: dupCheck } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .neq('id', postId)
        .single();
      
      if (dupCheck) {
        slug = slug + '-' + Date.now();
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        slug,
        title_en: title?.en ?? existing.title_en,
        title_id: title?.id ?? existing.title_id,
        excerpt_en: excerpt?.en ?? existing.excerpt_en,
        excerpt_id: excerpt?.id ?? existing.excerpt_id,
        content_en: content?.en ?? existing.content_en,
        content_id: content?.id ?? existing.content_id,
        category: category ?? existing.category,
        tags: JSON.stringify(tags ?? (typeof existing.tags === 'string' ? JSON.parse(existing.tags) : existing.tags)),
        image: image ?? existing.image,
        read_time: readTime ?? existing.read_time,
        published: published !== undefined ? published : existing.published,
        updated_by: req.userId
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Update blog post error:', error);
      return res.status(500).json({ error: 'Failed to update blog post.' });
    }

    res.json(transformPost(data));
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ error: 'Failed to update blog post.' });
  }
});

// DELETE /api/blog/:id - soft delete post (auth required) → masuk recycle bin
router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    const { data: existing, error: checkError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (checkError || !existing) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    // Soft delete: set deleted_at (masuk recycle bin)
    const { error } = await supabase
      .from('blog_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (error) {
      console.error('Delete blog post error:', error);
      return res.status(500).json({ error: 'Failed to delete blog post.' });
    }

    res.json({ message: 'Blog post moved to recycle bin.' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Failed to delete blog post.' });
  }
});

module.exports = router;
