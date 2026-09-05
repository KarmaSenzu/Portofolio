const express = require('express');
const slugify = require('slugify');
const { supabase } = require('../config/supabase');
const { verifyAuth } = require('../middleware/supabaseAuth');

const router = express.Router();
// Transform DB row to frontend format
function transformProject(row) {
  return {
    id: row.slug,
    dbId: row.id,
    title: { en: row.title_en, id: row.title_id },
    description: { en: row.description_en, id: row.description_id },
    about: { en: row.about_en, id: row.about_id },
    category: row.category,
    role: row.role,
    techStack: row.tech_stack || [],
    images: row.images || [],
    image: (row.images || [])[0] || null,
    liveUrl: row.live_url,
    repoUrl: row.repo_url,
    date: row.date,
    duration: row.duration,
    status: row.status,
    featured: Boolean(row.featured),
    isPending: Boolean(row.is_pending),
    sortOrder: row.sort_order,
    caseStudy: {
      problem: { en: row.case_study_problem_en, id: row.case_study_problem_id },
      solution: { en: row.case_study_solution_en, id: row.case_study_solution_id },
      result: { en: row.case_study_result_en, id: row.case_study_result_id }
    },
    challenges: row.challenges || [],
    features: row.features || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/projects - list all projects (public, exclude pending & deleted)
router.get('/', async (req, res) => {
  try {
    const { category, status, featured, includePending } = req.query;
    let query = supabase.from('projects').select('*');

    // Default: exclude deleted
    query = query.is('deleted_at', null);

    // Exclude pending UNLESS includePending=true (untuk dashboard/admin)
    if (includePending !== 'true') {
      query = query.eq('is_pending', false);
    }

    if (category) {
      query = query.eq('category', category);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (featured !== undefined) {
      query = query.eq('featured', featured === 'true');
    }

    query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    const projects = data.map(transformProject);
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// GET /api/projects/:slug - get single project (public)
router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Project not found.' });
      }
      throw error;
    }

    res.json(transformProject(data));
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project.' });
  }
});

// PUT /api/projects/reorder - reorder projects (auth required)
router.put('/reorder', verifyAuth, async (req, res) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'Orders must be an array of { id, sort_order }.' });
    }

    // Update each project's sort_order
    for (const item of orders) {
      const { error } = await supabase
        .from('projects')
        .update({ 
          sort_order: item.sort_order,
          updated_by: req.userId 
        })
        .eq('id', item.id);

      if (error) throw error;
    }

    // Fetch updated list
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data.map(transformProject));
  } catch (error) {
    console.error('Reorder projects error:', error);
    res.status(500).json({ error: 'Failed to reorder projects.' });
  }
});

// POST /api/projects - create project (auth required)
router.post('/', verifyAuth, async (req, res) => {
  try {
    const {
      title, description, about, category, role, techStack, images,
      liveUrl, repoUrl, date, duration, status, featured,
      caseStudy, challenges, features
    } = req.body;

    if (!title || !title.en) {
      return res.status(400).json({ error: 'Title (en) is required.' });
    }

    const slug = slugify(title.en, { lower: true, strict: true });

    // Check for duplicate slug
    const { data: existing, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'A project with this title already exists.' });
    }

    // Get max sort_order
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('projects')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const sortOrder = (maxOrderData?.sort_order || 0) + 1;

    // Insert new project
    const { data, error } = await supabase
      .from('projects')
      .insert({
        slug,
        title_en: title.en || '',
        title_id: title.id || '',
        description_en: description?.en || null,
        description_id: description?.id || null,
        about_en: about?.en || null,
        about_id: about?.id || null,
        category: category || 'web-app',
        role: role || 'fullstack',
        tech_stack: techStack || [],
        images: images || [],
        live_url: liveUrl || null,
        repo_url: repoUrl || null,
        date: date || null,
        duration: duration || null,
        status: status || 'completed',
        featured: featured || false,
        sort_order: sortOrder,
        case_study_problem_en: caseStudy?.problem?.en || null,
        case_study_problem_id: caseStudy?.problem?.id || null,
        case_study_solution_en: caseStudy?.solution?.en || null,
        case_study_solution_id: caseStudy?.solution?.id || null,
        case_study_result_en: caseStudy?.result?.en || null,
        case_study_result_id: caseStudy?.result?.id || null,
        challenges: challenges || [],
        features: features || [],
        created_by: req.userId,
        updated_by: req.userId
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'A project with this title already exists.' });
      }
      throw error;
    }

    res.status(201).json(transformProject(data));
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// PUT /api/projects/:id - update project (auth required)
router.put('/:id', verifyAuth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const {
      title, description, about, category, role, techStack, images,
      liveUrl, repoUrl, date, duration, status, featured,
      caseStudy, challenges, features
    } = req.body;

    // Check if project exists
    const { data: existing, error: existError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (existError || !existing) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Generate new slug if title changed
    let slug = existing.slug;
    if (title && title.en && title.en !== existing.title_en) {
      slug = slugify(title.en, { lower: true, strict: true });
      
      // Check for duplicate slug (excluding current project)
      const { data: dupCheck } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .neq('id', projectId)
        .single();

      if (dupCheck) {
        slug = slug + '-' + Date.now();
      }
    }

    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update({
        slug,
        title_en: title?.en ?? existing.title_en,
        title_id: title?.id ?? existing.title_id,
        description_en: description?.en ?? existing.description_en,
        description_id: description?.id ?? existing.description_id,
        about_en: about?.en ?? existing.about_en,
        about_id: about?.id ?? existing.about_id,
        category: category ?? existing.category,
        role: role ?? existing.role,
        tech_stack: techStack ?? existing.tech_stack,
        images: images ?? existing.images,
        live_url: liveUrl ?? existing.live_url,
        repo_url: repoUrl ?? existing.repo_url,
        date: date ?? existing.date,
        duration: duration ?? existing.duration,
        status: status ?? existing.status,
        featured: featured !== undefined ? featured : existing.featured,
        case_study_problem_en: caseStudy?.problem?.en ?? existing.case_study_problem_en,
        case_study_problem_id: caseStudy?.problem?.id ?? existing.case_study_problem_id,
        case_study_solution_en: caseStudy?.solution?.en ?? existing.case_study_solution_en,
        case_study_solution_id: caseStudy?.solution?.id ?? existing.case_study_solution_id,
        case_study_result_en: caseStudy?.result?.en ?? existing.case_study_result_en,
        case_study_result_id: caseStudy?.result?.id ?? existing.case_study_result_id,
        challenges: challenges ?? existing.challenges,
        features: features ?? existing.features,
        updated_by: req.userId
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;

    res.json(transformProject(data));
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id - soft delete project (auth required) → masuk recycle bin
router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    const { data: existing, error: existError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (existError || !existing) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Soft delete: set deleted_at (masuk recycle bin)
    const { error } = await supabase
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Project moved to recycle bin.' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// PATCH /api/projects/:id/pending - toggle pending status (auth required)
router.patch('/:id/pending', verifyAuth, async (req, res) => {
  try {
    const { isPending } = req.body; // boolean

    const { data, error } = await supabase
      .from('projects')
      .update({ is_pending: isPending === true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(transformProject(data));
  } catch (error) {
    console.error('Toggle pending error:', error);
    res.status(500).json({ error: 'Failed to toggle pending status.' });
  }
});

// GET /api/projects/pending/list - list semua pending projects (auth required)
router.get('/pending/list', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_pending', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data.map(transformProject));
  } catch (error) {
    console.error('Get pending projects error:', error);
    res.status(500).json({ error: 'Failed to fetch pending projects.' });
  }
});

module.exports = router;
