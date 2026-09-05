import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { blogService } from '../../services/blog';
import { uploadService } from '../../services/upload';
import { getLocalizedText, formatDate } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import Button from '../../components/Button/Button';
import './BlogPost.css';

const BlogPost = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const { onPageView } = useAnalytics();
    const language = i18n.language;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await blogService.getBySlug(id);
                setPost(res.data || res);
            } catch (error) {
                console.error('Failed to fetch blog post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (post) {
            onPageView(`blog-${id}`);
        }
    }, [id, post, onPageView]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="blog-post" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="blog-post__not-found">
                <h1>Post not found</h1>
                <Button to="/blog">Back to Blog</Button>
            </div>
        );
    }

    return (
        <main className="blog-post">
            <div className="container container-sm">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link to="/blog" className="blog-post__back">
                        ← Back to Blog
                    </Link>
                </motion.div>

                <article className="blog-post__article">
                    {/* Header */}
                    <motion.header
                        className="blog-post__header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="blog-post__meta">
                            <span className="blog-post__category">{post.category}</span>
                            <span className="blog-post__date">{formatDate(post.date, language)}</span>
                            <span className="blog-post__read-time">{post.readTime} {t('blog.minRead')}</span>
                        </div>
                        <h1 className="blog-post__title">
                            {getLocalizedText(post.title, language)}
                        </h1>
                        {post.tags && (
                            <div className="blog-post__tags">
                                {post.tags.map(tag => (
                                    <span key={tag} className="blog-post__tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </motion.header>

                    {/* Featured Image */}
                    <motion.div
                        className="blog-post__image"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <img
                            src={uploadService.getImageUrl(post.image)}
                            alt={getLocalizedText(post.title, language)}
                        />
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        className="blog-post__content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {getLocalizedText(post.content, language)?.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) {
                                return <h1 key={i}>{line.replace('# ', '')}</h1>;
                            }
                            if (line.startsWith('## ')) {
                                return <h2 key={i}>{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('```')) {
                                return null; // Simplified for demo
                            }
                            if (line.trim()) {
                                return <p key={i}>{line}</p>;
                            }
                            return null;
                        })}
                    </motion.div>

                    {/* Share */}
                    <div className="blog-post__share">
                        <span>Share this article:</span>
                        <div className="blog-post__share-links">
                            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(getLocalizedText(post.title, language))}`} target="_blank" rel="noopener noreferrer">
                                Twitter
                            </a>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
};

export default BlogPost;