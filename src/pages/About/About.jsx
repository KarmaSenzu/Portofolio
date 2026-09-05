import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { skillService } from '../../services/skills';
import { certificateService } from '../../services/certificates';
import { experienceService } from '../../services/experiences';
import { settingsService } from '../../services/settings';
import { uploadService } from '../../services/upload';
import { getLocalizedText } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import TechMarquee from '../../components/TechMarquee/TechMarquee';

const About = () => {
  const { t, i18n } = useTranslation();
  const { onPageView } = useAnalytics();
  const language = i18n.language;

  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImages, setProfileImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  // Flip card state
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Tilt-follow cursor (360 derajat, max ±45°) - pakai ref + lerp (smooth, tanpa re-render)
  const profileRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const handleProfileMouseMove = (e) => {
    updateTilt(e.clientX, e.clientY);
  };

  // Touch support (mobile): update tilt pakai sentuhan
  const handleProfileTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateTilt(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const updateTilt = (clientX, clientY) => {
    const el = profileRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    // Set target (max ±45°)
    targetRef.current.x = (0.5 - y) * 90; // rotateX (pitch)
    targetRef.current.y = (x - 0.5) * 90; // rotateY (yaw)
  };

  const handleProfileMouseLeave = () => {
    targetRef.current.x = 0;
    targetRef.current.y = 0;
  };

  const handleProfileTouchEnd = () => {
    targetRef.current.x = 0;
    targetRef.current.y = 0;
  };

  // Lerp animation loop (jalan terus, smooth)
  useEffect(() => {
    const animate = () => {
      const el = profileRef.current;
      if (el) {
        // Lerp current menuju target (faktor 0.12 = smooth)
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.12;
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.12;
        el.style.transform = `rotateX(${currentRef.current.x}deg) rotateY(${currentRef.current.y}deg)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Auto flip setiap 4 detik (flip ke belakang cepat → reset ke 0° → balik depan foto baru)
  useEffect(() => {
    if (profileImages.length <= 1) return;
    const interval = setInterval(() => {
      // Reset tilt ke titik tengah (0°) saat flip
      targetRef.current.x = 0;
      targetRef.current.y = 0;
      currentRef.current.x = 0;
      currentRef.current.y = 0;
      setIsFlipped(true); // flip ke belakang (logo) - cepat
      // Setelah 0.4 detik, balik ke depan dengan foto berikutnya
      setTimeout(() => {
        setCurrentPhotoIndex(prev => (prev + 1) % profileImages.length);
        setIsFlipped(false); // balik ke depan
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [profileImages.length]);

  useEffect(() => {
    onPageView('about');
  }, [onPageView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [skillsRes, certsRes, expRes, hobbiesRes, profileRes] = await Promise.allSettled([
          skillService.getAll(),
          certificateService.getAll(),
          experienceService.getAll(),
          settingsService.get('hobbies'),
          settingsService.get('profile_images'),
        ]);

        if (skillsRes.status === 'fulfilled') {
          const d = skillsRes.value?.data || skillsRes.value || [];
          setSkills(Array.isArray(d) ? d : []);
        }
        if (certsRes.status === 'fulfilled') {
          const d = certsRes.value?.data || certsRes.value || [];
          setCertificates(Array.isArray(d) ? d : []);
        }
        if (expRes.status === 'fulfilled') {
          const d = expRes.value?.data || expRes.value || [];
          setExperiences(Array.isArray(d) ? d : []);
        }
        if (hobbiesRes.status === 'fulfilled') {
          const res = hobbiesRes.value;
          const d = res?.value || res?.data || res || [];
          setHobbies(Array.isArray(d) ? d : []);
        }
        if (profileRes.status === 'fulfilled') {
          const res = profileRes.value;
          const urls = res?.value || res?.data || res || [];
          const list = Array.isArray(urls) ? urls : [];
          setProfileImages(list.map(u => uploadService.getImageUrl(u)));
          setProfileImage(list.length > 0 ? uploadService.getImageUrl(list[0]) : null);
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="w-full pt-20 bg-transparent overflow-x-hidden">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-3xl flex flex-col gap-space-2xl">

          {/* ============ SECTION 1: HERO / PROFILE BENTO ============ */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center mb-space-3xl">
            {/* Left Narrative */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-low shadow-sm w-fit">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container"></span>
                </span>
                <span className="font-code-sm text-code-sm text-tertiary font-semibold tracking-wide uppercase">Available for Full-Stack &amp; Architecture Roles</span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <h1 className="font-headline-2xl text-headline-2xl text-on-surface tracking-tight">
                  Hi, I&rsquo;m <span className="text-primary">Damar</span>.
                </h1>
                <p className="font-headline-md text-headline-md text-on-surface-variant font-medium">
                  Full-Stack Software Engineer architecting resilient web platforms, distributed cloud systems, and AI-driven automation.
                </p>
              </div>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
                I bridge user-centric frontend ergonomics with resilient backend systems. With practical experience spanning scalable microservices in Go, modern TypeScript web architectures, and automated Linux server orchestration, I build software that performs under load and delights in production.
              </p>

              {/* CTA Cluster */}
              <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
                <a href="#contact-connect" className="flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md hover:shadow-xl transition-all font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span>Get in Touch</span>
                </a>
                <Link to="/projects" className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
                  <span>Explore Stack</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                </Link>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-md">
                <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col">
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">4+</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">Years Hands-on Dev</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col">
                  <span className="font-headline-lg text-headline-lg text-secondary font-bold">3.84</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">GPA Magna Cum Laude</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col">
                  <span className="font-headline-lg text-headline-lg text-tertiary-container font-bold">100%</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">Client On-Time SLA</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">18+</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">Production Deploys</span>
                </div>
              </div>
            </div>

            {/* Right Portrait Frame */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end overflow-hidden py-6" style={{ perspective: '1400px' }}>
              <div
                ref={profileRef}
                className="relative w-full max-w-md"
                style={{
                  transformStyle: 'preserve-3d',
                  // Transform diatur langsung via ref (lerp smooth), bukan state
                  transform: 'rotateX(0deg) rotateY(0deg)',
                }}
                onMouseMove={handleProfileMouseMove}
                onMouseLeave={handleProfileMouseLeave}
                onTouchMove={handleProfileTouchMove}
                onTouchEnd={handleProfileTouchEnd}
              >
                {/* Depan Frame (normal) */}
                <div
                  className="relative w-full rounded-xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-xl p-space-md flex flex-col gap-space-md"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: isFlipped ? 'transform 0.4s ease-in-out' : 'transform 0.6s ease-in-out',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <div className="flex items-center justify-between px-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                      <span className="font-code-sm text-code-sm text-on-surface-variant ml-2 font-medium">damar.engineer.profile</span>
                    </div>
                    <span className="font-code-sm text-code-sm px-space-xs py-space-2xs bg-surface-container-high rounded text-on-surface-variant">ID: 844-JKT</span>
                  </div>

                  {/* Card foto (diam, tidak tilt) */}
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-md">
                    <img
                      className="w-full h-full object-cover object-center"
                      src={profileImages[currentPhotoIndex] || profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face'}
                      alt="Damar profile"
                    />
                    <div className="absolute bottom-3 left-3 right-3 p-space-sm rounded-lg bg-surface-container-lowest/95 backdrop-blur-md shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[18px] text-tertiary-container">verified</span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">Verified Tech Lead</span>
                      </div>
                      <span className="font-code-sm text-code-sm text-primary font-bold">Jakarta / Remote</span>
                    </div>
                    {/* Indikator foto */}
                    {profileImages.length > 1 && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
                        {profileImages.map((_, i) => (
                          <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentPhotoIndex ? 'bg-white' : 'bg-white/50'}`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-space-xs px-space-xs text-on-surface-variant font-code-sm text-code-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-secondary">terminal</span>
                      <span>Go • React 19 • Cloud VPS</span>
                    </div>
                    <span className="font-code-sm text-code-sm text-tertiary-container font-semibold">● 99.98% Uptime</span>
                  </div>
                </div>

                {/* Belakang Frame (logo Dmr Dev - kartu pokemon) */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo to-cyan flex flex-col items-center justify-center gap-space-sm shadow-xl"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    transition: isFlipped ? 'transform 0.6s ease-in-out' : 'transform 0.4s ease-in-out',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <span className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold text-white">{'</>'}</span>
                  <span className="font-headline-xl text-headline-xl text-white font-bold">Dmr Dev</span>
                  <span className="font-code-sm text-code-sm text-white/70">Full-Stack Engineer</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-white/70"></span>
                    <span className="w-2 h-2 rounded-full bg-white/50"></span>
                    <span className="w-2 h-2 rounded-full bg-white/30"></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ SECTION 2: TECHNICAL TOOLKIT ============ */}
          <section className="flex flex-col gap-space-xl mb-space-3xl" id="technical-toolkit">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
              <div className="flex flex-col gap-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="h-5 w-1.5 rounded-full bg-primary"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Engineering Matrix</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl text-on-surface">Technical Toolkit</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Curated programming languages, frameworks, distributed primitives, and automation tooling proven in production environments.
              </p>
            </div>

            {/* Kategori (group by category, tampilkan 1 card per kategori) */}
            {(() => {
              // Group skills by category
              const categories = {};
              skills.forEach(skill => {
                const cat = skill.category || 'other';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(skill);
              });

              const categoryMeta = {
                'frontend': { icon: 'language', label: 'Frontend', accent: 'text-secondary' },
                'backend': { icon: 'data_object', label: 'Backend', accent: 'text-primary' },
                'devops': { icon: 'cloud', label: 'DevOps / Infra', accent: 'text-tertiary' },
                'design': { icon: 'palette', label: 'Design', accent: 'text-primary' },
                'tools': { icon: 'build', label: 'Tools', accent: 'text-secondary' },
                'other': { icon: 'code', label: 'Other', accent: 'text-primary' },
              };

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {Object.entries(categories).map(([category, items]) => {
                    const meta = categoryMeta[category] || categoryMeta.other;
                    return (
                      <motion.div
                        key={category}
                        className="p-space-lg rounded-xl bg-surface-container-lowest backdrop-blur-md border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.15),0_4px_12px_rgba(24,24,27,0.1)] hover:-translate-y-1 transition-all flex flex-col gap-space-md"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{meta.label}</span>
                          <span className={`material-symbols-outlined text-[22px] ${meta.accent}`}>{meta.icon}</span>
                        </div>
                        <div className="flex flex-wrap gap-space-xs">
                          {items.map(skill => (
                            <span key={skill.name} className="px-space-sm py-1 rounded bg-surface-container-low text-on-surface font-code-sm text-code-sm">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}
          </section>

          {/* ============ SECTION 3: MY JOURNEY ============ */}
          <section className="flex flex-col gap-space-xl mb-space-3xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
              <div className="flex flex-col gap-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="h-5 w-1.5 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">Chronology</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl text-on-surface">My Journey &amp; Milestones</h2>
              </div>
              <div className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-low rounded-full">
                <span className="material-symbols-outlined text-[16px] text-tertiary-container">timeline</span>
                <span className="font-code-sm text-code-sm text-on-surface-variant">2022 — Present Continuous</span>
              </div>
            </div>

            <div className="flex flex-col gap-space-lg relative pl-8 sm:pl-10">
              <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-surface-container-highest rounded-full"></div>
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="relative flex flex-col gap-space-xs p-space-lg rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-sm hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -left-6 top-6 w-4 h-4 rounded-full bg-primary-fixed flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        {getLocalizedText(exp.title, language)}
                      </h3>
                      <span className="px-space-xs py-space-2xs rounded bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm">{exp.company}</span>
                    </div>
                    <span className="font-code-sm text-code-sm text-primary font-bold">{getLocalizedText(exp.period, language)}</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-space-xs">
                    {getLocalizedText(exp.description, language)}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ============ SECTION 4: CERTIFICATES ============ */}
          <section className="flex flex-col gap-space-xl mb-space-3xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
              <div className="flex flex-col gap-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="h-5 w-1.5 rounded-full bg-tertiary-container"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary font-bold">Verified Competencies</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl text-on-surface flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-tertiary-container text-[32px]">verified</span>
                  Sertifikat &amp; Kredensial
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Nationally accredited standards and certified programming benchmarks verified by independent examination authorities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {certificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  className="flex flex-col rounded-xl bg-surface-container-lowest backdrop-blur-md border border-outline-variant/40 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.15),0_4px_12px_rgba(24,24,27,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="h-44 bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={uploadService.getImageUrl(cert.image)} alt={getLocalizedText(cert.title, language)} />
                    <span className="absolute top-3 left-3 px-space-xs py-space-2xs rounded bg-surface-container-lowest/90 backdrop-blur font-code-sm text-code-sm text-primary font-semibold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                    </span>
                  </div>
                  <div className="p-space-lg flex flex-col justify-between flex-1 gap-space-md">
                    <div className="flex flex-col gap-space-2xs">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                        {getLocalizedText(cert.title, language)}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{cert.issuer}</p>
                    </div>
                    <button
                      className="w-full py-space-xs px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-label-md transition-all flex items-center justify-center gap-space-xs"
                      onClick={() => setSelectedCert(cert)}
                    >
                      <span>Lihat Detail</span>
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ============ SECTION 5: WHEN I'M AFK ============ */}
          <section className="flex flex-col gap-space-lg mb-space-3xl">
            <div className="flex items-center gap-space-xs">
              <span className="h-5 w-1.5 rounded-full bg-tertiary"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary font-bold">Beyond The Terminal</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface">When I'm AFK (Away From Keyboard)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {hobbies.length > 0 ? hobbies.map((hobby) => (
                <div key={hobby.title?.en} className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-xl shadow-xs">{hobby.icon}</div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{getLocalizedText(hobby.title, language)}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{getLocalizedText(hobby.description, language)}</p>
                </div>
              )) : (
                <div className="col-span-full text-center p-space-xl text-on-surface-variant font-body-md text-body-md">
                  Hobbies coming soon — add them via CMS.
                </div>
              )}
            </div>
          </section>

          {/* ============ TECH MARQUEE ============ */}
          <TechMarquee />

          {/* ============ SECTION 6: CONTACT ============ */}
          <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest/95 backdrop-blur-xl shadow-xl p-space-xl lg:p-space-2xl flex flex-col lg:flex-row items-center justify-between gap-space-xl" id="contact-connect">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-fixed/40 rounded-full blur-[90px] pointer-events-none"></div>
            <div className="flex flex-col gap-space-sm max-w-xl">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse"></span>
                <span className="font-code-sm text-code-sm text-tertiary font-bold uppercase tracking-wider">Direct Access • Fast Response (&lt; 24h)</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                Have an architectural challenge or project in mind?
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Whether you're scaling a Go-backed service, deploying micro-frontends with Next.js, or seeking consulting on Linux infrastructure, I'm happy to collaborate.
              </p>
            </div>
            <div className="flex flex-col gap-space-md w-full sm:w-auto">
              <div className="flex items-center justify-between gap-space-md p-space-sm rounded-lg bg-surface-container-low shadow-xs min-w-0">
                <span className="font-code-sm text-code-sm text-on-surface select-all px-space-xs font-semibold break-all min-w-0">damar@example.com</span>
                <button
                  className="shrink-0 flex items-center gap-space-2xs px-space-md py-space-xs bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md rounded shadow-xs transition-colors"
                  onClick={() => navigator.clipboard.writeText('damar@example.com')}
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Copy</span>
                </button>
              </div>
              <div className="flex items-center gap-space-sm">
                <a className="flex-1 flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md transition-all font-label-md text-label-md text-center" href="mailto:damar@example.com">
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Send Email Directly</span>
                </a>
                <a className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface shadow-xs transition-colors" href="https://github.com/KarmaSenzu" target="_blank" rel="noopener noreferrer" title="GitHub">
                  <span className="material-symbols-outlined text-[20px]">code</span>
                </a>
                <a className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface shadow-xs transition-colors" href="https://www.linkedin.com/in/damar-fikrie-216240238/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <span className="material-symbols-outlined text-[20px]">work</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-xl shadow-2xl flex flex-col gap-space-md relative"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs text-tertiary-container">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                  <span className="font-code-sm text-code-sm font-bold uppercase tracking-wider">Verified Credential Record</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant" onClick={() => setSelectedCert(null)}>
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-space-2xs pt-space-xs">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">{getLocalizedText(selectedCert.title, language)}</h3>
                <p className="font-label-md text-label-md text-primary font-medium">{selectedCert.issuer}</p>
              </div>
              {selectedCert.credentialUrl && (
                <a href={selectedCert.credentialUrl} target="_blank" rel="noopener noreferrer" className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors text-center">
                  Verify Credential
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default About;
