import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../../services/projects';
import { uploadService } from '../../services/upload';
import { getLocalizedText } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import Lightbox from '../../components/Lightbox/Lightbox';

const ProjectDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { onPageView, onDemoClick, onRepoClick } = useAnalytics();
  const language = i18n.language;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectRes, allRes] = await Promise.allSettled([
          projectService.getBySlug(id),
          projectService.getAll(),
        ]);
        if (projectRes.status === 'fulfilled') {
          setProject(projectRes.value.data || projectRes.value);
        }
        if (allRes.status === 'fulfilled') {
          setAllProjects(allRes.value.data || allRes.value || []);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const currentIndex = useMemo(() => allProjects.findIndex(p => p.id === id || p.slug === id), [allProjects, id]);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  useEffect(() => {
    if (project) onPageView(`project-${id}`);
    window.scrollTo(0, 0);
  }, [id, project, onPageView]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background">
        <h1 className="font-headline-xl text-headline-xl text-on-surface">Project not found</h1>
        <Link to="/projects" className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md">Back to Projects</Link>
      </main>
    );
  }

  const rawImages = project.images || [project.image];
  const projectImages = rawImages.filter(Boolean).map(img => uploadService.getImageUrl(img));
  const image = projectImages[0];
  const localizedTitle = getLocalizedText(project.title, language);
  const localizedDesc = getLocalizedText(project.description, language);
  const localizedAbout = getLocalizedText(project.about, language);

  const caseStudy = project.caseStudy || {};
  const problem = getLocalizedText(caseStudy.problem, language);
  const solution = getLocalizedText(caseStudy.solution, language);
  const result = getLocalizedText(caseStudy.result, language);

  return (
    <main className="w-full pt-20 bg-transparent">
      <div className="flex flex-col w-full">
        <div className="relative w-full max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-md pb-space-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between gap-space-md mb-space-lg">
            <Link to="/projects" className="inline-flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md group">
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
              <span>Back to Projects</span>
            </Link>
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-space-sm py-space-2xs rounded-full bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
                {project.slug || 'project'}
              </span>
            </div>
          </div>

          {/* Title & Hero Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-2xl">
            <div className="lg:col-span-8 flex flex-col gap-space-sm">
              <div className="inline-flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-widest">
                <span>{project.category}</span>
                <span>/</span>
                <span>{project.role}</span>
              </div>
              <h1 className="font-headline-2xl text-headline-2xl text-on-surface tracking-tight leading-none">{localizedTitle}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-xs leading-relaxed">{localizedDesc}</p>

              {/* Meta Strip */}
              <div className="flex flex-wrap items-center gap-y-space-sm gap-x-space-lg pt-space-sm font-label-md text-label-md text-on-surface-variant">
                {project.role && (
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
                    <span className="text-on-surface font-medium">Role:</span>
                    <span className="capitalize">{project.role}</span>
                  </div>
                )}
                {project.date && (
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                    <span className="text-on-surface font-medium">Date:</span>
                    <span>{project.date}</span>
                  </div>
                )}
                {project.status && (
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-container">verified</span>
                    <span className="text-on-surface font-medium">Status:</span>
                    <span className="text-tertiary font-semibold capitalize">{project.status}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="lg:col-span-4 flex flex-col gap-space-sm lg:pt-space-md">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
                <div className="flex items-center justify-between pb-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Deployment Endpoint</span>
                  <span className="flex items-center gap-1 font-code-sm text-code-sm text-tertiary-container">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container"></span> live
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs">
                  {project.liveUrl && (
                    <a className="w-full h-10 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-space-xs transition-all shadow-[0_0_20px_rgba(99,14,212,0.25)]" href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={() => onDemoClick(project.id, project.liveUrl)}>
                      <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                      <span>Open Live Demo</span>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a className="w-full h-10 px-space-md bg-surface-container-high/60 hover:bg-surface-container-highest text-on-surface rounded-lg font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors" href={project.repoUrl} target="_blank" rel="noopener noreferrer" onClick={() => onRepoClick(project.id, project.repoUrl)}>
                      <span className="material-symbols-outlined text-[18px]">terminal</span>
                      <span>View GitHub Source</span>
                    </a>
                  )}
                </div>
                <div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm">
                  <span>{project.techStack?.slice(0, 3).join(' • ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Image */}
          {image && (
            <div className="w-full mb-space-2xl">
              <div className="bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden">
                <img className="w-full max-h-[480px] object-cover cursor-zoom-in" src={image} alt={localizedTitle} onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }} />
              </div>
              {/* Gallery thumbnails */}
              {projectImages.length > 1 && (
                <div className="grid grid-cols-4 gap-space-xs mt-space-sm">
                  {projectImages.map((img, i) => (
                    <button key={i} className="relative group overflow-hidden rounded-lg bg-surface-container aspect-video" onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}>
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={img} alt={`${localizedTitle} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl mb-space-3xl items-start">
            {/* Left: Narrative */}
            <div className="lg:col-span-8 flex flex-col gap-space-2xl">
              {/* About */}
              {localizedAbout && (
                <div className="flex flex-col gap-space-sm">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Overview</h2>
                  <div className="flex flex-col gap-space-sm">
                    {localizedAbout.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Problem */}
              {problem && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs text-error font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <span>The Architectural Challenge</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">{problem}</h2>
                </div>
              )}

              {/* Solution */}
              {solution && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs text-tertiary-container font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>The Unified Engineering Solution</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">{solution}</h2>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span>Quantified Impact</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{result}</p>
                </div>
              )}

              {/* Challenges */}
              {project.challenges?.length > 0 && (
                <div className="flex flex-col gap-space-md">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Critical Engineering Hurdles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-base">
                    {project.challenges.map((challenge, i) => (
                      <div key={i} className="bg-surface-container-low p-space-base rounded-xl flex flex-col justify-between gap-space-md">
                        <div className="flex flex-col gap-space-xs">
                          <span className="font-label-sm text-label-sm text-primary font-semibold">{String(i + 1).padStart(2, '0')} / Challenge</span>
                          <h4 className="font-headline-sm text-headline-sm text-on-surface">{getLocalizedText(challenge.title, language)}</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{getLocalizedText(challenge.description, language)}</p>
                        </div>
                        {challenge.solution && (
                          <div className="bg-surface-container-lowest p-space-sm rounded-lg">
                            <span className="font-label-sm text-label-sm text-tertiary font-medium">Architecture Fix</span>
                            <p className="font-code-sm text-code-sm text-on-surface-variant mt-0.5">{getLocalizedText(challenge.solution, language)}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {project.features?.length > 0 && (
                <div className="flex flex-col gap-space-md">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Key Capabilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-base">
                    {project.features.map((feature, i) => (
                      <div key={i} className="p-space-base bg-surface-container-low rounded-xl flex items-start gap-space-sm">
                        {/* Render icon: Material Symbols name jika bukan emoji, else emoji text */}
                        {/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(feature.icon) ? (
                          <span className="text-2xl leading-none">{feature.icon}</span>
                        ) : (
                          <span className="material-symbols-outlined text-[24px] text-primary">{feature.icon}</span>
                        )}
                        <div>
                          <h4 className="font-label-md text-label-md text-on-surface font-semibold">{getLocalizedText(feature.title, language)}</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{getLocalizedText(feature.description, language)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              {/* Tech Stack */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] flex flex-col gap-space-base">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Core Tech Stack</h3>
                  <span className="material-symbols-outlined text-[20px] text-primary">layers</span>
                </div>
                <div className="flex flex-wrap gap-space-xs">
                  {project.techStack?.map(tech => (
                    <span key={tech} className="px-space-sm py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Info */}
              {(project.duration || project.role) && (
                <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] flex flex-col gap-space-xs">
                  {project.duration && (
                    <div className="flex items-center justify-between py-1 font-body-sm text-body-sm text-on-surface-variant">
                      <span>Duration</span>
                      <span className="font-code-sm text-code-sm text-on-surface font-medium">{project.duration}</span>
                    </div>
                  )}
                  {project.role && (
                    <div className="flex items-center justify-between py-1 font-body-sm text-body-sm text-on-surface-variant">
                      <span>Role</span>
                      <span className="font-code-sm text-code-sm text-on-surface font-medium capitalize">{project.role}</span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="p-space-lg rounded-xl bg-gradient-to-br from-primary-fixed/50 to-secondary-fixed/40 flex flex-col gap-space-sm">
                <p className="font-body-sm text-body-sm text-on-surface-variant">Like this project? Let's work together.</p>
                <Link to="/about#contact" className="inline-flex items-center gap-space-2xs font-label-md text-label-md text-primary hover:text-primary-container font-semibold">
                  <span>Let's work together</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Next Project Navigation */}
          {nextProject && (
            <div className="w-full bg-surface-container-low rounded-xl p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md hover:bg-surface-container-high/60 transition-colors">
              <div className="flex items-center gap-space-base">
                <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shrink-0">
                  <span className="material-symbols-outlined text-[24px]">smart_toy</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Next Architecture Study</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{getLocalizedText(nextProject.title, language)}</span>
                </div>
              </div>
              <Link to={`/projects/${nextProject.slug || nextProject.id}`} className="px-space-md py-space-sm bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-space-xs shrink-0 shadow-sm">
                <span>Read Case Study</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={projectImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(index) => {
          if (index >= 0 && index < projectImages.length) setLightboxIndex(index);
        }}
      />
    </main>
  );
};

export default ProjectDetail;
