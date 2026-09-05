import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/auth';
import { projectService } from '../../services/projects';
import { blogService } from '../../services/blog';
import { skillService } from '../../services/skills';
import { experienceService } from '../../services/experiences';
import { certificateService } from '../../services/certificates';
import { settingsService } from '../../services/settings';
import { uploadService } from '../../services/upload';
import { recycleBinService } from '../../services/recycleBin';
import './Dashboard.css';

// ============ MAIN DASHBOARD ============
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('projects');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({ projects: true });

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const verifyAuth = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }
      try {
        await authService.verify();
        setUser(authService.getUser());
      } catch {
        authService.logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="cms-loading">
        <div className="cms-loading__spinner" />
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  const menuItems = [
    { key: 'projects', icon: 'folder', label: 'Projects', hasChildren: true },
    { key: 'blog', icon: 'article', label: 'Blog Posts' },
    { key: 'skills', icon: 'bolt', label: 'Skills' },
    { key: 'experience', icon: 'work', label: 'Experience' },
    { key: 'certificates', icon: 'verified', label: 'Certificates' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
    { key: 'recycle', icon: 'delete', label: 'Recycle Bin' },
  ];

  return (
    <div className={`cms ${sidebarOpen ? '' : 'cms--collapsed'}`}>
      {/* Sidebar */}
      <aside className="cms-sidebar">
        <div className="cms-sidebar__header">
          <div className="cms-sidebar__logo">
            <span className="cms-sidebar__logo-icon">◆</span>
            {sidebarOpen && <span className="cms-sidebar__logo-text">Portfolio CMS</span>}
          </div>
          <button 
            className="cms-sidebar__toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="cms-sidebar__nav">
          {menuItems.map(item => {
            const isActive = activeSection === item.key;
            const isExpanded = item.hasChildren ? expandedMenus[item.key] : true;
            return (
              <div key={item.key}>
                <button
                  className={`cms-sidebar__item ${isActive && !item.hasChildren ? 'cms-sidebar__item--active' : ''}`}
                  onClick={() => setActiveSection(item.key)}
                  title={item.label}
                >
                  <span className="cms-sidebar__item-icon material-symbols-outlined">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="cms-sidebar__item-label" style={{ flex: 1 }}>{item.label}</span>
                  )}
                  {item.hasChildren && sidebarOpen && (
                    <span
                      className="material-symbols-outlined text-[16px] cursor-pointer hover:bg-surface-container-high rounded p-0.5"
                      style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
                      onClick={(e) => { e.stopPropagation(); toggleMenu(item.key); }}
                    >
                      expand_more
                    </span>
                  )}
                </button>

                {/* Sub-item Pending (hanya jika expanded) */}
                {item.hasChildren && isExpanded && sidebarOpen && (
                  <button
                    className={`cms-sidebar__item ${activeSection === 'pending' ? 'cms-sidebar__item--active' : ''}`}
                    onClick={() => setActiveSection('pending')}
                    style={{ paddingLeft: '36px' }}
                    title="Pending Projects"
                  >
                    <span className="cms-sidebar__item-icon material-symbols-outlined">pending</span>
                    <span className="cms-sidebar__item-label">Pending</span>
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        <div className="cms-sidebar__footer">
          <a href="/" target="_blank" className="cms-sidebar__item" title="View Portfolio">
            <span className="cms-sidebar__item-icon material-symbols-outlined">open_in_new</span>
            {sidebarOpen && <span className="cms-sidebar__item-label">View Portfolio</span>}
          </a>
          <button className="cms-sidebar__item cms-sidebar__item--danger" onClick={handleLogout} title="Logout">
            <span className="cms-sidebar__item-icon material-symbols-outlined">logout</span>
            {sidebarOpen && <span className="cms-sidebar__item-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="cms-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="cms-main__content"
          >
            {activeSection === 'projects' && <ProjectsSection />}
            {activeSection === 'pending' && <PendingSection />}
            {activeSection === 'blog' && <BlogSection />}
            {activeSection === 'skills' && <SkillsSection />}
            {activeSection === 'experience' && <ExperienceSection />}
            {activeSection === 'certificates' && <CertificatesSection />}
            {activeSection === 'settings' && <SettingsSection />}
            {activeSection === 'recycle' && <RecycleBinSection />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// ============ REUSABLE COMPONENTS ============

const PageHeader = ({ title, subtitle, action }) => (
  <div className="cms-page-header">
    <div>
      <h1 className="cms-page-header__title">{title}</h1>
      {subtitle && <p className="cms-page-header__subtitle">{subtitle}</p>}
    </div>
    {action && <div className="cms-page-header__action">{action}</div>}
  </div>
);

const EmptyState = ({ icon, title, description, action }) => (
  <div className="cms-empty">
    <span className="cms-empty__icon material-symbols-outlined">{icon}</span>
    <h3 className="cms-empty__title">{title}</h3>
    <p className="cms-empty__description">{description}</p>
    {action}
  </div>
);

const Toast = ({ message, type = 'success', onClose }) => (
  <motion.div
    className={`cms-toast cms-toast--${type}`}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
  >
    <span>{type === 'success' ? '✓' : '✕'} {message}</span>
    <button onClick={onClose} className="cms-toast__close">×</button>
  </motion.div>
);

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
  <div className="cms-confirm-overlay" onClick={onCancel}>
    <motion.div 
      className="cms-confirm" 
      onClick={e => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="cms-confirm__actions">
        <button className="cms-btn cms-btn--ghost" onClick={onCancel}>Batal</button>
        <button className="cms-btn cms-btn--danger" onClick={onConfirm}>Hapus</button>
      </div>
    </motion.div>
  </div>
);

// Image upload component for the CMS
const CmsImageUpload = ({ value, onChange, multiple = false, label }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      if (multiple) {
        const result = await uploadService.uploadMultiple(Array.from(files));
        const newUrls = result.urls || [];
        onChange([...(value || []), ...newUrls]);
      } else {
        const result = await uploadService.uploadSingle(files[0]);
        onChange(result.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = async (index) => {
    const removedUrl = multiple ? value[index] : value;
    // Hapus dari Cloudinary agar tidak menumpuk
    if (removedUrl && removedUrl.includes('cloudinary.com')) {
      try {
        await uploadService.deleteFile(removedUrl);
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err);
      }
    }
    if (multiple) {
      const newImages = [...value];
      newImages.splice(index, 1);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  const images = multiple ? (value || []) : (value ? [value] : []);

  return (
    <div className="cms-upload">
      {label && <label className="cms-upload__label">{label}</label>}
      
      {images.length > 0 && (
        <div className="cms-upload__preview">
          {images.map((img, i) => (
            <div key={i} className="cms-upload__preview-item">
              <img src={uploadService.getImageUrl(img)} alt="" />
              <button 
                type="button" 
                className="cms-upload__preview-remove" 
                onClick={() => removeImage(i)}
              >×</button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`cms-upload__dropzone ${dragOver ? 'cms-upload__dropzone--active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`upload-${label || 'file'}`).click()}
      >
        <input
          id={`upload-${label || 'file'}`}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <span className="cms-upload__uploading">Uploading...</span>
        ) : (
          <span className="cms-upload__text">
            {dragOver ? 'Drop di sini' : 'Klik atau drag gambar ke sini'}
          </span>
        )}
      </div>
    </div>
  );
};

// ============ PROJECTS SECTION ============
const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (project) => {
    try {
      await projectService.delete(project.dbId);
      setProjects(prev => prev.filter(p => p.dbId !== project.dbId));
      setToast({ message: 'Project berhasil dihapus', type: 'success' });
      setConfirmDelete(null);
    } catch (err) {
      setToast({ message: 'Gagal menghapus project', type: 'error' });
    }
  };

  const handlePending = async (project) => {
    try {
      await projectService.togglePending(project.dbId, true);
      setProjects(prev => prev.filter(p => p.dbId !== project.dbId));
      setToast({ message: 'Project dipindahkan ke Pending', type: 'success' });
    } catch (err) {
      setToast({ message: 'Gagal memindahkan project ke Pending', type: 'error' });
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingProject) {
        const updated = await projectService.update(editingProject.dbId, formData);
        setProjects(prev => prev.map(p => p.dbId === editingProject.dbId ? updated : p));
        setToast({ message: 'Project berhasil diupdate', type: 'success' });
      } else {
        const created = await projectService.create(formData);
        setProjects(prev => [created, ...prev]);
        setToast({ message: 'Project berhasil ditambahkan', type: 'success' });
      }
      setShowForm(false);
    } catch (err) {
      setToast({ message: err.message || 'Gagal menyimpan project', type: 'error' });
    }
  };

  if (loading) return <div className="cms-section-loading"><div className="cms-loading__spinner" /></div>;

  return (
    <div className="cms-section">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project dalam portfolio`}
        action={
          <button className="cms-btn cms-btn--primary" onClick={handleCreate}>
            + New Project
          </button>
        }
      />

      <AnimatePresence>
        {showForm && (
          <ProjectForm
            project={editingProject}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {!showForm && (
        projects.length === 0 ? (
          <EmptyState
            icon="folder"
            title="Belum ada project"
            description="Mulai tambahkan project pertama Anda"
            action={<button className="cms-btn cms-btn--primary" onClick={handleCreate}>+ New Project</button>}
          />
        ) : (
          <div className="cms-list">
            {projects.map(project => (
              <div key={project.dbId || project.id} className="cms-list__item">
                <div className="cms-list__item-left">
                  {project.image && (
                    <img 
                      src={uploadService.getImageUrl(project.image)} 
                      alt="" 
                      className="cms-list__thumb" 
                    />
                  )}
                  <div className="cms-list__item-info">
                    <h3 className="cms-list__item-title">{project.title?.en || 'Untitled'}</h3>
                    <div className="cms-list__item-meta">
                      <span className={`cms-tag cms-tag--${project.category}`}>{project.category}</span>
                      <span className="cms-tag">{project.role}</span>
                      {project.featured && <span className="cms-tag cms-tag--featured">★ Featured</span>}
                      <span className="cms-list__item-date">{project.date}</span>
                    </div>
                    <div className="cms-list__item-tech">
                      {project.techStack?.slice(0, 4).map(t => (
                        <span key={t} className="cms-tech">{t}</span>
                      ))}
                      {project.techStack?.length > 4 && (
                        <span className="cms-tech cms-tech--more">+{project.techStack.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="cms-list__item-actions">
                  <button className="cms-icon-btn" onClick={() => handleEdit(project)} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="cms-icon-btn" onClick={() => handlePending(project)} title="Pending (sembunyikan dari website)">
                    <span className="material-symbols-outlined text-[16px]">pause</span>
                  </button>
                  <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => setConfirmDelete(project)} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {confirmDelete && (
        <ConfirmDialog
          title="Hapus Project?"
          message={`Yakin ingin menghapus "${confirmDelete.title?.en}"? Aksi ini tidak bisa dibatalkan.`}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

// ============ PROJECT FORM ============
const ProjectForm = ({ project, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: project?.title || { en: '', id: '' },
    description: project?.description || { en: '', id: '' },
    about: project?.about || { en: '', id: '' },
    category: project?.category || 'web-app',
    role: project?.role || 'fullstack',
    techStack: project?.techStack || [],
    images: project?.images || [],
    liveUrl: project?.liveUrl || '',
    repoUrl: project?.repoUrl || '',
    date: project?.date || '',
    duration: project?.duration || '',
    status: project?.status || 'completed',
    featured: project?.featured || false,
    caseStudy: project?.caseStudy || { problem: { en: '', id: '' }, solution: { en: '', id: '' }, result: { en: '', id: '' } },
    features: project?.features || [],
    challenges: project?.challenges || [],
  });
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('basic');

  const updateField = (path, value) => {
    setForm(prev => {
      const newForm = { ...prev };
      const keys = path.split('.');
      let obj = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newForm;
    });
  };

  const addTech = () => {
    if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
      updateField('techStack', [...form.techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    updateField('techStack', form.techStack.filter(t => t !== tech));
  };

  const addFeature = () => {
    updateField('features', [...form.features, { icon: '', title: { en: '', id: '' }, description: { en: '', id: '' } }]);
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...form.features];
    const keys = field.split('.');
    if (keys.length === 1) {
      newFeatures[index] = { ...newFeatures[index], [field]: value };
    } else {
      newFeatures[index] = { ...newFeatures[index], [keys[0]]: { ...newFeatures[index][keys[0]], [keys[1]]: value } };
    }
    updateField('features', newFeatures);
  };

  const removeFeature = (index) => {
    updateField('features', form.features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const formTabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'detail', label: 'Details' },
    { key: 'media', label: 'Media & Links' },
    { key: 'about', label: 'About' },
    { key: 'casestudy', label: 'Case Study' },
    { key: 'features', label: 'Features' },
  ];

  return (
    <motion.div
      className="cms-form-wrapper"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="cms-form">
        <div className="cms-form__header">
          <h2>{project ? 'Edit Project' : 'New Project'}</h2>
          <button className="cms-icon-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="cms-form__tabs">
          {formTabs.map(tab => (
            <button
              key={tab.key}
              className={`cms-form__tab ${activeFormTab === tab.key ? 'cms-form__tab--active' : ''}`}
              onClick={() => setActiveFormTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="cms-form__body">
          {activeFormTab === 'basic' && (
            <div className="cms-form__section">
              <div className="cms-field">
                <label>Title (English) <span className="cms-required">*</span></label>
                <input type="text" value={form.title.en} onChange={e => updateField('title.en', e.target.value)} placeholder="Project title in English" required className="cms-input" />
              </div>
              <div className="cms-field">
                <label>Title (Indonesia)</label>
                <input type="text" value={form.title.id} onChange={e => updateField('title.id', e.target.value)} placeholder="Judul project dalam Bahasa Indonesia" className="cms-input" />
              </div>
              <div className="cms-field">
                <label>Short Description (EN) <span className="cms-required">*</span></label>
                <textarea value={form.description.en} onChange={e => updateField('description.en', e.target.value)} placeholder="Brief description..." rows="2" required className="cms-input" />
              </div>
              <div className="cms-field">
                <label>Short Description (ID)</label>
                <textarea value={form.description.id} onChange={e => updateField('description.id', e.target.value)} placeholder="Deskripsi singkat..." rows="2" className="cms-input" />
              </div>
            </div>
          )}

          {activeFormTab === 'detail' && (
            <div className="cms-form__section">
              <div className="cms-field-row">
                <div className="cms-field">
                  <label>Category</label>
                  <select value={form.category} onChange={e => updateField('category', e.target.value)} className="cms-input">
                    <option value="web-app">Web App</option>
                    <option value="mobile">Mobile</option>
                    <option value="open-source">Open Source</option>
                    <option value="design">Design</option>
                  </select>
                </div>
                <div className="cms-field">
                  <label>Role</label>
                  <select value={form.role} onChange={e => updateField('role', e.target.value)} className="cms-input">
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Fullstack</option>
                  </select>
                </div>
                <div className="cms-field">
                  <label>Status</label>
                  <select value={form.status} onChange={e => updateField('status', e.target.value)} className="cms-input">
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>
              <div className="cms-field-row">
                <div className="cms-field">
                  <label>Date</label>
                  <input type="text" value={form.date} onChange={e => updateField('date', e.target.value)} placeholder="Oct 2023" className="cms-input" />
                </div>
                <div className="cms-field">
                  <label>Duration</label>
                  <input type="text" value={form.duration} onChange={e => updateField('duration', e.target.value)} placeholder="6 Weeks" className="cms-input" />
                </div>
              </div>
              <div className="cms-field">
                <label>Tech Stack</label>
                <div className="cms-tags-input">
                  <div className="cms-tags-input__tags">
                    {form.techStack.map(tech => (
                      <span key={tech} className="cms-tags-input__tag">
                        {tech}
                        <button type="button" onClick={() => removeTech(tech)}>×</button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="Type and press Enter..."
                    className="cms-tags-input__input"
                  />
                </div>
              </div>
              <div className="cms-field">
                <label className="cms-checkbox">
                  <input type="checkbox" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} />
                  <span>Featured on homepage</span>
                </label>
              </div>
            </div>
          )}

          {activeFormTab === 'media' && (
            <div className="cms-form__section">
              <CmsImageUpload
                label="Project Images"
                value={form.images}
                onChange={images => updateField('images', images)}
                multiple={true}
              />
              <div className="cms-field-row">
                <div className="cms-field">
                  <label>Live Demo URL</label>
                  <input type="url" value={form.liveUrl} onChange={e => updateField('liveUrl', e.target.value)} placeholder="https://your-project.com" className="cms-input" />
                </div>
                <div className="cms-field">
                  <label>GitHub Repo URL</label>
                  <input type="url" value={form.repoUrl} onChange={e => updateField('repoUrl', e.target.value)} placeholder="https://github.com/..." className="cms-input" />
                </div>
              </div>
            </div>
          )}

          {activeFormTab === 'about' && (
            <div className="cms-form__section">
              <div className="cms-field">
                <label>About (English)</label>
                <textarea value={form.about.en} onChange={e => updateField('about.en', e.target.value)} rows="6" placeholder="Full project description..." className="cms-input cms-input--lg" />
              </div>
              <div className="cms-field">
                <label>About (Indonesia)</label>
                <textarea value={form.about.id} onChange={e => updateField('about.id', e.target.value)} rows="6" placeholder="Deskripsi lengkap project..." className="cms-input cms-input--lg" />
              </div>
            </div>
          )}

          {activeFormTab === 'casestudy' && (
            <div className="cms-form__section">
              <div className="cms-casestudy">
                <div className="cms-casestudy__block cms-casestudy__block--problem">
                  <h4>🔴 Problem</h4>
                  <div className="cms-field"><label>English</label><textarea value={form.caseStudy.problem.en} onChange={e => updateField('caseStudy.problem.en', e.target.value)} rows="3" className="cms-input" placeholder="What problem does this solve?" /></div>
                  <div className="cms-field"><label>Indonesia</label><textarea value={form.caseStudy.problem.id} onChange={e => updateField('caseStudy.problem.id', e.target.value)} rows="3" className="cms-input" placeholder="Masalah apa yang dipecahkan?" /></div>
                </div>
                <div className="cms-casestudy__block cms-casestudy__block--solution">
                  <h4>🟢 Solution</h4>
                  <div className="cms-field"><label>English</label><textarea value={form.caseStudy.solution.en} onChange={e => updateField('caseStudy.solution.en', e.target.value)} rows="3" className="cms-input" placeholder="How did you solve it?" /></div>
                  <div className="cms-field"><label>Indonesia</label><textarea value={form.caseStudy.solution.id} onChange={e => updateField('caseStudy.solution.id', e.target.value)} rows="3" className="cms-input" placeholder="Bagaimana solusinya?" /></div>
                </div>
                <div className="cms-casestudy__block cms-casestudy__block--result">
                  <h4>🔵 Result</h4>
                  <div className="cms-field"><label>English</label><textarea value={form.caseStudy.result.en} onChange={e => updateField('caseStudy.result.en', e.target.value)} rows="3" className="cms-input" placeholder="What was the outcome?" /></div>
                  <div className="cms-field"><label>Indonesia</label><textarea value={form.caseStudy.result.id} onChange={e => updateField('caseStudy.result.id', e.target.value)} rows="3" className="cms-input" placeholder="Apa hasilnya?" /></div>
                </div>
              </div>
            </div>
          )}

          {activeFormTab === 'features' && (
            <div className="cms-form__section">
              {form.features.map((feature, index) => (
                <div key={index} className="cms-feature-card">
                  <div className="cms-feature-card__header">
                    <span>Feature {index + 1}</span>
                    <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => removeFeature(index)}>✕</button>
                  </div>
                  <div className="cms-field-row">
                    <div className="cms-field" style={{ maxWidth: '80px' }}>
                      <label>Icon</label>
                      <input type="text" value={feature.icon} onChange={e => updateFeature(index, 'icon', e.target.value)} placeholder="📊" maxLength="3" className="cms-input" style={{ textAlign: 'center' }} />
                    </div>
                    <div className="cms-field">
                      <label>Title (EN)</label>
                      <input type="text" value={feature.title?.en || ''} onChange={e => updateFeature(index, 'title.en', e.target.value)} className="cms-input" />
                    </div>
                    <div className="cms-field">
                      <label>Title (ID)</label>
                      <input type="text" value={feature.title?.id || ''} onChange={e => updateFeature(index, 'title.id', e.target.value)} className="cms-input" />
                    </div>
                  </div>
                  <div className="cms-field-row">
                    <div className="cms-field">
                      <label>Description (EN)</label>
                      <input type="text" value={feature.description?.en || ''} onChange={e => updateFeature(index, 'description.en', e.target.value)} className="cms-input" />
                    </div>
                    <div className="cms-field">
                      <label>Description (ID)</label>
                      <input type="text" value={feature.description?.id || ''} onChange={e => updateFeature(index, 'description.id', e.target.value)} className="cms-input" />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="cms-btn cms-btn--outline cms-btn--full" onClick={addFeature}>+ Add Feature</button>
            </div>
          )}

          <div className="cms-form__footer">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="cms-btn cms-btn--primary" disabled={saving}>
              {saving ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// ============ BLOG SECTION ============
const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await blogService.getAll();
      setPosts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSave = async (formData) => {
    try {
      if (editingPost) {
        const updated = await blogService.update(editingPost.dbId, formData);
        setPosts(prev => prev.map(p => p.dbId === editingPost.dbId ? updated : p));
        setToast({ message: 'Blog post berhasil diupdate', type: 'success' });
      } else {
        const created = await blogService.create(formData);
        setPosts(prev => [created, ...prev]);
        setToast({ message: 'Blog post berhasil ditambahkan', type: 'success' });
      }
      setShowForm(false);
    } catch (err) {
      setToast({ message: err.message || 'Gagal menyimpan blog post', type: 'error' });
    }
  };

  const handleDelete = async (post) => {
    try {
      await blogService.delete(post.dbId);
      setPosts(prev => prev.filter(p => p.dbId !== post.dbId));
      setToast({ message: 'Blog post berhasil dihapus', type: 'success' });
      setConfirmDelete(null);
    } catch (err) {
      setToast({ message: 'Gagal menghapus blog post', type: 'error' });
    }
  };

  if (loading) return <div className="cms-section-loading"><div className="cms-loading__spinner" /></div>;

  return (
    <div className="cms-section">
      <PageHeader
        title="Blog Posts"
        subtitle={`${posts.length} artikel`}
        action={<button className="cms-btn cms-btn--primary" onClick={() => { setEditingPost(null); setShowForm(true); }}>+ New Post</button>}
      />

      <AnimatePresence>
        {showForm && (
          <BlogForm
            post={editingPost}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {!showForm && (
        posts.length === 0 ? (
          <EmptyState icon="article" title="Belum ada blog post" description="Mulai menulis artikel pertama Anda" action={<button className="cms-btn cms-btn--primary" onClick={() => { setEditingPost(null); setShowForm(true); }}>+ New Post</button>} />
        ) : (
          <div className="cms-list">
            {posts.map(post => (
              <div key={post.dbId || post.id} className="cms-list__item">
                <div className="cms-list__item-left">
                  {post.image && <img src={uploadService.getImageUrl(post.image)} alt="" className="cms-list__thumb" />}
                  <div className="cms-list__item-info">
                    <h3 className="cms-list__item-title">{post.title?.en || 'Untitled'}</h3>
                    <div className="cms-list__item-meta">
                      <span className="cms-tag">{post.category}</span>
                      <span className="cms-list__item-date">{post.readTime} min read</span>
                      <span className="cms-list__item-date">{post.date}</span>
                    </div>
                  </div>
                </div>
                <div className="cms-list__item-actions">
                  <button className="cms-icon-btn" onClick={() => { setEditingPost(post); setShowForm(true); }} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => setConfirmDelete(post)} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      {confirmDelete && <ConfirmDialog title="Hapus Blog Post?" message={`Yakin ingin menghapus "${confirmDelete.title?.en}"?`} onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
};

// ============ BLOG FORM ============
const BlogForm = ({ post, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: post?.title || { en: '', id: '' },
    excerpt: post?.excerpt || { en: '', id: '' },
    content: post?.content || { en: '', id: '' },
    category: post?.category || 'tutorials',
    tags: post?.tags || [],
    image: post?.image || '',
    readTime: post?.readTime || 5,
    published: post?.published !== undefined ? post.published : true,
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const updateField = (path, value) => {
    setForm(prev => {
      const newForm = { ...prev };
      const keys = path.split('.');
      let obj = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newForm;
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      updateField('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <motion.div className="cms-form-wrapper" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
      <div className="cms-form">
        <div className="cms-form__header">
          <h2>{post ? 'Edit Blog Post' : 'New Blog Post'}</h2>
          <button className="cms-icon-btn" onClick={onCancel}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="cms-form__body">
          <div className="cms-form__section">
            <div className="cms-field"><label>Title (EN) <span className="cms-required">*</span></label><input type="text" value={form.title.en} onChange={e => updateField('title.en', e.target.value)} required className="cms-input" placeholder="Blog post title" /></div>
            <div className="cms-field"><label>Title (ID)</label><input type="text" value={form.title.id} onChange={e => updateField('title.id', e.target.value)} className="cms-input" placeholder="Judul blog post" /></div>
            
            <div className="cms-field-row">
              <div className="cms-field">
                <label>Category</label>
                <select value={form.category} onChange={e => updateField('category', e.target.value)} className="cms-input">
                  <option value="tutorials">Tutorials</option>
                  <option value="thoughts">Thoughts</option>
                  <option value="tips">Tips & Tricks</option>
                </select>
              </div>
              <div className="cms-field">
                <label>Read Time (min)</label>
                <input type="number" value={form.readTime} onChange={e => updateField('readTime', parseInt(e.target.value) || 5)} min="1" className="cms-input" />
              </div>
            </div>

            <div className="cms-field">
              <label>Tags</label>
              <div className="cms-tags-input">
                <div className="cms-tags-input__tags">
                  {form.tags.map(tag => (
                    <span key={tag} className="cms-tags-input__tag">{tag}<button type="button" onClick={() => updateField('tags', form.tags.filter(t => t !== tag))}>×</button></span>
                  ))}
                </div>
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} placeholder="Add tag..." className="cms-tags-input__input" />
              </div>
            </div>

            <CmsImageUpload label="Cover Image" value={form.image} onChange={img => updateField('image', img)} />

            <div className="cms-field"><label>Excerpt (EN) <span className="cms-required">*</span></label><textarea value={form.excerpt.en} onChange={e => updateField('excerpt.en', e.target.value)} rows="2" required className="cms-input" placeholder="Short summary..." /></div>
            <div className="cms-field"><label>Excerpt (ID)</label><textarea value={form.excerpt.id} onChange={e => updateField('excerpt.id', e.target.value)} rows="2" className="cms-input" placeholder="Ringkasan singkat..." /></div>

            <div className="cms-field"><label>Content (EN) <span className="cms-required">*</span></label><textarea value={form.content.en} onChange={e => updateField('content.en', e.target.value)} rows="10" required className="cms-input cms-input--lg" placeholder="Full blog content (supports Markdown)..." /></div>
            <div className="cms-field"><label>Content (ID)</label><textarea value={form.content.id} onChange={e => updateField('content.id', e.target.value)} rows="10" className="cms-input cms-input--lg" placeholder="Konten blog lengkap..." /></div>

            <div className="cms-field">
              <label className="cms-checkbox"><input type="checkbox" checked={form.published} onChange={e => updateField('published', e.target.checked)} /><span>Published</span></label>
            </div>
          </div>

          <div className="cms-form__footer">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="cms-btn cms-btn--primary" disabled={saving}>{saving ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// ============ SKILLS SECTION ============
const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    skillService.getAll().then(data => { setSkills(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingSkill) {
        const updated = await skillService.update(editingSkill.id, formData);
        setSkills(prev => prev.map(s => s.id === editingSkill.id ? updated : s));
        setToast({ message: 'Skill updated', type: 'success' });
      } else {
        const created = await skillService.create(formData);
        setSkills(prev => [...prev, created]);
        setToast({ message: 'Skill added', type: 'success' });
      }
      setShowForm(false);
      setEditingSkill(null);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (skill) => {
    try {
      await skillService.delete(skill.id);
      setSkills(prev => prev.filter(s => s.id !== skill.id));
      setToast({ message: 'Skill deleted', type: 'success' });
      setConfirmDelete(null);
    } catch (err) {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
  };

  if (loading) return <div className="cms-section-loading"><div className="cms-loading__spinner" /></div>;

  return (
    <div className="cms-section">
      <PageHeader title="Skills" subtitle={`${skills.length} skills`} action={<button className="cms-btn cms-btn--primary" onClick={() => { setEditingSkill(null); setShowForm(true); }}>+ Add Skill</button>} />

      <AnimatePresence>
        {showForm && (
          <motion.div className="cms-form-wrapper" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <SkillForm skill={editingSkill} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingSkill(null); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <div className="cms-grid">
          {skills.map(skill => (
            <div key={skill.id} className="cms-skill-card" style={{ borderLeftColor: skill.color }}>
              <div className="cms-skill-card__icon">{skill.icon}</div>
              <div className="cms-skill-card__info">
                <h4>{skill.name}</h4>
                <span className="cms-tag">{skill.category}</span>
              </div>
              <div className="cms-skill-card__actions">
                <button className="cms-icon-btn" onClick={() => { setEditingSkill(skill); setShowForm(true); }}>✏️</button>
                <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => setConfirmDelete(skill)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      {confirmDelete && <ConfirmDialog title="Delete Skill?" message={`Delete "${confirmDelete.name}"?`} onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
};

const SkillForm = ({ skill, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: skill?.name || '',
    icon: skill?.icon || '',
    category: skill?.category || 'frontend',
    color: skill?.color || '#2563eb',
  });

  return (
    <div className="cms-form">
      <div className="cms-form__header"><h2>{skill ? 'Edit Skill' : 'New Skill'}</h2><button className="cms-icon-btn" onClick={onCancel}>✕</button></div>
      <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="cms-form__body">
        <div className="cms-form__section">
          <div className="cms-field-row">
            <div className="cms-field" style={{ maxWidth: '80px' }}><label>Icon</label><input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="⚛️" maxLength="3" className="cms-input" style={{ textAlign: 'center', fontSize: '1.5rem' }} /></div>
            <div className="cms-field"><label>Name <span className="cms-required">*</span></label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="cms-input" /></div>
          </div>
          <div className="cms-field-row">
            <div className="cms-field">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="cms-input">
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="devops">DevOps</option>
                <option value="design">Design</option>
                <option value="tools">Tools</option>
              </select>
            </div>
            <div className="cms-field"><label>Color</label><input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="cms-input cms-input--color" /></div>
          </div>
        </div>
        <div className="cms-form__footer">
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="cms-btn cms-btn--primary">{skill ? 'Update' : 'Add Skill'}</button>
        </div>
      </form>
    </div>
  );
};

// ============ EXPERIENCE SECTION ============
const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    experienceService.getAll().then(data => { setExperiences(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingExp) {
        const updated = await experienceService.update(editingExp.id, formData);
        setExperiences(prev => prev.map(e => e.id === editingExp.id ? updated : e));
        setToast({ message: 'Experience updated', type: 'success' });
      } else {
        const created = await experienceService.create(formData);
        setExperiences(prev => [...prev, created]);
        setToast({ message: 'Experience added', type: 'success' });
      }
      setShowForm(false);
      setEditingExp(null);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (exp) => {
    try {
      await experienceService.delete(exp.id);
      setExperiences(prev => prev.filter(e => e.id !== exp.id));
      setToast({ message: 'Experience deleted', type: 'success' });
      setConfirmDelete(null);
    } catch (err) {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
  };

  if (loading) return <div className="cms-section-loading"><div className="cms-loading__spinner" /></div>;

  return (
    <div className="cms-section">
      <PageHeader title="Experience" subtitle={`${experiences.length} entries`} action={<button className="cms-btn cms-btn--primary" onClick={() => { setEditingExp(null); setShowForm(true); }}>+ Add Experience</button>} />

      <AnimatePresence>
        {showForm && (
          <motion.div className="cms-form-wrapper" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <ExperienceForm experience={editingExp} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingExp(null); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <div className="cms-list">
          {experiences.map(exp => (
            <div key={exp.id} className="cms-list__item">
              <div className="cms-list__item-left">
                <div className={`cms-exp-dot ${exp.current ? 'cms-exp-dot--active' : ''}`} />
                <div className="cms-list__item-info">
                  <h3 className="cms-list__item-title">{exp.title?.en || 'Untitled'}</h3>
                  <div className="cms-list__item-meta">
                    <span>{exp.company}</span>
                    <span className="cms-list__item-date">{exp.period?.en}</span>
                    {exp.isEducation && <span className="cms-tag">Education</span>}
                    {exp.current && <span className="cms-tag cms-tag--featured">Current</span>}
                  </div>
                </div>
              </div>
              <div className="cms-list__item-actions">
                <button className="cms-icon-btn" onClick={() => { setEditingExp(exp); setShowForm(true); }}>✏️</button>
                <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => setConfirmDelete(exp)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      {confirmDelete && <ConfirmDialog title="Delete Experience?" message={`Delete "${confirmDelete.title?.en}"?`} onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
};

const ExperienceForm = ({ experience, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: experience?.title || { en: '', id: '' },
    company: experience?.company || '',
    period: experience?.period || { en: '', id: '' },
    description: experience?.description || { en: '', id: '' },
    current: experience?.current || false,
    isEducation: experience?.isEducation || false,
  });

  return (
    <div className="cms-form">
      <div className="cms-form__header"><h2>{experience ? 'Edit Experience' : 'New Experience'}</h2><button className="cms-icon-btn" onClick={onCancel}>✕</button></div>
      <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="cms-form__body">
        <div className="cms-form__section">
          <div className="cms-field"><label>Title (EN) <span className="cms-required">*</span></label><input type="text" value={form.title.en} onChange={e => setForm({ ...form, title: { ...form.title, en: e.target.value } })} required className="cms-input" placeholder="Senior Frontend Developer" /></div>
          <div className="cms-field"><label>Title (ID)</label><input type="text" value={form.title.id} onChange={e => setForm({ ...form, title: { ...form.title, id: e.target.value } })} className="cms-input" /></div>
          <div className="cms-field"><label>Company / Institution</label><input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="cms-input" placeholder="TechFlow Solutions" /></div>
          <div className="cms-field-row">
            <div className="cms-field"><label>Period (EN)</label><input type="text" value={form.period.en} onChange={e => setForm({ ...form, period: { ...form.period, en: e.target.value } })} className="cms-input" placeholder="2023 - Present" /></div>
            <div className="cms-field"><label>Period (ID)</label><input type="text" value={form.period.id} onChange={e => setForm({ ...form, period: { ...form.period, id: e.target.value } })} className="cms-input" placeholder="2023 - Sekarang" /></div>
          </div>
          <div className="cms-field"><label>Description (EN)</label><textarea value={form.description.en} onChange={e => setForm({ ...form, description: { ...form.description, en: e.target.value } })} rows="3" className="cms-input" /></div>
          <div className="cms-field"><label>Description (ID)</label><textarea value={form.description.id} onChange={e => setForm({ ...form, description: { ...form.description, id: e.target.value } })} rows="3" className="cms-input" /></div>
          <div className="cms-field-row">
            <div className="cms-field"><label className="cms-checkbox"><input type="checkbox" checked={form.current} onChange={e => setForm({ ...form, current: e.target.checked })} /><span>Currently working here</span></label></div>
            <div className="cms-field"><label className="cms-checkbox"><input type="checkbox" checked={form.isEducation} onChange={e => setForm({ ...form, isEducation: e.target.checked })} /><span>Education</span></label></div>
          </div>
        </div>
        <div className="cms-form__footer">
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="cms-btn cms-btn--primary">{experience ? 'Update' : 'Add Experience'}</button>
        </div>
      </form>
    </div>
  );
};

// ============ CERTIFICATES SECTION ============
const CertificatesSection = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    certificateService.getAll().then(data => { setCerts(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingCert) {
        const updated = await certificateService.update(editingCert.id, formData);
        setCerts(prev => prev.map(c => c.id === editingCert.id ? updated : c));
        setToast({ message: 'Certificate updated', type: 'success' });
      } else {
        const created = await certificateService.create(formData);
        setCerts(prev => [...prev, created]);
        setToast({ message: 'Certificate added', type: 'success' });
      }
      setShowForm(false);
      setEditingCert(null);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (cert) => {
    try {
      await certificateService.delete(cert.id);
      setCerts(prev => prev.filter(c => c.id !== cert.id));
      setToast({ message: 'Certificate deleted', type: 'success' });
      setConfirmDelete(null);
    } catch (err) {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
  };

  if (loading) return <div className="cms-section-loading"><div className="cms-loading__spinner" /></div>;

  return (
    <div className="cms-section">
      <PageHeader title="Certificates" subtitle={`${certs.length} certificates`} action={<button className="cms-btn cms-btn--primary" onClick={() => { setEditingCert(null); setShowForm(true); }}>+ Add Certificate</button>} />

      <AnimatePresence>
        {showForm && (
          <motion.div className="cms-form-wrapper" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <CertificateForm cert={editingCert} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingCert(null); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <div className="cms-grid">
          {certs.map(cert => (
            <div key={cert.id} className="cms-cert-card">
              {cert.image && <img src={uploadService.getImageUrl(cert.image)} alt="" className="cms-cert-card__image" />}
              <div className="cms-cert-card__info">
                <h4>{cert.title?.en || 'Untitled'}</h4>
                <p>{cert.issuer} · {cert.date}</p>
              </div>
              <div className="cms-cert-card__actions">
                <button className="cms-icon-btn" onClick={() => { setEditingCert(cert); setShowForm(true); }}>✏️</button>
                <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => setConfirmDelete(cert)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
      {confirmDelete && <ConfirmDialog title="Delete Certificate?" message={`Delete "${confirmDelete.title?.en}"?`} onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
};

const CertificateForm = ({ cert, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: cert?.title || { en: '', id: '' },
    issuer: cert?.issuer || '',
    date: cert?.date || '',
    credentialId: cert?.credentialId || '',
    image: cert?.image || '',
    credentialUrl: cert?.credentialUrl || '',
  });

  return (
    <div className="cms-form">
      <div className="cms-form__header"><h2>{cert ? 'Edit Certificate' : 'New Certificate'}</h2><button className="cms-icon-btn" onClick={onCancel}>✕</button></div>
      <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="cms-form__body">
        <div className="cms-form__section">
          <div className="cms-field"><label>Title (EN) <span className="cms-required">*</span></label><input type="text" value={form.title.en} onChange={e => setForm({ ...form, title: { ...form.title, en: e.target.value } })} required className="cms-input" /></div>
          <div className="cms-field"><label>Title (ID)</label><input type="text" value={form.title.id} onChange={e => setForm({ ...form, title: { ...form.title, id: e.target.value } })} className="cms-input" /></div>
          <div className="cms-field-row">
            <div className="cms-field"><label>Issuer</label><input type="text" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} className="cms-input" placeholder="Amazon Web Services" /></div>
            <div className="cms-field"><label>Date</label><input type="text" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="cms-input" placeholder="Jan 2024" /></div>
          </div>
          <div className="cms-field"><label>Credential ID</label><input type="text" value={form.credentialId} onChange={e => setForm({ ...form, credentialId: e.target.value })} className="cms-input" /></div>
          <div className="cms-field"><label>Credential URL</label><input type="url" value={form.credentialUrl} onChange={e => setForm({ ...form, credentialUrl: e.target.value })} className="cms-input" /></div>
          <CmsImageUpload label="Certificate Image" value={form.image} onChange={img => setForm({ ...form, image: img })} />
        </div>
        <div className="cms-form__footer">
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="cms-btn cms-btn--primary">{cert ? 'Update' : 'Add Certificate'}</button>
        </div>
      </form>
    </div>
  );
};

// ============ SETTINGS SECTION ============
const SettingsSection = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    settingsService.getAll().then(data => { setSettings(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (key, value) => {
    try {
      await settingsService.update(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
      setToast({ message: 'Settings saved', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to save', type: 'error' });
    }
  };

  if (loading) return <div className="cms-section-loading"><div className="cms-loading__spinner" /></div>;

  return (
    <div className="cms-section">
      <PageHeader title="Settings" subtitle="Manage site configuration" />

      <div className="cms-settings">
        <div className="cms-settings__card">
          <h3>Profile Images (About)</h3>
          <p className="cms-settings__desc">Foto-foto profil yang ditampilkan di halaman About (bisa upload beberapa, flip card akan berganti)</p>
          <CmsImageUpload
            label="Upload Foto Profil"
            value={settings.profile_images || []}
            multiple
            onChange={(urls) => handleSave('profile_images', urls)}
          />
        </div>

        <div className="cms-settings__card">
          <h3>Hobbies</h3>
          <p className="cms-settings__desc">Hobbies displayed on the About page</p>
          <HobbiesEditor 
            hobbies={settings.hobbies || []} 
            onSave={(hobbies) => handleSave('hobbies', hobbies)} 
          />
        </div>
      </div>

      <AnimatePresence>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</AnimatePresence>
    </div>
  );
};

const HobbiesEditor = ({ hobbies, onSave }) => {
  const [items, setItems] = useState(hobbies);

  const addHobby = () => {
    setItems(prev => [...prev, { icon: '', title: { en: '', id: '' }, description: { en: '', id: '' }, color: '#2563eb' }]);
  };

  const updateHobby = (index, field, value) => {
    setItems(prev => {
      const newItems = [...prev];
      const keys = field.split('.');
      if (keys.length === 1) {
        newItems[index] = { ...newItems[index], [field]: value };
      } else {
        newItems[index] = { ...newItems[index], [keys[0]]: { ...newItems[index][keys[0]], [keys[1]]: value } };
      }
      return newItems;
    });
  };

  return (
    <div className="cms-settings__editor">
      {items.map((hobby, i) => (
        <div key={i} className="cms-feature-card">
          <div className="cms-feature-card__header">
            <span>Hobby {i + 1}</span>
            <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
          </div>
          <div className="cms-field-row">
            <div className="cms-field" style={{ maxWidth: '80px' }}><label>Icon</label><input type="text" value={hobby.icon} onChange={e => updateHobby(i, 'icon', e.target.value)} className="cms-input" style={{ textAlign: 'center', fontSize: '1.5rem' }} maxLength="3" /></div>
            <div className="cms-field"><label>Title (EN)</label><input type="text" value={hobby.title?.en || ''} onChange={e => updateHobby(i, 'title.en', e.target.value)} className="cms-input" /></div>
            <div className="cms-field"><label>Title (ID)</label><input type="text" value={hobby.title?.id || ''} onChange={e => updateHobby(i, 'title.id', e.target.value)} className="cms-input" /></div>
          </div>
          <div className="cms-field-row">
            <div className="cms-field"><label>Desc (EN)</label><input type="text" value={hobby.description?.en || ''} onChange={e => updateHobby(i, 'description.en', e.target.value)} className="cms-input" /></div>
            <div className="cms-field"><label>Desc (ID)</label><input type="text" value={hobby.description?.id || ''} onChange={e => updateHobby(i, 'description.id', e.target.value)} className="cms-input" /></div>
            <div className="cms-field" style={{ maxWidth: '80px' }}><label>Color</label><input type="color" value={hobby.color || '#2563eb'} onChange={e => updateHobby(i, 'color', e.target.value)} className="cms-input cms-input--color" /></div>
          </div>
        </div>
      ))}
      <button type="button" className="cms-btn cms-btn--outline cms-btn--full" onClick={addHobby}>+ Add Hobby</button>
      <button className="cms-btn cms-btn--primary" onClick={() => onSave(items)} style={{ marginTop: '12px' }}>Save Hobbies</button>
    </div>
  );
};

// ============ PENDING PROJECTS SECTION ============
const PendingSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await projectService.getPending();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch pending projects:', error);
      showToast('Gagal memuat project pending', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleUnpending = async (project) => {
    try {
      await projectService.togglePending(project.dbId, false);
      showToast(`"${project.title?.en || project.title?.id}" dikembalikan ke Projects`);
      fetchPending();
    } catch (error) {
      console.error('Unpending error:', error);
      showToast('Gagal mengembalikan project', 'error');
    }
  };

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-header__title">Pending Projects</h1>
          <p className="cms-page-header__subtitle">
            Project yang di-pending tidak tampil di website publik. Kembalikan untuk menampilkannya kembali.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="cms-section-loading"><div className="cms-loading__spinner" /></div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon="pending"
          title="Tidak ada project pending"
          description="Project yang di-pending akan muncul di sini"
        />
      ) : (
        <div className="cms-list">
          {projects.map((project) => (
            <div key={project.dbId} className="cms-list__item">
              <div className="cms-list__item-left">
                {project.image && (
                  <img className="cms-list__thumb" src={project.image} alt={project.title?.en} />
                )}
                <div className="cms-list__item-info">
                  <span className="cms-list__item-title">{project.title?.en || project.title?.id}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span className="cms-tag" style={{ textTransform: 'capitalize' }}>{project.category}</span>
                    {project.date && <span className="cms-list__item-date">{project.date}</span>}
                  </div>
                </div>
              </div>
              <div className="cms-list__item-actions" style={{ opacity: 1, display: 'flex', gap: '6px' }}>
                <button className="cms-btn cms-btn--primary" onClick={() => handleUnpending(project)}>
                  Kembalikan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ============ RECYCLE BIN SECTION ============
const RecycleBinSection = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await recycleBinService.getAll();
      setItems(Array.isArray(data) ? data : []);
      setSelected(new Set());
    } catch (error) {
      console.error('Failed to fetch recycle bin:', error);
      showToast('Gagal memuat recycle bin', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleSelect = (key) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map(i => `${i.entity}-${i.id}`)));
    }
  };

  const handleRestore = async (itemsToRestore) => {
    try {
      await recycleBinService.restore(itemsToRestore);
      showToast('Item berhasil dikembalikan');
      fetchItems();
    } catch (error) {
      console.error('Restore error:', error);
      showToast('Gagal mengembalikan item', 'error');
    }
  };

  const handlePermanentDelete = async (itemsToDelete) => {
    if (!window.confirm(`Hapus permanen ${itemsToDelete.length} item? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await recycleBinService.permanentDelete(itemsToDelete);
      showToast('Item dihapus permanen');
      fetchItems();
    } catch (error) {
      console.error('Permanent delete error:', error);
      showToast('Gagal menghapus permanen', 'error');
    }
  };

  const handleEmptyAll = async () => {
    if (!window.confirm('Kosongkan seluruh recycle bin? Semua item akan dihapus permanen.')) return;
    try {
      await recycleBinService.empty();
      showToast('Recycle bin dikosongkan');
      fetchItems();
    } catch (error) {
      console.error('Empty error:', error);
      showToast('Gagal mengosongkan recycle bin', 'error');
    }
  };

  const getSelectedItems = () => {
    return items.filter(i => selected.has(`${i.entity}-${i.id}`)).map(i => ({ entity: i.entity, id: i.id }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Hitung sisa hari sampai auto-delete (30 hari)
  const daysLeft = (dateStr) => {
    if (!dateStr) return null;
    const deleted = new Date(dateStr);
    const expires = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = Math.ceil((expires - now) / (24 * 60 * 60 * 1000));
    return Math.max(0, diff);
  };

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-header__title">Recycle Bin</h1>
          <p className="cms-page-header__subtitle">
            Item yang dihapus disimpan di sini selama 30 hari sebelum dihapus permanen.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      {items.length > 0 && (
        <div className="cms-form" style={{ marginBottom: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button className="cms-btn cms-btn--outline" onClick={toggleSelectAll}>
            {selected.size === items.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
          </button>
          {selected.size > 0 && (
            <>
              <button className="cms-btn cms-btn--primary" onClick={() => handleRestore(getSelectedItems())}>
                ↺ Kembalikan ({selected.size})
              </button>
              <button className="cms-btn cms-btn--danger" onClick={() => handlePermanentDelete(getSelectedItems())}>
                Hapus Permanen ({selected.size})
              </button>
            </>
          )}
          <button className="cms-btn cms-btn--ghost" onClick={handleEmptyAll} style={{ marginLeft: 'auto', color: '#ef4444' }}>
            Kosongkan Semua
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="cms-section-loading"><div className="cms-loading__spinner" /></div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="delete"
          title="Recycle bin kosong"
          description="Belum ada item yang dihapus"
        />
      ) : (
        <div className="cms-list">
          {items.map((item) => {
            const key = `${item.entity}-${item.id}`;
            const dl = daysLeft(item.deletedAt);
            return (
              <div key={key} className="cms-list__item" style={{ opacity: selected.has(key) ? '1' : '1' }}>
                <div className="cms-list__item-left">
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selected.has(key)}
                      onChange={() => toggleSelect(key)}
                      style={{ marginRight: '12px', width: '16px', height: '16px', accentColor: '#7c3aed' }}
                    />
                  </label>
                  <div className="cms-list__item-info">
                    <span className="cms-list__item-title" style={{ fontSize: '15px' }}>{item.title}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <span className="cms-tag" style={{ textTransform: 'capitalize' }}>{item.entityLabel}</span>
                      <span className="cms-list__item-date">Dihapus: {formatDate(item.deletedAt)}</span>
                      {dl !== null && (
                        <span className="cms-tech" style={{ color: dl <= 7 ? '#ef4444' : '#64748b' }}>
                          {dl > 0 ? `⏳ ${dl} hari tersisa` : '⚠️ Hampir dihapus permanen'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="cms-list__item-actions" style={{ opacity: 1, display: 'flex', gap: '4px' }}>
                  <button className="cms-btn cms-btn--outline" onClick={() => handleRestore([{ entity: item.entity, id: item.id }])} title="Kembalikan">
                    ↺
                  </button>
                  <button className="cms-btn cms-btn--danger" onClick={() => handlePermanentDelete([{ entity: item.entity, id: item.id }])} title="Hapus permanen">
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
