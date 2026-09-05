import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// i18n
import './utils/i18n';

// Styles
import './styles/variables.css';
import './styles/animations.css';
import './styles/aurora.css';
import './styles/index.css';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AuroraBackground from './components/AuroraBackground/AuroraBackground';
import GlitterCursor from './components/GlitterCursor/GlitterCursor';
import { api } from './services/api';

// Pages (lazy loaded for performance)
const Home = lazy(() => import('./pages/Home/Home'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail/ProjectDetail'));
const About = lazy(() => import('./pages/About/About'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost/BlogPost'));
// Hidden Admin pages (accessible via URL only)
const Login = lazy(() => import('./pages/Login/Login'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// Loading fallback
const Loading = () => (
  <div className="loading-container">
    <div className="loading-spinner" />
  </div>
);

// Layout component for public pages
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  // Clear stale cache on app startup (prevents empty results from being cached)
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.clearEmptyCache();
  }, []);

  // Auto-refresh saat user kembali ke tab (visibilitychange)
  // Ini memastikan perubahan dari CMS (edit/pending/delete) langsung terlihat
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        api.clearEmptyCache();
        setRefreshKey(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <Router>
      <div className="app">
        {/* Aurora Background - Apply ke SEMUA halaman */}
        <AuroraBackground />
        
        {/* Glitter Cursor Effect - Apply ke SEMUA halaman */}
        <GlitterCursor />
        
        <AnimatedRoutes refreshKey={refreshKey} />
      </div>
    </Router>
  );
}

// AnimatedRoutes: page transition (dissolve/fade) saat pindah halaman
function AnimatedRoutes({ refreshKey }) {
  const location = useLocation();

  return (
    <Suspense fallback={<Loading />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <Routes location={location} key={refreshKey}>
            {/* Public Pages with Navbar/Footer */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
            <Route path="/projects/:id" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
            <Route path="/blog/:id" element={<PublicLayout><BlogPost /></PublicLayout>} />

            {/* Hidden Admin Pages (Aurora applied but no Navbar/Footer) */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
