-- ================================================
-- PORTFOLIO DAMAR - COMPLETE DATA INSERT
-- ================================================
-- Generated from: Damar_Portfolio_Master_Data.md
-- Date: 2026-09-04
-- Notes: 
--   - Images use Unsplash dummy URLs (replace via CMS later)
--   - No certificates (per master data - don't fabricate)
--   - No hobbies (per master data - need user input)
--   - All content is bilingual (EN/ID)
-- ================================================

-- ================================================
-- PART 1: SKILLS (62 items)
-- ================================================

-- Languages
INSERT INTO skills (name, icon, category, color, sort_order) VALUES
('Go', '🐹', 'backend', '#00ADD8', 1),
('JavaScript', '🟨', 'frontend', '#F7DF1E', 2),
('TypeScript', '📘', 'frontend', '#3178C6', 3),
('Python', '🐍', 'backend', '#3776AB', 4),
('PHP', '🐘', 'backend', '#777BB4', 5),
('HTML', '📄', 'frontend', '#E34F26', 6),
('CSS', '🎨', 'frontend', '#1572B6', 7),
('Java', '☕', 'backend', '#ED8B00', 8),
('Dart', '🎯', 'backend', '#0175C2', 9);

-- Frontend Frameworks
INSERT INTO skills (name, icon, category, color, sort_order) VALUES
('React', '⚛️', 'frontend', '#61DAFB', 10),
('React 19', '⚛️', 'frontend', '#61DAFB', 11),
('Next.js', '▲', 'frontend', '#000000', 12),
('Next.js App Router', '▲', 'frontend', '#000000', 13),
('Vite', '⚡', 'frontend', '#646CFF', 14),
('Tailwind CSS', '💨', 'frontend', '#06B6D4', 15),
('Bootstrap', '🅱️', 'frontend', '#7952B3', 16),
('TanStack Query', '🔄', 'frontend', '#FF4154', 17),
('Recharts', '📊', 'frontend', '#FF7300', 18),
('xterm.js', '💻', 'frontend', '#000000', 19),
('Flutter', '🐦', 'frontend', '#02569B', 20);

-- Backend Frameworks
INSERT INTO skills (name, icon, category, color, sort_order) VALUES
('Gin', '🟢', 'backend', '#00ADD8', 21),
('Node.js', '🟩', 'backend', '#339933', 22),
('Express', '🚂', 'backend', '#000000', 23),
('Laravel', '🔧', 'backend', '#FF2D20', 24),
('CodeIgniter 4', '🎯', 'backend', '#EF4F24', 25),
('REST API', '🔌', 'backend', '#000000', 26),
('JWT', '🔑', 'backend', '#D63AFF', 27),
('Clean Architecture', '🏛️', 'backend', '#00ADD8', 28);

-- Database
INSERT INTO skills (name, icon, category, color, sort_order) VALUES
('SQLite', '📦', 'backend', '#003B57', 29),
('MySQL', '🐬', 'backend', '#4479A1', 30),
('PostgreSQL', '🐘', 'backend', '#4169E1', 31),
('Supabase', '⚡', 'backend', '#3ECF8E', 32),
('SQLC', '🗄️', 'backend', '#00ADD8', 33),
('Database Migrations', '🔄', 'backend', '#000000', 34);

-- Infrastructure / DevOps
INSERT INTO skills (name, icon, category, color, sort_order) VALUES
('Linux', '🐧', 'devops', '#FCC624', 35),
('VPS', '🖥️', 'devops', '#000000', 36),
('Docker', '🐳', 'devops', '#2496ED', 37),
('Docker Compose', '📦', 'devops', '#0DB7ED', 38),
('Nginx', '🌐', 'devops', '#009639', 39),
('PM2', '⚙️', 'devops', '#2B037A', 40),
('SSH', '🔐', 'devops', '#000000', 41),
('SFTP', '📁', 'devops', '#000000', 42),
('Cloudflare Tunnel', '☁️', 'devops', '#F38020', 43),
('Systemd', '🌀', 'devops', '#3DA6E5', 44),
('GitHub Actions', '🔄', 'devops', '#2088FF', 45);

-- AI / Automation
INSERT INTO skills (name, icon, category, color, sort_order) VALUES
('Multi-model LLM', '🤖', 'backend', '#FF6B6B', 46),
('AI Tool Calling', '⚡', 'backend', '#00ADD8', 47),
('MCP', '🔗', 'backend', '#3178C6', 48),
('Hermes Agent', '🕊️', 'backend', '#00ADD8', 49),
('AI Automation', '🤖', 'backend', '#FF6B6B', 50),
('Telegram Bots', '✈️', 'backend', '#26A5E4', 51),
('Speech-to-Text', '🎙️', 'backend', '#00ADD8', 52),
('Deep Research', '🔍', 'backend', '#00ADD8', 53),
('Document Analysis', '📄', 'backend', '#000000', 54),
('SearXNG', '🔎', 'backend', '#3050F8', 55),
('9Router', '🛣️', 'backend', '#00ADD8', 56);

-- Security
INSERT INTO skills (name, icon, category, color, sort_order) VALUES
('RBAC', '🛡️', 'backend', '#00ADD8', 57),
('bcrypt', '🔒', 'backend', '#000000', 58),
('CORS', '🌐', 'backend', '#00ADD8', 59),
('Rate Limiting', '⏱️', 'backend', '#FF4154', 60),
('API Security', '🔐', 'backend', '#00ADD8', 61),
('Endpoint Testing', '🧪', 'backend', '#00ADD8', 62);

-- ================================================
-- PART 2: EXPERIENCES (2 items)
-- ================================================

-- Education
INSERT INTO experiences (
  title_en, title_id, company,
  period_en, period_id,
  description_en, description_id,
  is_current, is_education, sort_order
) VALUES (
  'Bachelor of Informatics', 'Sarjana Informatika',
  'Universitas Bina Sarana Informatika',
  '2022 — 2026', '2022 — 2026',
  'Informatics student with a practical focus on software engineering, backend development, web technologies, infrastructure, AI integration, and application deployment. GPA: 3.84',
  'Mahasiswa Informatika dengan fokus praktis pada software engineering, backend development, teknologi web, infrastructure, integrasi AI, dan deployment aplikasi. IPK: 3.84',
  true, true, 1
);

-- Freelance Experience
INSERT INTO experiences (
  title_en, title_id, company,
  period_en, period_id,
  description_en, description_id,
  is_current, is_education, sort_order
) VALUES (
  'Freelance Full Stack Developer', 'Freelance Full Stack Developer',
  'Independent',
  '2024 — Present', '2024 — Sekarang',
  'Develop full-stack web applications, backend APIs, AI-powered applications, infrastructure tools, and automation systems. Work across application development, backend engineering, deployment, Linux server management, and DevOps-oriented workflows.',
  'Mengembangkan aplikasi web full-stack, backend API, aplikasi berbasis AI, infrastructure tools, dan sistem automation. Mengerjakan proses pengembangan aplikasi, backend engineering, deployment, Linux server management, dan workflow yang berorientasi DevOps.',
  true, false, 2
);

-- ================================================
-- PART 3: SETTINGS (Hero & About)
-- ================================================

-- Hero Images (Dummy - replace with real screenshots via CMS)
INSERT INTO settings (setting_key, setting_value) VALUES
('hero_images', '[
  "https://images.unsplash.com/photo-1451187580459-9543f1c0e8f0?w=1200&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afd70b16ad35?w=1200&q=80"
]'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Hero Headline
INSERT INTO settings (setting_key, setting_value) VALUES
('hero_headline', '{
  "en": "Hi, I am Damar. I build scalable software & infrastructure.",
  "id": "Hai, saya Damar. Saya membangun software dan infrastruktur yang scalable."
}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Hero Description
INSERT INTO settings (setting_key, setting_value) VALUES
('hero_description', '{
  "en": "Full-stack developer and backend engineer focused on building web applications, APIs, AI-powered systems, infrastructure platforms, and self-hosted solutions.",
  "id": "Full-stack developer dan backend engineer yang berfokus pada pengembangan aplikasi web, API, sistem berbasis AI, platform infrastructure, dan solusi self-hosted."
}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- About Content
INSERT INTO settings (setting_key, setting_value) VALUES
('about_content', '{
  "en": "I am Damar Fikrie, also known as KarmaSenzu. I am an Informatics student and freelance full-stack developer from Indonesia.\n\nI build and experiment with web applications, backend systems, RESTful APIs, AI-powered applications, inventory systems, finance trackers, POS systems, and server-based deployments.\n\nBeyond application development, I work with Linux VPS environments and technologies such as Nginx, PM2, Docker, and Cloudflare Tunnel. My current learning direction focuses on backend engineering, DevOps, system design, software architecture, database design, and scalable applications.\n\nMy projects increasingly combine application development with infrastructure, automation, AI integration, and real-world deployment.",
  "id": "Saya Damar Fikrie, dikenal juga sebagai KarmaSenzu. Saya adalah mahasiswa Informatika dan freelance full-stack developer dari Indonesia.\n\nSaya membangun dan bereksperimen dengan aplikasi web, sistem backend, REST API, aplikasi berbasis AI, inventory system, finance tracker, POS system, dan sistem berbasis server.\n\nSelain pengembangan aplikasi, saya juga bekerja dengan lingkungan Linux VPS serta teknologi seperti Nginx, PM2, Docker, dan Cloudflare Tunnel. Saat ini saya berfokus mengembangkan kemampuan di bidang backend engineering, DevOps, system design, software architecture, database design, dan scalable applications.\n\nProject yang saya bangun semakin menggabungkan software development dengan infrastructure, automation, AI integration, dan deployment nyata."
}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- ================================================
-- PART 4: PROJECTS (13 items)
-- ================================================

-- ================================================
-- PROJECT 1: ServerMonitoring (Featured #1)
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'server-monitoring',
  'Infrastructure Monitoring & Management Platform',
  'Platform Monitoring & Manajemen Infrastruktur',
  'A comprehensive infrastructure monitoring and management platform evolving from single-server monitoring into multi-host fleet management with SSH, containers, terminals, remote commands, file management, tunnels, cloud discovery, RBAC, and AI integration.',
  'Platform monitoring dan manajemen infrastruktur yang berkembang dari monitoring single-server menjadi manajemen multi-host dengan SSH, container, terminal, remote command, file management, tunnel, cloud discovery, RBAC, dan integrasi AI.',
  'The project evolved from a VPS monitoring dashboard into a broader infrastructure platform. It follows the workflow MONITOR → UNDERSTAND → INVESTIGATE → ACT → VERIFY and supports multiple database backends, remote server monitoring, SSH-based management, container management, terminals, SFTP, tunnels, cloud discovery, RBAC, notifications, and MCP/AI integration.',
  'Project ini berkembang dari dashboard monitoring VPS menjadi platform infrastructure yang lebih luas. Sistem mengikuti alur MONITOR → UNDERSTAND → INVESTIGATE → ACT → VERIFY dan mendukung beberapa backend database, remote server monitoring, SSH management, container management, terminal, SFTP, tunnel, cloud discovery, RBAC, notification, serta MCP/AI integration.',
  'web-app', 'fullstack',
  '["Go 1.25", "Gin", "React 19", "Vite", "TanStack Query", "Recharts", "xterm.js", "SQLite", "PostgreSQL", "Docker", "Docker Compose", "Nginx", "SSH", "SFTP", "SSE", "WebSocket", "MCP"]'::jsonb,
  '["https://images.unsplash.com/photo-1551288049-bebda4e04f83?w=800", "https://images.unsplash.com/photo-1460925895917-afd70b16ad35?w=800", "https://images.unsplash.com/photo-1558494949-ef5238fcad8c?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/ServerMonitoring',
  'https://github.com/KarmaSenzu/ServerMonitoring',
  '2026-08', 'Ongoing', 'in-progress', true, 1,
  'Managing multiple servers normally requires switching between SSH terminals, monitoring dashboards, container tools, file managers, and other infrastructure utilities.',
  'Mengelola multiple server biasanya memerlukan perpindahan antara terminal SSH, dashboard monitoring, container tools, file manager, dan utilitas infrastruktur lainnya.',
  'Built a centralized infrastructure platform that brings server monitoring, SSH management, remote commands, container management, terminal access, SFTP, tunnels, cloud discovery, RBAC, notifications, and AI/MCP capabilities into one system.',
  'Membangun platform infrastruktur terpusat yang menggabungkan server monitoring, SSH management, remote command, container management, terminal access, SFTP, tunnel, cloud discovery, RBAC, notification, dan kemampuan AI/MCP dalam satu sistem.',
  'The project evolved from a local VPS monitoring dashboard into a multi-host infrastructure management platform with single-binary and Docker deployment modes.',
  'Project ini berkembang dari dashboard monitoring VPS lokal menjadi platform manajemen infrastruktur multi-host dengan mode deployment single-binary dan Docker.',
  '[{"title": {"en": "Multi-host Communication", "id": "Komunikasi Multi-host"}, "description": {"en": "Agentless SSH-based remote monitoring", "id": "Monitoring remote berbasis SSH tanpa agent"}, "solution": {"en": "Agentless SSH-based remote monitoring and command execution", "id": "Monitoring dan eksekusi command remote berbasis SSH tanpa agent"}}, {"title": {"en": "Real-time Monitoring", "id": "Monitoring Real-time"}, "description": {"en": "Live metrics streaming", "id": "Streaming metrics langsung"}, "solution": {"en": "SSE for metrics/events and WebSocket for interactive terminal sessions", "id": "SSE untuk metrics/events dan WebSocket untuk sesi terminal interaktif"}}, {"title": {"en": "Deployment Flexibility", "id": "Fleksibilitas Deployment"}, "description": {"en": "Multiple deployment options", "id": "Berbagai opsi deployment"}, "solution": {"en": "Single binary, Docker Compose, and systemd deployment paths", "id": "Deployment single binary, Docker Compose, dan systemd"}}, {"title": {"en": "Database Flexibility", "id": "Fleksibilitas Database"}, "description": {"en": "Multiple database backends", "id": "Berbagai backend database"}, "solution": {"en": "SQLite as zero-config default with PostgreSQL/Supabase support", "id": "SQLite sebagai default zero-config dengan dukungan PostgreSQL/Supabase"}}, {"title": {"en": "Infrastructure Safety", "id": "Keamanan Infrastruktur"}, "description": {"en": "Secure access control", "id": "Kontrol akses aman"}, "solution": {"en": "JWT authentication, RBAC, safe command execution, SSH key handling", "id": "Autentikasi JWT, RBAC, eksekusi command aman, handling SSH key"}}]'::jsonb,
  '[{"icon": "🖥️", "title": {"en": "Server Registry", "id": "Server Registry"}, "description": {"en": "Multi-host server management", "id": "Manajemen server multi-host"}}, {"icon": "📊", "title": {"en": "Real-time Monitoring", "id": "Monitoring Real-time"}, "description": {"en": "Live metrics and alerts", "id": "Metrics dan alert langsung"}}, {"icon": "🔐", "title": {"en": "SSH Engine", "id": "SSH Engine"}, "description": {"en": "Secure remote management", "id": "Manajemen remote aman"}}, {"icon": "🐳", "title": {"en": "Container Management", "id": "Manajemen Container"}, "description": {"en": "Docker fleet control", "id": "Kontrol fleet Docker"}}, {"icon": "💻", "title": {"en": "Web Terminal", "id": "Web Terminal"}, "description": {"en": "Browser-based PTY", "id": "PTY berbasis browser"}}, {"icon": "🤖", "title": {"en": "MCP / AI Integration", "id": "Integrasi MCP / AI"}, "description": {"en": "AI-powered infrastructure", "id": "Infrastruktur berbasis AI"}}]'::jsonb
);

-- ================================================
-- PROJECT 2: Dmrxai (Featured #2)
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'dmrxai',
  'Dmr x AI — Self-Hosted Multi-Model AI Platform',
  'Dmr x AI — Platform AI Multi-Model Self-Hosted',
  'A self-hosted multi-model AI chat platform with document analysis, web search, data visualization, Mermaid diagrams, AI tool calling, and containerized deployment.',
  'Platform chat AI multi-model self-hosted dengan analisis dokumen, web search, visualisasi data, Mermaid diagram, AI tool calling, dan deployment berbasis container.',
  'Dmr x AI combines multiple AI providers through 9Router with document analysis, local web search through SearXNG, interactive chart rendering, Mermaid diagrams, thinking and deep research modes, and a self-hosted Docker Compose deployment model.',
  'Dmr x AI menggabungkan berbagai provider AI melalui 9Router dengan analisis dokumen, web search lokal melalui SearXNG, rendering chart interaktif, Mermaid diagram, mode thinking dan deep research, serta deployment self-hosted menggunakan Docker Compose.',
  'web-app', 'fullstack',
  '["Next.js 14", "TypeScript", "Tailwind CSS", "react-markdown", "remark-gfm", "rehype-highlight", "Recharts", "Mermaid", "SheetJS", "pdfjs-dist", "mammoth", "Docker Compose", "Cloudflare Tunnel", "9Router", "SearXNG"]'::jsonb,
  '["https://images.unsplash.com/photo-1677442136019-21780ecad925?w=800", "https://images.unsplash.com/photo-1620712943543-bcc468d3e4fa?w=800", "https://images.unsplash.com/photo-1555949963-ff7925637738?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/Dmrxai',
  'https://github.com/KarmaSenzu/Dmrxai',
  '2026-07', 'Ongoing', 'completed', true, 2,
  'AI users often need to switch between different model providers, document tools, search engines, and visualization utilities.',
  'Pengguna AI sering perlu beralih antara berbagai provider model, tool dokumen, search engine, dan utilitas visualisasi.',
  'Built a self-hosted AI workspace that unifies multi-provider model routing, document intelligence, web search, visualization, diagram generation, and tool calling in one application.',
  'Membangun workspace AI self-hosted yang menyatukan routing model multi-provider, document intelligence, web search, visualisasi, diagram generation, dan tool calling dalam satu aplikasi.',
  'Created a deployable AI workspace that can run under developer-controlled infrastructure using Docker Compose and Cloudflare Tunnel.',
  'Membuat workspace AI yang dapat dideploy di infrastruktur yang dikontrol developer menggunakan Docker Compose dan Cloudflare Tunnel.',
  '[{"title": {"en": "Multi-provider Integration", "id": "Integrasi Multi-provider"}, "description": {"en": "Multiple AI model providers", "id": "Berbagai provider model AI"}, "solution": {"en": "9Router for unified multi-provider routing", "id": "9Router untuk routing multi-provider terpadu"}}, {"title": {"en": "Document Intelligence", "id": "Document Intelligence"}, "description": {"en": "Large file processing", "id": "Pemrosesan file besar"}, "solution": {"en": "Smart sampling and schema extraction for large spreadsheets", "id": "Sampling pintar dan ekstraksi schema untuk spreadsheet besar"}}, {"title": {"en": "Self-hosted Deployment", "id": "Deployment Self-hosted"}, "description": {"en": "Developer-controlled infrastructure", "id": "Infrastruktur yang dikontrol developer"}, "solution": {"en": "Docker Compose with isolated container network", "id": "Docker Compose dengan jaringan container terisolasi"}}]'::jsonb,
  '[{"icon": "🤖", "title": {"en": "Multi-model Chat", "id": "Chat Multi-model"}, "description": {"en": "Claude, GPT, Gemini routing", "id": "Routing Claude, GPT, Gemini"}}, {"icon": "📄", "title": {"en": "Document Analysis", "id": "Analisis Dokumen"}, "description": {"en": "Excel, PDF, DOCX, Image", "id": "Excel, PDF, DOCX, Gambar"}}, {"icon": "🔍", "title": {"en": "Web Search", "id": "Web Search"}, "description": {"en": "Local SearXNG integration", "id": "Integrasi SearXNG lokal"}}, {"icon": "📊", "title": {"en": "Chart Rendering", "id": "Rendering Chart"}, "description": {"en": "8 chart types with Recharts", "id": "8 jenis chart dengan Recharts"}}, {"icon": "🎨", "title": {"en": "Mermaid Diagrams", "id": "Diagram Mermaid"}, "description": {"en": "Visual diagram generation", "id": "Generasi diagram visual"}}, {"icon": "🚢", "title": {"en": "Docker Deployment", "id": "Deployment Docker"}, "description": {"en": "Self-hosted container setup", "id": "Setup container self-hosted"}}]'::jsonb
);

-- ================================================
-- PROJECT 3: Hermes Multi-Bot System (Featured #3)
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'hermes-multi-bot',
  'Hermes Multi-Bot AI Automation System',
  'Sistem Otomasi AI Multi-Bot Hermes',
  'A three-bot autonomous system built on the Hermes Agent framework for AI monitoring, personal scheduling, and media management through Telegram.',
  'Sistem autonomous tiga bot berbasis Hermes Agent untuk monitoring AI, personal scheduling, dan manajemen media melalui Telegram.',
  'Hermes Multi-Bot System consists of three autonomous bots: AI Monitor Bot for automated AI news aggregation, Personal Scheduler Bot for interactive task management with voice support, and Video Downloader Bot for media downloading. Built on Python and Hermes Agent framework with Telegram integration.',
  'Hermes Multi-Bot System terdiri dari tiga bot autonomous: AI Monitor Bot untuk agregasi berita AI otomatis, Personal Scheduler Bot untuk manajemen task interaktif dengan dukungan voice, dan Video Downloader Bot untuk download media. Dibangun dengan Python dan framework Hermes Agent dengan integrasi Telegram.',
  'open-source', 'backend',
  '["Python 3.11+", "Hermes Agent", "Telegram Bot", "Speech-to-text", "yt-dlp", "FFmpeg", "Cron", "JSON"]'::jsonb,
  '["https://images.unsplash.com/photo-1611606063065-ee79de6e1b9e?w=800", "https://images.unsplash.com/photo-1633419461173-8a1d579d6860?w=800", "https://images.unsplash.com/photo-1677442136019-21780ecad925?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/HERMES-PT.-ASISTEN-DMR',
  'https://github.com/KarmaSenzu/HERMES-PT.-ASISTEN-DMR',
  '2026-07', 'Ongoing', 'in-progress', true, 3,
  'Repetitive information monitoring, personal scheduling, and media tasks can require separate manual workflows.',
  'Monitoring informasi berulang, personal scheduling, dan task media dapat memerlukan workflow manual terpisah.',
  'Built a modular multi-bot system where autonomous workflows can monitor information, manage schedules, process voice commands, and interact through Telegram.',
  'Membangun sistem multi-bot modular dimana workflow autonomous dapat memantau informasi, mengelola jadwal, memproses command voice, dan berinteraksi melalui Telegram.',
  'Two of the three listed bots are described as fully operational; the video downloader component is documented as needing troubleshooting.',
  'Dua dari tiga bot yang terdaftar beroperasi penuh; komponen video downloader didokumentasikan memerlukan troubleshooting.',
  '[{"title": {"en": "Multi-bot Coordination", "id": "Koordinasi Multi-bot"}, "description": {"en": "Three separate autonomous bots", "id": "Tiga bot autonomous terpisah"}, "solution": {"en": "Modular bot architecture with Hermes Agent framework", "id": "Arsitektur bot modular dengan framework Hermes Agent"}}, {"title": {"en": "Voice Processing", "id": "Pemrosesan Voice"}, "description": {"en": "Speech-to-text integration", "id": "Integrasi speech-to-text"}, "solution": {"en": "Voice message support with speech-to-text conversion", "id": "Dukungan pesan voice dengan konversi speech-to-text"}}, {"title": {"en": "Scheduled Automation", "id": "Otomasi Terjadwal"}, "description": {"en": "Time-based task execution", "id": "Eksekusi task berbasis waktu"}, "solution": {"en": "Cron-based scheduling for automated briefings and summaries", "id": "Penjadwalan berbasis cron untuk briefing dan ringkasan otomatis"}}]'::jsonb,
  '[{"icon": "🤖", "title": {"en": "AI Monitor Bot", "id": "Bot Monitor AI"}, "description": {"en": "Automated AI news aggregation 3x daily", "id": "Agregasi berita AI otomatis 3x sehari"}}, {"icon": "📅", "title": {"en": "Personal Scheduler", "id": "Scheduler Personal"}, "description": {"en": "Interactive task and habit management", "id": "Manajemen task dan habit interaktif"}}, {"icon": "🎙️", "title": {"en": "Voice Commands", "id": "Command Voice"}, "description": {"en": "Speech-to-text processing", "id": "Pemrosesan speech-to-text"}}, {"icon": "✈️", "title": {"en": "Telegram Integration", "id": "Integrasi Telegram"}, "description": {"en": "Two-way Telegram interaction", "id": "Interaksi Telegram dua arah"}}]'::jsonb
);

-- ================================================
-- PROJECT 4: DesignBaju NOXICK (Featured #4)
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'designbaju-noxick',
  'DesignBaju NOXICK',
  'DesignBaju NOXICK',
  'A web-based clothing design and marketplace project exploring product interfaces and modern web application development.',
  'Project marketplace dan desain pakaian berbasis web yang mengeksplorasi product interface dan pengembangan aplikasi web modern.',
  'DesignBaju NOXICK is a web-based platform for clothing design and marketplace functionality. The project explores modern web application development with focus on product interfaces and user experience.',
  'DesignBaju NOXICK adalah platform berbasis web untuk desain pakaian dan fungsionalitas marketplace. Project ini mengeksplorasi pengembangan aplikasi web modern dengan fokus pada product interface dan user experience.',
  'web-app', 'fullstack',
  '["React", "Node.js", "CSS", "JavaScript"]'::jsonb,
  '["https://images.unsplash.com/photo-1489987707026-74012b68c6ab?w=800", "https://images.unsplash.com/photo-1445205170235-cb8e0a89f9b8?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/DesignBaju-NOXICK-',
  'https://github.com/KarmaSenzu/DesignBaju-NOXICK-',
  '2025', null, 'completed', true, 4,
  'Clothing design and marketplace platforms need intuitive product interfaces and modern web development approaches.',
  'Platform desain pakaian dan marketplace memerlukan product interface yang intuitif dan pendekatan pengembangan web modern.',
  'Built a web-based platform exploring product interfaces and modern web application development for clothing design.',
  'Membangun platform berbasis web yang mengeksplorasi product interface dan pengembangan aplikasi web modern untuk desain pakaian.',
  'Created a functional clothing design and marketplace web application with modern interfaces.',
  'Membuat aplikasi web fungsional untuk desain pakaian dan marketplace dengan interface modern.',
  '[]'::jsonb,
  '[{"icon": "👕", "title": {"en": "Clothing Design", "id": "Desain Pakaian"}, "description": {"en": "Web-based design interface", "id": "Interface desain berbasis web"}}, {"icon": "🛒", "title": {"en": "Marketplace", "id": "Marketplace"}, "description": {"en": "Product listing and browsing", "id": "Listing dan browsing produk"}}]'::jsonb
);

-- ================================================
-- PROJECT 5: Golang Finance API (Featured #5)
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'golang-finance-api',
  'Personal Finance API',
  'API Manajemen Keuangan Pribadi',
  'A backend REST API for personal finance management built with Go, Gin, and MySQL.',
  'REST API backend untuk manajemen keuangan pribadi yang dibangun menggunakan Go, Gin, dan MySQL.',
  'A structured backend REST API for personal finance management with JWT authentication, transaction CRUD, financial analytics, multi-currency support, rate limiting, and clean architecture. Built with Go, Gin, MySQL, sqlc, and Docker deployment support.',
  'REST API backend terstruktur untuk manajemen keuangan pribadi dengan autentikasi JWT, CRUD transaksi, analitik keuangan, dukungan multi-currency, rate limiting, dan clean architecture. Dibangun dengan Go, Gin, MySQL, sqlc, dan dukungan deployment Docker.',
  'web-app', 'backend',
  '["Go 1.22", "Gin", "MySQL 8", "sqlc", "golang-migrate", "JWT", "bcrypt", "shopspring/decimal", "Docker", "Docker Compose"]'::jsonb,
  '["https://images.unsplash.com/photo-1554224155-672595e4fbfb?w=800", "https://images.unsplash.com/photo-1611974789855-b87e6b5cd0a8?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/Golang-Finance',
  'https://github.com/KarmaSenzu/Golang-Finance',
  '2025', null, 'completed', true, 5,
  'Personal finance applications require reliable transaction management, authentication, financial summaries, and structured backend architecture.',
  'Aplikasi keuangan pribadi memerlukan manajemen transaksi yang andal, autentikasi, ringkasan keuangan, dan arsitektur backend terstruktur.',
  'Built a REST API with JWT authentication, typed SQL through sqlc, migrations, transaction management, analytics endpoints, rate limiting, and Docker support.',
  'Membangun REST API dengan autentikasi JWT, SQL bertipe melalui sqlc, migrasi, manajemen transaksi, endpoint analitik, rate limiting, dan dukungan Docker.',
  'A structured backend API with a clear domain-oriented architecture and deployment tooling.',
  'REST API backend terstruktur dengan arsitektur domain-oriented yang jelas dan tooling deployment.',
  '[{"title": {"en": "Type-safe SQL", "id": "SQL Type-safe"}, "description": {"en": "Database query safety", "id": "Keamanan query database"}, "solution": {"en": "sqlc for generating type-safe Go code from SQL", "id": "sqlc untuk generate Go code type-safe dari SQL"}}, {"title": {"en": "Financial Accuracy", "id": "Akurasi Keuangan"}, "description": {"en": "Precise decimal calculations", "id": "Perhitungan decimal presisi"}, "solution": {"en": "shopspring/decimal for accurate financial calculations", "id": "shopspring/decimal untuk perhitungan keuangan akurat"}}]'::jsonb,
  '[{"icon": "🔐", "title": {"en": "JWT Authentication", "id": "Autentikasi JWT"}, "description": {"en": "Secure user authentication", "id": "Autentikasi pengguna aman"}}, {"icon": "💳", "title": {"en": "Transaction CRUD", "id": "CRUD Transaksi"}, "description": {"en": "Full transaction management", "id": "Manajemen transaksi lengkap"}}, {"icon": "📊", "title": {"en": "Financial Analytics", "id": "Analitik Keuangan"}, "description": {"en": "Monthly breakdown and summaries", "id": "Rincian bulanan dan ringkasan"}}, {"icon": "🌍", "title": {"en": "Multi-currency", "id": "Multi-currency"}, "description": {"en": "Multiple currency support", "id": "Dukungan berbagai mata uang"}}, {"icon": "⏱️", "title": {"en": "Rate Limiting", "id": "Rate Limiting"}, "description": {"en": "API abuse prevention", "id": "Pencegahan penyalahgunaan API"}}, {"icon": "🏛️", "title": {"en": "Clean Architecture", "id": "Clean Architecture"}, "description": {"en": "Handler → Service → Repository", "id": "Handler → Service → Repository"}}]'::jsonb
);

-- ================================================
-- PROJECT 6: API Security Testing (Non-featured)
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'api-security-testing',
  'API Endpoint Security Testing System',
  'Sistem Pengujian Keamanan Endpoint API',
  'A web-based API testing system for controlled endpoint testing, monitoring, rate-limit handling, and request analysis.',
  'Sistem testing API berbasis web untuk pengujian endpoint terkontrol, monitoring, penanganan rate-limit, dan analisis request.',
  'A security-oriented API testing system for authorized endpoint testing with request monitoring, rate-limit testing, configurable request delays, and JSON export capabilities. Designed for controlled security assessment only.',
  'Sistem testing API berorientasi keamanan untuk pengujian endpoint yang diotorisasi dengan monitoring request, testing rate-limit, delay request yang dapat dikonfigurasi, dan kemampuan export JSON. Dirancang untuk assessment keamanan terkontrol saja.',
  'web-app', 'fullstack',
  '["JavaScript", "Node.js", "HTML", "CSS"]'::jsonb,
  '["https://images.unsplash.com/photo-1550751826-4c9d9f9f1b93?w=800"]'::jsonb,
  null, null,
  '2025', null, 'completed', false, 6,
  'API development requires thorough security testing for endpoint vulnerabilities and rate-limit behavior.',
  'Pengembangan API memerlukan testing keamanan menyeluruh untuk kerentanan endpoint dan perilaku rate-limit.',
  'Built a controlled API testing system with monitoring, rate-limit handling, and request analysis capabilities.',
  'Membangun sistem testing API terkontrol dengan monitoring, penanganan rate-limit, dan kemampuan analisis request.',
  'Created a security testing tool for authorized API endpoint assessment and monitoring.',
  'Membuat tool testing keamanan untuk assessment dan monitoring endpoint API yang diotorisasi.',
  '[]'::jsonb,
  '[{"icon": "🧪", "title": {"en": "Endpoint Testing", "id": "Testing Endpoint"}, "description": {"en": "API endpoint testing", "id": "Testing endpoint API"}}, {"icon": "📊", "title": {"en": "Request Monitoring", "id": "Monitoring Request"}, "description": {"en": "Track and analyze requests", "id": "Track dan analisis request"}}, {"icon": "⏱️", "title": {"en": "Rate-limit Testing", "id": "Testing Rate-limit"}, "description": {"en": "Test rate-limit behavior", "id": "Test perilaku rate-limit"}}, {"icon": "📤", "title": {"en": "JSON Export", "id": "Export JSON"}, "description": {"en": "Export test results", "id": "Export hasil test"}}]'::jsonb
);

-- ================================================
-- PART 5: Projects 7-13 (Remaining projects)
-- ================================================

-- ================================================
-- PROJECT 7: Library Management System
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'library-management-system',
  'Library Management System',
  'Sistem Informasi Perpustakaan Berbasis Web',
  'A web-based library management system built with CodeIgniter 4 for managing books, members, and borrowing/return transactions.',
  'Sistem informasi perpustakaan berbasis web menggunakan CodeIgniter 4 untuk mengelola buku, anggota, serta transaksi peminjaman dan pengembalian.',
  'A comprehensive library management system with book management, member registration, borrowing/return tracking, and OTP verification. Built with CodeIgniter 4, PHP, MySQL, and Bootstrap for a user-friendly interface.',
  'Sistem manajemen perpustakaan komprehensif dengan manajemen buku, registrasi anggota, tracking peminjaman/pengembalian, dan verifikasi OTP. Dibangun dengan CodeIgniter 4, PHP, MySQL, dan Bootstrap untuk interface yang user-friendly.',
  'web-app', 'fullstack',
  '["CodeIgniter 4", "PHP", "MySQL", "Bootstrap"]'::jsonb,
  '["https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800", "https://images.unsplash.com/photo-1481627834876-b7833e8f555d?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/CI4-Perpuspus-2',
  'https://github.com/KarmaSenzu/CI4-Perpuspus-2',
  '2024', null, 'completed', false, 7,
  'Library operations require efficient book management, member tracking, and borrowing transaction records.',
  'Operasional perpustakaan memerlukan manajemen buku yang efisien, tracking anggota, dan catatan transaksi peminjaman.',
  'Built a web-based system with book CRUD, member management, OTP verification, and transaction tracking.',
  'Membangun sistem berbasis web dengan CRUD buku, manajemen anggota, verifikasi OTP, dan tracking transaksi.',
  'A functional library management system with user-friendly interface and complete borrowing workflow.',
  'Sistem manajemen perpustakaan fungsional dengan interface user-friendly dan workflow peminjaman lengkap.',
  '[]'::jsonb,
  '[{"icon": "📚", "title": {"en": "Book Management", "id": "Manajemen Buku"}, "description": {"en": "Add, edit, delete, search books", "id": "Tambah, edit, hapus, cari buku"}}, {"icon": "👤", "title": {"en": "Member System", "id": "Sistem Anggota"}, "description": {"en": "Registration and authentication", "id": "Registrasi dan autentikasi"}}, {"icon": "📋", "title": {"en": "Transaction Tracking", "id": "Tracking Transaksi"}, "description": {"en": "Borrowing and return records", "id": "Catatan peminjaman dan pengembalian"}}, {"icon": "🔐", "title": {"en": "OTP Verification", "id": "Verifikasi OTP"}, "description": {"en": "Registration verification", "id": "Verifikasi registrasi"}}]'::jsonb
);

-- ================================================
-- PROJECT 8: Restaurant POS
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'restaurant-pos',
  'Restaurant POS & Management System',
  'Sistem Kasir & Manajemen Restoran',
  'A restaurant point-of-sale and management application with separate manager, cashier, and administrator access levels.',
  'Aplikasi kasir dan manajemen restoran dengan hak akses terpisah untuk manager, kasir, dan admin.',
  'A comprehensive restaurant POS system with role-based access control (manager, cashier, admin), sales reporting, product management, employee monitoring, and receipt printing. Built with Laravel, PHP, Bootstrap, and jQuery.',
  'Sistem POS restoran komprehensif dengan kontrol akses berbasis role (manager, kasir, admin), laporan penjualan, manajemen produk, monitoring karyawan, dan cetak struk. Dibangun dengan Laravel, PHP, Bootstrap, dan jQuery.',
  'web-app', 'fullstack',
  '["HTML", "Bootstrap", "Laravel", "PHP", "JavaScript", "jQuery"]'::jsonb,
  '["https://images.unsplash.com/photo-1517248135467-4c29ed7009aa?w=800", "https://images.unsplash.com/photo-1559326125-432f25f2bd9c?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/Kasir-Conzy',
  'https://github.com/KarmaSenzu/Kasir-Conzy',
  '2024', null, 'completed', false, 8,
  'Restaurant operations require distinct access levels for managers, cashiers, and administrators with separate functionality.',
  'Operasional restoran memerlukan tingkat akses yang berbeda untuk manager, kasir, dan admin dengan fungsionalitas terpisah.',
  'Built a POS system with role-based access control, sales reporting, product management, and employee monitoring.',
  'Membangun sistem POS dengan kontrol akses berbasis role, laporan penjualan, manajemen produk, dan monitoring karyawan.',
  'A functional restaurant POS with complete sales workflow and role-separated features.',
  'Sistem POS restoran fungsional dengan workflow penjualan lengkap dan fitur terpisah per role.',
  '[]'::jsonb,
  '[{"icon": "👨‍💼", "title": {"en": "Manager Dashboard", "id": "Dashboard Manager"}, "description": {"en": "Sales reports and product management", "id": "Laporan penjualan dan manajemen produk"}}, {"icon": "💵", "title": {"en": "Cashier System", "id": "Sistem Kasir"}, "description": {"en": "Sales transactions and receipt printing", "id": "Transaksi penjualan dan cetak struk"}}, {"icon": "🔧", "title": {"en": "Admin Control", "id": "Kontrol Admin"}, "description": {"en": "Employee account management", "id": "Manajemen akun karyawan"}}, {"icon": "📊", "title": {"en": "Sales Reports", "id": "Laporan Penjualan"}, "description": {"en": "Daily, monthly, overall reports", "id": "Laporan harian, bulanan, keseluruhan"}}]'::jsonb
);

-- ================================================
-- PROJECT 9: Movie Recommendation
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'movie-recommendation',
  'Movie Search & Recommendation',
  'Pencarian & Rekomendasi Film',
  'A Streamlit-based movie search and recommendation application supporting keyword, genre, director, actor, and voice-based search.',
  'Aplikasi pencarian dan rekomendasi film berbasis Streamlit dengan dukungan pencarian keyword, genre, sutradara, aktor, dan voice.',
  'A Python-based movie application with multiple search methods including voice input, genre filtering, and recommendation features. Built with Streamlit, Pandas, and NumPy for data processing.',
  'Aplikasi film berbasis Python dengan berbagai metode pencarian termasuk input voice, filtering genre, dan fitur rekomendasi. Dibangun dengan Streamlit, Pandas, dan NumPy untuk pemrosesan data.',
  'web-app', 'fullstack',
  '["Python", "Streamlit", "Pandas", "NumPy"]'::jsonb,
  '["https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/Rekomendasi-Film',
  'https://github.com/KarmaSenzu/Rekomendasi-Film',
  '2024', null, 'completed', false, 9,
  'Movie discovery requires flexible search options and recommendation capabilities.',
  'Penemuan film memerlukan opsi pencarian fleksibel dan kemampuan rekomendasi.',
  'Built a Streamlit application with multiple search methods and voice input support.',
  'Membangun aplikasi Streamlit dengan berbagai metode pencarian dan dukungan input voice.',
  'A functional movie search and recommendation app with voice input capability.',
  'Aplikasi pencarian dan rekomendasi film fungsional dengan kemampuan input voice.',
  '[]'::jsonb,
  '[{"icon": "🔍", "title": {"en": "Multi-search", "id": "Multi-pencarian"}, "description": {"en": "Keyword, genre, director, actor search", "id": "Pencarian keyword, genre, sutradara, aktor"}}, {"icon": "🎯", "title": {"en": "Recommendations", "id": "Rekomendasi"}, "description": {"en": "Movie recommendation engine", "id": "Engine rekomendasi film"}}, {"icon": "🎤", "title": {"en": "Voice Search", "id": "Pencarian Voice"}, "description": {"en": "Voice-based input", "id": "Input berbasis voice"}}]'::jsonb
);

-- ================================================
-- PROJECT 10: Flutter Library Application
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'flutter-library-app',
  'Flutter Library Application',
  'Aplikasi Perpustakaan Flutter',
  'A Flutter-based library application project for exploring mobile application development and library workflows.',
  'Project aplikasi perpustakaan berbasis Flutter untuk mengeksplorasi pengembangan aplikasi mobile dan workflow perpustakaan.',
  'A mobile library application built with Flutter, exploring mobile development patterns and library management workflows on mobile platforms.',
  'Aplikasi perpustakaan mobile yang dibangun dengan Flutter, mengeksplorasi pola pengembangan mobile dan workflow manajemen perpustakaan di platform mobile.',
  'mobile', 'fullstack',
  '["Flutter", "Dart"]'::jsonb,
  '["https://images.unsplash.com/photo-1512941937669-90e711e7a7e6?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/Project-Aplikasi_Perpustakaan-fluter',
  'https://github.com/KarmaSenzu/Project-Aplikasi_Perpustakaan-fluter',
  '2024', null, 'completed', false, 10,
  'Library management on mobile platforms requires native mobile development approaches.',
  'Manajemen perpustakaan di platform mobile memerlukan pendekatan pengembangan mobile native.',
  'Built a Flutter mobile application exploring library workflows on mobile.',
  'Membangun aplikasi mobile Flutter yang mengeksplorasi workflow perpustakaan di mobile.',
  'A mobile library application demonstrating Flutter development capabilities.',
  'Aplikasi perpustakaan mobile yang menunjukkan kemampuan pengembangan Flutter.',
  '[]'::jsonb,
  '[{"icon": "📱", "title": {"en": "Mobile App", "id": "Aplikasi Mobile"}, "description": {"en": "Flutter-based mobile application", "id": "Aplikasi mobile berbasis Flutter"}}, {"icon": "📚", "title": {"en": "Library Workflow", "id": "Workflow Perpustakaan"}, "description": {"en": "Library management on mobile", "id": "Manajemen perpustakaan di mobile"}}]'::jsonb
);

-- ================================================
-- PROJECT 11: Java POS
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'java-pos',
  'Java Point-of-Sale Application',
  'Aplikasi Kasir Java',
  'A Java-based cashier application created to explore desktop application development and point-of-sale workflows.',
  'Aplikasi kasir berbasis Java yang dibuat untuk mengeksplorasi pengembangan aplikasi desktop dan workflow point-of-sale.',
  'A desktop POS application built with Java, exploring desktop application development patterns and cashier workflows.',
  'Aplikasi POS desktop yang dibangun dengan Java, mengeksplorasi pola pengembangan aplikasi desktop dan workflow kasir.',
  'design', 'fullstack',
  '["Java"]'::jsonb,
  '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/Program-Aplikasi-Kasir-Java',
  'https://github.com/KarmaSenzu/Program-Aplikasi-Kasir-Java',
  '2023', null, 'completed', false, 11,
  'Desktop application development requires understanding of native UI patterns and POS workflows.',
  'Pengembangan aplikasi desktop memerlukan pemahaman pola UI native dan workflow POS.',
  'Built a Java desktop application exploring POS workflows and desktop development.',
  'Membangun aplikasi desktop Java yang mengeksplorasi workflow POS dan pengembangan desktop.',
  'A functional desktop POS application demonstrating Java desktop development.',
  'Aplikasi POS desktop fungsional yang menunjukkan pengembangan desktop Java.',
  '[]'::jsonb,
  '[{"icon": "☕", "title": {"en": "Java Desktop", "id": "Desktop Java"}, "description": {"en": "Native desktop application", "id": "Aplikasi desktop native"}}, {"icon": "💵", "title": {"en": "POS Workflow", "id": "Workflow POS"}, "description": {"en": "Cashier operations", "id": "Operasional kasir"}}]'::jsonb
);

-- ================================================
-- PROJECT 12: Train Ticketing
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'train-ticketing',
  'Train Ticketing Application',
  'Aplikasi Pemesanan Tiket Kereta',
  'A Python train ticket booking project.',
  'Project pemesanan tiket kereta berbasis Python.',
  'A Python-based train ticket booking application exploring booking workflows and Python application development.',
  'Aplikasi pemesanan tiket kereta berbasis Python yang mengeksplorasi workflow booking dan pengembangan aplikasi Python.',
  'design', 'fullstack',
  '["Python"]'::jsonb,
  '["https://images.unsplash.com/photo-1517248135467-4c29ed7009aa?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/Tiket-kreta-py',
  'https://github.com/KarmaSenzu/Tiket-kreta-py',
  '2023', null, 'completed', false, 12,
  'Ticket booking systems require clear booking workflows and data management.',
  'Sistem pemesanan tiket memerlukan workflow booking yang jelas dan manajemen data.',
  'Built a Python application for train ticket booking exploring booking workflows.',
  'Membangun aplikasi Python untuk pemesanan tiket kereta yang mengeksplorasi workflow booking.',
  'A functional ticket booking application demonstrating Python development.',
  'Aplikasi pemesanan tiket fungsional yang menunjukkan pengembangan Python.',
  '[]'::jsonb,
  '[{"icon": "🚂", "title": {"en": "Ticket Booking", "id": "Pemesanan Tiket"}, "description": {"en": "Train ticket reservation", "id": "Reservasi tiket kereta"}}, {"icon": "🐍", "title": {"en": "Python App", "id": "Aplikasi Python"}, "description": {"en": "Python-based development", "id": "Pengembangan berbasis Python"}}]'::jsonb
);

-- ================================================
-- PROJECT 13: Indonesia Nature Gallery
-- ================================================
INSERT INTO projects (
  slug, title_en, title_id, description_en, description_id,
  about_en, about_id, category, role, tech_stack, images,
  live_url, repo_url, date, duration, status, featured, sort_order,
  case_study_problem_en, case_study_problem_id,
  case_study_solution_en, case_study_solution_id,
  case_study_result_en, case_study_result_id,
  challenges, features
) VALUES (
  'indonesia-nature-gallery',
  'Indonesia Nature Gallery',
  'Galeri Alam Indonesia',
  'A responsive web gallery project showcasing Indonesian natural landscapes.',
  'Project galeri web responsif yang menampilkan lanskap alam Indonesia.',
  'A responsive web gallery built with HTML and CSS, showcasing Indonesian natural landscapes and exploring frontend development fundamentals.',
  'Galeri web responsif yang dibangun dengan HTML dan CSS, menampilkan lanskap alam Indonesia dan mengeksplorasi dasar pengembangan frontend.',
  'web-app', 'frontend',
  '["HTML", "CSS"]'::jsonb,
  '["https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=800", "https://images.unsplash.com/photo-1518544801976-3e15999f755e?w=800"]'::jsonb,
  'https://github.com/KarmaSenzu/Web-GaleriAlam',
  'https://github.com/KarmaSenzu/Web-GaleriAlam',
  '2023', null, 'completed', false, 13,
  'Showcasing Indonesian natural beauty requires a clean, responsive gallery interface.',
  'Menampilkan keindahan alam Indonesia memerlukan interface galeri yang bersih dan responsif.',
  'Built a responsive HTML/CSS gallery showcasing Indonesian landscapes.',
  'Membangun galeri HTML/CSS responsif yang menampilkan lanskap Indonesia.',
  'A clean, responsive gallery demonstrating frontend fundamentals.',
  'Galeri responsif yang bersih, menunjukkan dasar frontend.',
  '[]'::jsonb,
  '[{"icon": "🏞️", "title": {"en": "Nature Gallery", "id": "Galeri Alam"}, "description": {"en": "Indonesian landscape showcase", "id": "Tampilan lanskap Indonesia"}}, {"icon": "📱", "title": {"en": "Responsive Design", "id": "Desain Responsif"}, "description": {"en": "Mobile-friendly layout", "id": "Layout ramah mobile"}}]'::jsonb
);

-- ================================================
-- END OF DATA INSERT
-- ================================================
-- Summary:
-- - 62 Skills inserted
-- - 2 Experiences inserted (1 education + 1 freelance)
-- - 4 Settings inserted (hero_images, hero_headline, hero_description, about_content)
-- - 13 Projects inserted (5 featured + 8 non-featured)
-- - 0 Certificates (per master data - don't fabricate)
-- - 0 Hobbies (per master data - need user input)
--
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Login to CMS Dashboard
-- 3. Replace dummy images with real Cloudinary uploads
-- 4. Add certificates and hobbies when available
-- ================================================
