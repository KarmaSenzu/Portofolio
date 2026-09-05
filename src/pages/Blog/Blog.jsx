import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { blogService } from '../../services/blog';
import { uploadService } from '../../services/upload';
import { getLocalizedText, formatDate } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import TechMarquee from '../../components/TechMarquee/TechMarquee';

const Blog = () => {
    const { t, i18n } = useTranslation();
    const { onPageView } = useAnalytics();
    const language = i18n.language;

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onPageView('blog');
    }, [onPageView]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await blogService.getAll();
                const data = res?.data || res || [];
                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch blog posts:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const categoryFilters = [
        { value: 'all', label: 'All' },
        { value: 'tutorials', label: 'Tutorials' },
        { value: 'thoughts', label: 'Thoughts' },
        { value: 'tips', label: 'Tips' },
    ];

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const searchLower = searchQuery.toLowerCase();
            const titleMatch = (post.title.en?.toLowerCase() || '').includes(searchLower) ||
                (post.title.id?.toLowerCase() || '').includes(searchLower);
            if (searchQuery && !titleMatch) return false;
            if (categoryFilter !== 'all' && post.category !== categoryFilter) return false;
            return true;
        });
    }, [posts, searchQuery, categoryFilter]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </main>
        );
    }

    const featured = filteredPosts[0];
    const rest = filteredPosts.slice(1);

    return (
        <main className="w-full pt-20 bg-transparent">
            <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-3xl flex flex-col gap-space-2xl">
                {/* Header */}
                <motion.div
                    className="flex flex-col gap-space-xs max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-space-sm mb-space-2xs">
                        <span className="inline-flex items-center px-space-sm py-space-2xs rounded-lg bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block mr-1.5"></span>
                            telemetry.damardev.io/journal
                        </span>
                        <span className="font-code-sm text-code-sm text-outline">rev.2026.09</span>
                    </div>
                    <h1 className="font-headline-2xl text-headline-2xl text-on-surface tracking-tight">Blog &amp; Notes</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                        Technical writeups, architectural deep-dives, and practical engineering thoughts on software development, infrastructure, and autonomous AI.
                    </p>
                </motion.div>

                {/* Search + Filter */}
                <motion.div
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search articles by title, topic, or keyword..."
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

                {/* Featured Post */}
                {featured && (
                    <motion.article
                        className="relative overflow-hidden bg-surface-container-lowest backdrop-blur-xl rounded-xl border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] p-space-lg lg:p-space-xl flex flex-col lg:flex-row items-stretch gap-space-xl transition-all duration-300 group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="absolute -right-16 -top-16 w-80 h-80 bg-primary-fixed/40 rounded-full blur-[90px] pointer-events-none"></div>
                        <div className="flex-1 flex flex-col justify-between z-10">
                            <div className="flex flex-col gap-space-sm">
                                <div className="flex flex-wrap items-center gap-space-sm">
                                    <span className="px-space-sm py-space-2xs rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                                        {featured.category}
                                    </span>
                                    <span className="font-code-sm text-code-sm text-outline">{formatDate(featured.date, language)}</span>
                                    <span className="text-outline-variant">•</span>
                                    <span className="font-code-sm text-code-sm text-outline">{featured.readTime} min read</span>
                                </div>
                                <Link to={`/blog/${featured.slug || featured.id}`}>
                                    <h2 className="font-headline-xl text-headline-xl text-on-surface group-hover:text-primary transition-colors tracking-tight mt-space-xs">
                                        {getLocalizedText(featured.title, language)}
                                    </h2>
                                </Link>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl">
                                    {getLocalizedText(featured.excerpt, language)}
                                </p>
                            </div>
                            <div className="pt-space-lg">
                                <Link to={`/blog/${featured.slug || featured.id}`} className="inline-flex items-center gap-space-xs px-space-lg py-space-sm bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md rounded-lg shadow-sm transition-all">
                                    <span>Read Full Article</span>
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                        <div className="lg:w-96 rounded-lg overflow-hidden bg-surface-container-low shadow-sm">
                            <img className="w-full h-full object-cover" src={uploadService.getImageUrl(featured.image)} alt={getLocalizedText(featured.title, language)} />
                        </div>
                    </motion.article>
                )}

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                    {rest.map((post, index) => (
                        <motion.article
                            key={post.id}
                            className="flex flex-col justify-between bg-surface-container-lowest backdrop-blur-md rounded-xl border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.15),0_4px_12px_rgba(24,24,27,0.1)] hover:-translate-y-1 p-space-lg transition-all duration-200 group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                        >
                            <div className="flex flex-col gap-space-md">
                                <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-container-high">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={uploadService.getImageUrl(post.image)} alt={getLocalizedText(post.title, language)} loading="lazy" />
                                    <div className="absolute top-space-xs left-space-xs">
                                        <span className="px-space-xs py-space-2xs rounded bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-semibold shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
                                    <span>{formatDate(post.date, language)}</span>
                                    <span>•</span>
                                    <span>{post.readTime} min read</span>
                                </div>
                                <div className="flex flex-col gap-space-xs">
                                    <Link to={`/blog/${post.slug || post.id}`}>
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                            {getLocalizedText(post.title, language)}
                                        </h3>
                                    </Link>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
                                        {getLocalizedText(post.excerpt, language)}
                                    </p>
                                </div>
                            </div>
                            <Link to={`/blog/${post.slug || post.id}`} className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container font-medium pt-space-md">
                                <span>Read More</span>
                                <span className="material-symbols-outlined text-[14px]">east</span>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <motion.div className="text-center p-space-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <span className="material-symbols-outlined text-[56px] text-outline-variant mb-space-md">article</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface">No posts found</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">Try adjusting your search or filter criteria</p>
                    </motion.div>
                )}
            </div>

            {/* Tech Marquee */}
            <TechMarquee />
        </main>
    );
};

export default Blog;
