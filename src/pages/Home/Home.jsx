import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../../services/projects';
import { settingsService } from '../../services/settings';
import { uploadService } from '../../services/upload';
import { useAnalytics } from '../../hooks/useAnalytics';
import TechMarquee from '../../components/TechMarquee/TechMarquee';

const Home = () => {
  const { t } = useTranslation();
  const { onPageView } = useAnalytics();

  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [slideshowConfig, setSlideshowConfig] = useState({ interval: 5000, pauseOnHover: true, showDots: true });
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Drag-based tilt (continuous) + lenticular effect (4 arah)
  const [rotateX, setRotateX] = useState(22); // kemiringan kamera 15-30 derajat (default 22)
  const [rotateY, setRotateY] = useState(-8);
  const [hingeAngle, setHingeAngle] = useState(25); // tekukan layar (buka/tutup), 10° = hampir tertutup, 25° = default terbuka normal
  const [lenticularIndex, setLenticularIndex] = useState(1); // 0=pagi(atas), 1=siang(tengah), 2=sore(kanan), 3=malem(bawah)
  const dragState = useRef({ isDragging: false, startX: 0, startY: 0, startRotateX: 22, startRotateY: -8, startHinge: 25 });

  // Lenticular videos (4 suasana: pagi, siang, sore, malem)
  const lenticularVideos = [
    { src: '/videos/pagi.webm', label: 'Pagi', index: 0 },   // atas
    { src: '/videos/siang.webm', label: 'Siang', index: 1 }, // tengah (default)
    { src: '/videos/sore.webm', label: 'Sore', index: 2 },   // kanan
    { src: '/videos/malem.webm', label: 'Malam', index: 3 }, // bawah
  ];

  const handleDragStart = (e) => {
    dragState.current.isDragging = true;
    dragState.current.startX = e.clientX || e.touches?.[0]?.clientX || 0;
    dragState.current.startY = e.clientY || e.touches?.[0]?.clientY || 0;
    dragState.current.startRotateX = rotateX;
    dragState.current.startRotateY = rotateY;
    dragState.current.startHinge = hingeAngle;
  };

  const handleDragMove = (e) => {
    if (!dragState.current.isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    const deltaX = clientX - dragState.current.startX;
    const deltaY = clientY - dragState.current.startY;
    // Horizontal = rotateY (kamera), Vertical = hinge (tekuk layar)
    const newRotateY = Math.max(-15, Math.min(15, dragState.current.startRotateY + deltaX * 0.08));
    // Drag ke ATAS (deltaY negatif) → layar MENUTUP (hinge turun)
    // Drag ke BAWAH (deltaY positif) → layar TERBUKA (hinge naik)
    const newHinge = Math.max(10, Math.min(60, dragState.current.startHinge + deltaY * 0.4));
    setRotateY(newRotateY);
    setHingeAngle(newHinge);
    // Lenticular index: horizontal wins, else vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (newRotateY < -6) setLenticularIndex(0); // kiri = pagi
      else if (newRotateY > 6) setLenticularIndex(2); // kanan = sore
      else setLenticularIndex(1); // tengah = siang
    } else {
      if (deltaY < -8) setLenticularIndex(0); // atas = pagi
      else if (deltaY > 8) setLenticularIndex(3); // bawah = malem
      else setLenticularIndex(1); // tengah = siang
    }
  };

  const handleDragEnd = () => {
    dragState.current.isDragging = false;
  };

  useEffect(() => {
    onPageView('home');
  }, [onPageView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, heroRes, configRes] = await Promise.allSettled([
          projectService.getAll({ featured: 'true' }),
          settingsService.get('hero_images'),
          settingsService.get('slideshow_config'),
        ]);

        if (projectsRes.status === 'fulfilled') {
          const data = projectsRes.value?.data || projectsRes.value || [];
          setFeaturedProjects((Array.isArray(data) ? data : []).slice(0, 3));
        }

        if (heroRes.status === 'fulfilled') {
          const res = heroRes.value;
          const images = res?.value || res?.data || res || [];
          setHeroImages(Array.isArray(images) ? images.map(img => uploadService.getImageUrl(img)) : []);
        }

        if (configRes.status === 'fulfilled') {
          const config = configRes.value?.value || configRes.value?.data || configRes.value || {};
          setSlideshowConfig(prev => ({ ...prev, ...config }));
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isPaused || heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, slideshowConfig.interval);
    return () => clearInterval(timer);
  }, [isPaused, heroImages.length, slideshowConfig.interval]);

  const goToSlide = useCallback((index) => setCurrentSlide(index), []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </main>
    );
  }

  // ============ Architecture Matrix Data ============
  const pillars = [
    {
      id: 'languages', label: 'Core Languages', icon: 'code_blocks', accent: 'text-primary', tagBg: 'bg-primary-fixed/50 text-primary',
      items: [
        { name: 'Go (Golang)', tag: 'Primary' },
        { name: 'TypeScript', tag: 'v5.4+' },
        { name: 'Python', tag: 'AI / Automation' },
        { name: 'SQL / PostgreSQL', tag: 'Relational' }
      ],
      footer: 'Compiled concurrency & type-safety'
    },
    {
      id: 'frontend', label: 'Frontend Architecture', icon: 'web', accent: 'text-secondary', tagBg: 'bg-secondary-fixed/60 text-secondary',
      items: [
        { name: 'React 19 & Vite', tag: 'Reactive' },
        { name: 'Next.js App Router', tag: 'SSR / RSC' },
        { name: 'Tailwind CSS', tag: 'Token Design' },
        { name: 'xterm.js & Canvas', tag: 'Web Terminal' }
      ],
      footer: 'Sub-50ms paint times & hydration'
    },
    {
      id: 'backend', label: 'Backend & Infra', icon: 'cloud', accent: 'text-tertiary', tagBg: 'bg-tertiary-fixed/60 text-tertiary',
      items: [
        { name: 'Gin / Fiber Web', tag: 'Go Web' },
        { name: 'Docker Containers', tag: 'Orchestration' },
        { name: 'Redis & Caching', tag: 'In-Memory' },
        { name: 'Cloudflare Zero Trust', tag: 'Tunneling' }
      ],
      footer: 'Autonomous self-hosted bare metal'
    },
    {
      id: 'protocols', label: 'Specialized Protocols', icon: 'hub', accent: 'text-primary', tagBg: 'bg-primary-fixed/50 text-primary',
      items: [
        { name: 'Multi-LLM Runtimes', tag: 'Ollama/OpenAI' },
        { name: 'SSE & WebSockets', tag: 'Streaming' },
        { name: 'SFTP / SSH Tunnel', tag: 'Encrypted I/O' },
        { name: 'Telegram Automation', tag: 'Autonomous' }
      ],
      footer: 'Agentic orchestration & telemetry'
    }
  ];

  return (
    <main className="w-full pt-20 bg-transparent">
      <div className="flex flex-col w-full">
        <div className="relative w-full max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-3xl">
          {/* ============ HERO SECTION ============ */}
          <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-center pt-space-lg lg:pt-space-xl pb-space-3xl">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start z-10">
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm mb-space-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container"></span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">
                  Available for Q2/Q3 Architecture &amp; Full-Stack Roles
                </span>
                <span className="font-code-sm text-code-sm text-on-surface-variant ml-space-2xs">· IDT (UTC+7)</span>
              </div>

              {/* Master Title */}
              <h1 className="font-headline-2xl text-headline-2xl text-on-surface tracking-tight leading-[1.08] mb-space-md">
                Hi, I'm <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Damar</span>. Building resilient infrastructure &amp; intelligent digital products.
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-xl leading-relaxed">
                Full-Stack Software Engineer architecting high-throughput Go backends, distributed microservices, ultra-responsive React ecosystems, and autonomous AI agents.
              </p>

              {/* CTA Cluster */}
              <div className="flex flex-wrap items-center gap-space-sm mb-space-xl">
                <a className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-md transition-all duration-200" href="#projects">
                  <span>Explore Projects</span>
                  <span className="material-symbols-outlined text-[18px]">south</span>
                </a>
                <Link to="/projects" className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-lg bg-surface-container-lowest/90 hover:bg-surface-container-high text-on-surface font-label-md text-label-md shadow-sm transition-all duration-200">
                  <span className="material-symbols-outlined text-[18px] text-primary">insights</span>
                  <span>Case Studies</span>
                </Link>
                <div className="flex items-center gap-space-2xs pl-space-xs">
                  <a className="p-space-sm rounded-lg bg-surface-container-lowest/80 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high shadow-sm transition-colors" href="https://github.com/KarmaSenzu" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <span className="material-symbols-outlined text-[20px]">code</span>
                  </a>
                  <a className="p-space-sm rounded-lg bg-surface-container-lowest/80 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high shadow-sm transition-colors" href="https://www.linkedin.com/in/damar-fikrie-216240238/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <span className="material-symbols-outlined text-[20px]">work</span>
                  </a>
                </div>
              </div>

              {/* Telemetry Micro Metrics */}
              <div className="grid grid-cols-3 gap-space-md w-full max-w-lg pt-space-md">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">99.98%</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">Fleet Uptime SLA</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">&lt; 24ms</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">Avg Edge Latency</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">3.84</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">GPA • Informatics</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Device Mockup */}
            <div className="lg:col-span-5 relative w-full flex flex-col items-center" id="sys-terminal-preview">
              <div className="relative w-full flex flex-col items-center select-none">
                <div className="absolute -top-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                
                <div className="w-full flex items-center justify-between mb-space-sm px-space-xs">
                  <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    <span className="font-medium text-on-surface">3D Mockup</span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-high/60 backdrop-blur-md px-1.5 py-1 rounded-full text-[11px] font-code-sm">
                      <span className="px-2 py-0.5 text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">unfold_more</span> Drag atas/bawah = tekuk layar
                      </span>
                  </div>
                </div>

                <div className="w-full py-space-sm flex items-center justify-center" style={{ perspective: '1200px' }}>
                  <div
                    className="relative w-full max-w-[440px] transition-transform duration-300 ease-out group cursor-grab active:cursor-grabbing select-none"
                    style={{ transformStyle: 'preserve-3d', transform: `rotateX(10deg) rotateY(${rotateY}deg) rotateZ(${lenticularIndex === 0 ? 2 : lenticularIndex === 2 ? -2 : 1}deg)` }}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                  >
                    {/* MacBook M2 Screen (hinge: bisa ditekuk buka/tutup) */}
                    <div className="relative w-full aspect-[16/10] bg-[#0a0a0c] rounded-t-xl border border-outline-variant/30 shadow-[0_24px_50px_rgba(99,14,212,0.18)] flex flex-col overflow-hidden p-[6px]" style={{ transformOrigin: 'bottom center', transform: `rotateX(${-hingeAngle}deg)`, transition: 'transform 0.3s ease-out', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.15)' }}>
                      {/* Bezel (border layar tipis) */}
                      <div className="relative w-full h-full rounded-[6px] overflow-hidden bg-black border border-[#2a2a30]">
                        {/* Full-screen video wallpaper */}
                        <motion.video
                          key={lenticularIndex}
                          src={lenticularVideos[lenticularIndex].src}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          draggable="false"
                        />
                      </div>

                      {/* MacBook M2 Notch (ponytail) */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-40 w-24 h-4 bg-[#0a0a0c] rounded-b-lg flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a20] border border-white/10 flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-secondary/70"></span>
                        </div>
                      </div>

                      {/* Traffic Light buttons (merah kuning hijau) - pojok kiri atas */}
                      <div className="absolute top-3 left-3 z-40 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-black/20"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-black/20"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black/20"></span>
                      </div>

                      {/* Suasana label (bottom-left) */}
                      <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[12px] text-white">
                          {lenticularIndex === 0 ? 'wb_twilight' : lenticularIndex === 1 ? 'wb_sunny' : lenticularIndex === 2 ? 'wb_sunny' : 'nights_stay'}
                        </span>
                        <span className="font-code-sm text-[10px] text-white font-medium">{lenticularVideos[lenticularIndex].label}</span>
                      </div>

                      {/* Status (top-right, setelah notch) */}
                      <div className="absolute top-3 right-3 z-40 flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                        <span className="w-1 h-1 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
                        <span className="font-code-sm text-[9px] text-white/80">99.98%</span>
                      </div>

                      {/* Windows activation watermark (pojok kanan bawah) */}
                      <div className="absolute bottom-3 right-3 z-30 select-none pointer-events-none">
                        <p className="font-code-sm text-[9px] text-white/80 text-right leading-tight"
                          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.7)' }}
                        >
                          Activate Windows
                          <br />
                          Go to Settings to activate Windows
                        </p>
                      </div>
                    </div>
                    {/* Hinge (base strip) */}
                    <div className="relative w-full h-2 bg-gradient-to-b from-[#9b98a3] to-[#cbc8cf] flex items-center justify-center -mb-px" style={{ transform: `rotateX(${-hingeAngle * 0.15}deg)`, transformOrigin: 'top center', transition: 'transform 0.3s ease-out' }}></div>
                    {/* Keyboard Deck (ikut menyesuaikan sedikit saat layar ditekuk) */}
                    <div className="relative w-full bg-gradient-to-b from-[#cbc8cf] to-[#e6e3e8] rounded-b-2xl shadow-[0_24px_50px_rgba(0,0,0,0.3)] pt-3 pb-4 px-4 flex flex-col items-center gap-3 border-x border-b border-outline-variant/50" style={{ transform: `rotateX(${-hingeAngle * 0.25}deg)`, transformOrigin: 'top center', transition: 'transform 0.3s ease-out' }}>
                      {/* Mac Keyboard (QWERTY US) */}
                      <div className="w-full min-w-0 bg-[#1c1b21] rounded-lg p-2.5 shadow-inner flex flex-col gap-1 overflow-x-hidden">
                        {/* Row: Escape + F1-F12 (hidden on small mobile untuk mencegah overflow) */}
                        <div className="hidden sm:flex gap-1">
                          <div className="w-7 h-4 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center">
                            <span className="text-[7px] text-[#a9a6b0]">esc</span>
                          </div>
                          <div className="flex-1"></div>
                          {['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'].map((k) => (
                            <div key={k} className="w-7 h-4 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center">
                              <span className="text-[6px] text-[#a9a6b0]">{k}</span>
                            </div>
                          ))}
                        </div>
                        {/* Row: angka */}
                        <div className="flex gap-1">
                          {['`','1','2','3','4','5','6','7','8','9','0','-','=','⌫'].map((k) => (
                            <div key={`num-${k}`} className="flex-1 h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center">
                              <span className="text-[8px] text-[#d4d1da] font-medium">{k}</span>
                            </div>
                          ))}
                        </div>
                        {/* Row: QWERTY */}
                        <div className="flex gap-1">
                          <div className="flex-[1.3] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[7px] text-[#d4d1da]">tab</span></div>
                          {['Q','W','E','R','T','Y','U','I','O','P','[',']','\\'].map((k) => (
                            <div key={`q-${k}`} className="flex-1 h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center">
                              <span className="text-[8px] text-[#d4d1da] font-medium">{k}</span>
                            </div>
                          ))}
                        </div>
                        {/* Row: ASDF */}
                        <div className="flex gap-1">
                          <div className="flex-[1.5] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">caps</span></div>
                          {['A','S','D','F','G','H','J','K','L',';','\''].map((k) => (
                            <div key={`a-${k}`} className="flex-1 h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center">
                              <span className="text-[8px] text-[#d4d1da] font-medium">{k}</span>
                            </div>
                          ))}
                          <div className="flex-[1.8] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">return</span></div>
                        </div>
                        {/* Row: ZXCV + modifiers */}
                        <div className="flex gap-1">
                          <div className="flex-[1.4] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">shift</span></div>
                          {['Z','X','C','V','B','N','M',',','.','/'].map((k) => (
                            <div key={`z-${k}`} className="flex-1 h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center">
                              <span className="text-[8px] text-[#d4d1da] font-medium">{k}</span>
                            </div>
                          ))}
                          <div className="flex-[1.6] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">shift</span></div>
                        </div>
                        {/* Row: bottom modifiers + space + arrows */}
                        <div className="flex gap-1 items-center">
                          <div className="flex-1 h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">fn</span></div>
                          <div className="flex-[1.2] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">⌃</span></div>
                          <div className="flex-[1.2] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">⌥</span></div>
                          <div className="flex-[1.6] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[7px] text-[#d4d1da] font-semibold">⌘</span></div>
                          <div className="flex-[5] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10"></div>
                          <div className="flex-[1.6] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[7px] text-[#d4d1da] font-semibold">⌘</span></div>
                          <div className="flex-[1.2] h-5 rounded-[3px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">⌥</span></div>
                          {/* Arrow keys */}
                          <div className="flex flex-col gap-[2px] items-center">
                            <div className="w-4 h-2.5 rounded-[2px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">↑</span></div>
                            <div className="flex gap-[2px]">
                              <div className="w-4 h-2.5 rounded-[2px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">←</span></div>
                              <div className="w-4 h-2.5 rounded-[2px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">↓</span></div>
                              <div className="w-4 h-2.5 rounded-[2px] bg-[#2c2a36] border border-white/10 flex items-center justify-center"><span className="text-[6px] text-[#a9a6b0]">→</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Trackpad + Sticker area */}
                      <div className="relative flex items-center justify-center w-full">
                        {/* Trackpad (tetap di tengah) */}
                        <div className="w-40 h-14 rounded-lg bg-[#d2ced6] border border-outline-variant/60 shadow-inner"></div>
                        {/* Sticker logo + tulisan (di kanan, absolute agar tidak menggeser trackpad) */}
                        <div className="absolute right-4 flex items-center gap-1.5">
                          <div
                            className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo to-cyan flex items-center justify-center shadow-md border border-white/30 cursor-default select-none"
                            style={{ transform: 'rotate(-6deg)' }}
                            title="DamarDev"
                          >
                            <span className="text-white text-[7px] font-bold leading-none text-center">{'</>'}</span>
                          </div>
                          <span
                            className="font-code-sm font-bold bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent cursor-default select-none text-[10px]"
                            style={{ transform: 'rotate(-3deg)' }}
                          >
                            DamarDev
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between px-space-md py-space-xs mt-space-xs rounded-lg bg-surface-container-lowest/80 backdrop-blur-md shadow-sm text-on-surface-variant font-code-sm text-code-sm">
                  <span className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">3d_rotation</span>
                    <span>Display Frame</span>
                  </span>
                  {/* Lenticular position indicator (4 suasana) */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-outline mr-1">Drag: atas/bawah/kiri/kanan</span>
                    {lenticularVideos.map(v => (
                      <span
                        key={v.index}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${lenticularIndex === v.index ? 'bg-primary scale-125' : 'bg-outline-variant'}`}
                        title={v.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ ARCHITECTURE MATRIX ============ */}
          <section className="py-space-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold block mb-space-xs">Architectural Tooling</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Technical Stack &amp; Foundations</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Carefully selected languages, runtimes, and distributed protocols calibrated for fault tolerance and developer velocity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {pillars.map((pillar, pIndex) => (
                <motion.div
                  key={pillar.id}
                  className="p-space-lg rounded-xl bg-surface-container-lowest backdrop-blur-md border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.15),0_4px_12px_rgba(24,24,27,0.1)] hover:-translate-y-1 transition-all flex flex-col justify-between"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: pIndex * 0.1, ease: 'easeOut' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{pillar.label}</span>
                      <span className={`material-symbols-outlined ${pillar.accent} text-[22px]`}>{pillar.icon}</span>
                    </div>
                    <div className="space-y-space-sm">
                      {pillar.items.map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-space-xs rounded bg-surface-container-low/50">
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface">{item.name}</span>
                          <span className={`font-code-sm text-code-sm ${item.tag !== 'Primary' && item.tag !== 'Reactive' && item.tag !== 'Go Web' && item.tag !== 'Ollama/OpenAI' ? 'text-on-surface-variant' : pillar.tagBg} px-2 py-0.5 rounded font-medium`}>{item.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="font-code-sm text-code-sm text-on-surface-variant mt-space-md block pt-space-xs">{pillar.footer}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ============ FEATURED PROJECTS ============ */}
          <section className="py-space-2xl" id="projects">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-lg gap-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold block mb-space-xs">Production Artifacts</span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">Featured Engineering Work</h2>
              </div>
              <div className="inline-flex p-space-2xs rounded-full bg-surface-container-high/60 backdrop-blur-md shadow-sm">
                <button className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm">All Systems</button>
                <button className="px-space-md py-space-xs rounded-full text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">Distributed Infra</button>
                <button className="px-space-md py-space-xs rounded-full text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">AI &amp; Automation</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              {featuredProjects.map((project, index) => {
                const isFlagship = index === 0;
                const localizedTitle = project.title?.en || project.title?.id || '';
                const localizedDesc = project.description?.en || project.description?.id || '';
                const techStack = project.techStack || [];
                const image = project.image || project.images?.[0];

                if (isFlagship) {
                  return (
                    <motion.div
                      key={project.id}
                      className="lg:col-span-12 rounded-xl bg-surface-container-lowest backdrop-blur-md border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.15),0_6px_16px_rgba(24,24,27,0.1)] hover:-translate-y-1 p-space-xl flex flex-col lg:flex-row gap-space-xl items-center transition-all duration-300"
                      initial={{ opacity: 0, y: 40, scale: 0.97 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                      <div className="w-full lg:w-7/12 relative rounded-lg overflow-hidden bg-surface-container-low shadow-sm">
                        <img className="w-full h-80 object-cover" src={uploadService.getImageUrl(image)} alt={localizedTitle} />
                        <div className="absolute top-space-md left-space-md flex items-center gap-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-space-2xs rounded-full shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
                          <span className="font-code-sm text-code-sm text-on-surface font-medium">Production Node</span>
                        </div>
                      </div>
                      <div className="w-full lg:w-5/12 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-space-xs mb-space-xs">
                            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Featured Architecture</span>
                            <span className="text-outline-variant">•</span>
                            <span className="font-code-sm text-code-sm text-on-surface-variant">{techStack.slice(0, 3).join(' + ')}</span>
                          </div>
                          <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-space-sm">{localizedTitle}</h3>
                          <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">{localizedDesc}</p>
                          <div className="flex flex-wrap gap-space-xs mb-space-lg">
                            {techStack.slice(0, 4).map(tech => (
                              <span key={tech} className="px-space-xs py-space-2xs rounded bg-surface-container-high/60 font-code-sm text-code-sm text-on-surface-variant">{tech}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-space-md pt-space-xs">
                          <a className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-on-surface text-surface-container-lowest font-label-md text-label-md hover:bg-on-surface/90 shadow-sm transition-all" href={project.repoUrl || '#'} target="_blank" rel="noopener noreferrer">
                            <span>View Source</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                          </a>
                          <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-space-xs font-label-md text-label-md text-on-surface hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">terminal</span>
                            <span>Case Study</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={project.id}
                    className="lg:col-span-6 rounded-xl bg-surface-container-lowest backdrop-blur-md border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.15),0_6px_16px_rgba(24,24,27,0.1)] hover:-translate-y-1 p-space-lg flex flex-col justify-between transition-all duration-300"
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
                  >
                    <div>
                      <div className="rounded-lg overflow-hidden bg-surface-container-low mb-space-md">
                        <img className="w-full h-56 object-cover" src={uploadService.getImageUrl(image)} alt={localizedTitle} />
                      </div>
                      <div className="flex items-center gap-space-xs mb-space-xs">
                        <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">{project.category}</span>
                        <span className="text-outline-variant">•</span>
                        <span className="font-code-sm text-code-sm text-on-surface-variant">{techStack.slice(0, 2).join(' + ')}</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-space-xs">{localizedTitle}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{localizedDesc}</p>
                      <div className="flex flex-wrap gap-space-xs mb-space-md">
                        {techStack.slice(0, 3).map(tech => (
                          <span key={tech} className="px-space-xs py-space-2xs rounded bg-surface-container-high/60 font-code-sm text-code-sm text-on-surface-variant">{tech}</span>
                        ))}
                      </div>
                    </div>
                      <div className="flex items-center justify-between pt-space-sm">
                      <span className="font-code-sm text-code-sm text-tertiary flex items-center gap-1 font-medium">
                        <span className="w-2 h-2 rounded-full bg-tertiary"></span> {project.status}
                      </span>
                      <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-space-2xs font-label-md text-label-md text-primary hover:text-primary-container font-semibold">
                        <span>Inspect Architecture</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ============ TECH MARQUEE ============ */}
          <TechMarquee />
        </div>
      </div>
    </main>
  );
};

export default Home;
