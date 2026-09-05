import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { projectService } from '../../services/projects';
import { useAnalytics } from '../../hooks/useAnalytics';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import TechMarquee from '../../components/TechMarquee/TechMarquee';

const Projects = () => {
    const { t } = useTranslation();
    const { onPageView } = useAnalytics();

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(6);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onPageView('projects');
    }, [onPageView]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await projectService.getAll();
                const data = res?.data || res || [];
                setProjects(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const categoryFilters = [
        { value: 'all', label: 'All Systems' },
        { value: 'web-app', label: 'Web Apps' },
        { value: 'mobile', label: 'Mobile' },
        { value: 'open-source', label: 'Open Source' },
        { value: 'design', label: 'Design' },
    ];

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const searchLower = searchQuery.toLowerCase();
            const titleMatch = (project.title.en?.toLowerCase() || '').includes(searchLower) ||
                (project.title.id?.toLowerCase() || '').includes(searchLower);
            const techMatch = project.techStack?.some(tech => tech.toLowerCase().includes(searchLower));

            if (searchQuery && !titleMatch && !techMatch) return false;
            if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;
            return true;
        });
    }, [projects, searchQuery, categoryFilter]);

    const visibleProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProjects.length;

    useEffect(() => {
        setVisibleCount(6);
    }, [searchQuery, categoryFilter]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main className="w-full pt-20 bg-transparent">
            <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-3xl">
                {/* Header */}
                <motion.div
                    className="mb-space-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold block mb-space-xs">Production Artifacts</span>
                    <h1 className="font-headline-2xl text-headline-2xl text-on-surface tracking-tight">{t('projects.pageTitle') || 'Projects'}</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-xs">
                        {t('projects.pageDescription') || 'A collection of production systems, distributed infrastructure, and AI platforms.'}
                    </p>
                </motion.div>

                {/* Search + Filters */}
                <motion.div
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search projects by title or tech..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-space-md py-space-sm bg-surface-container-low/70 rounded-lg text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/50 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap gap-space-xs">
                        {categoryFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setCategoryFilter(filter.value)}
                                className={`px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${
                                    categoryFilter === filter.value
                                        ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                                        : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-xl">
                    {visibleProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <motion.div className="text-center p-space-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <span className="material-symbols-outlined text-[56px] text-outline-variant mb-space-md">search_off</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface">No projects found</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">Try adjusting your search or filter criteria</p>
                    </motion.div>
                )}

                {/* Load More */}
                {hasMore && (
                    <motion.div className="flex justify-center mt-space-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="px-space-lg py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md shadow-sm border border-outline-variant/50 transition-all"
                        >
                            Load More
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Tech Marquee */}
            <TechMarquee />
        </main>
    );
};

export default Projects;
