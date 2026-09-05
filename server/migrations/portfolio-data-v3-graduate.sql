-- ================================================
-- PORTFOLIO DAMAR - V3 GRADUATE DATA
-- ================================================
-- Source: Damar_Portfolio_Master_Data_v3_Graduate.md
-- Date: 2026-09-04
-- 
-- NEW in v3:
-- - Updated experiences (graduate + freelance period + achievements)
-- - 6 verified certificates from CV
-- - Personal about content
-- - Timeline
-- - 8 blog post drafts
--
-- NOTE: Projects data sama seperti v1.
-- Run portfolio-data-insert.sql untuk projects & skills
-- ================================================

-- ================================================
-- 1. CLEAR EXISTING DATA (untuk clean insert)
-- ================================================

DELETE FROM experiences;
DELETE FROM certificates;
DELETE FROM blog_posts;
DELETE FROM settings WHERE setting_key IN ('about_content', 'about_personal', 'timeline', 'hero_headline', 'hero_description');

-- ================================================
-- 2. EXPERIENCES (5 entries - Updated v3)
-- ================================================

-- Experience 1: Freelance IT / Full Stack Developer (CURRENT)
INSERT INTO experiences (
  title_en, title_id, company,
  period_en, period_id,
  description_en, description_id,
  is_current, is_education, sort_order
) VALUES (
  'Freelance IT / Full Stack Developer',
  'Freelance IT / Full Stack Developer',
  'Independent',
  'January 2022 — Present',
  'Januari 2022 — Sekarang',
  'Develop web applications and software based on user requirements, ranging from simple websites to full-stack applications and backend APIs. Independently deploy applications on Linux VPS environments, including Nginx reverse proxy configuration, process management with PM2, Docker-based containerization, and service exposure through Cloudflare Tunnel. Also provide hardware/software troubleshooting and hosting configuration to keep applications stable online.',
  'Mengembangkan berbagai aplikasi web dan software sesuai kebutuhan pengguna, mulai dari website sederhana hingga aplikasi full-stack dan backend API. Melakukan deployment aplikasi secara mandiri pada VPS Linux, termasuk konfigurasi Nginx sebagai reverse proxy, pengelolaan proses menggunakan PM2, containerization menggunakan Docker, serta publikasi layanan menggunakan Cloudflare Tunnel. Menangani troubleshooting hardware dan software serta konfigurasi hosting agar aplikasi dapat berjalan stabil secara online.',
  true, false, 1
);

-- Experience 2: Education - Informatics Graduate (CURRENT)
INSERT INTO experiences (
  title_en, title_id, company,
  period_en, period_id,
  description_en, description_id,
  is_current, is_education, sort_order
) VALUES (
  'Bachelor of Informatics (Graduate)',
  'Sarjana Teknik Informatika (Lulusan)',
  'Universitas Bina Sarana Informatika',
  '2022 — 2026',
  '2022 — 2026',
  'Informatics graduate developing practical skills in software engineering, web development, backend development, databases, AI, infrastructure, and application deployment. GPA: 3.84',
  'Lulusan Teknik Informatika dengan pengembangan kompetensi pada software engineering, web development, backend development, database, AI, infrastructure, dan deployment aplikasi. IPK: 3.84',
  true, true, 2
);

-- Experience 3: HIMAIF - Social Affairs Staff
INSERT INTO experiences (
  title_en, title_id, company,
  period_en, period_id,
  description_en, description_id,
  is_current, is_education, sort_order
) VALUES (
  'Social Affairs Staff (Sie. Sosial Masyarakat)',
  'Sie. Sosial Masyarakat',
  'Himpunan Lulusan Informatika UBSI (HIMAIF)',
  'January — December 2024',
  'Januari — Desember 2024',
  'Served as Social Affairs staff in the Himpunan Lulusan Informatika UBSI organization during the January–December 2024 management period. Received a Piagam Penghargaan (appreciation award) dated March 12, 2025.',
  'Berkontribusi sebagai Sie. Sosial Masyarakat dalam kepengurusan Himpunan Lulusan Informatika UBSI periode Januari–Desember 2024. Menerima Piagam Penghargaan tertanggal 12 Maret 2025.',
  false, false, 3
);

-- Experience 4: Speaker - HIMAIF Goes to Class
INSERT INTO experiences (
  title_en, title_id, company,
  period_en, period_id,
  description_en, description_id,
  is_current, is_education, sort_order
) VALUES (
  'Speaker — Introduction to Simple Website Development',
  'Pembicara — Pengenalan Website Sederhana',
  'HIMAIF Goes to Class @ SMA Taman Madya 1 Jakarta',
  'August 27–28, 2024',
  '27–28 Agustus 2024',
  'Recognized as a speaker at HIMAIF Goes to Class, delivering an introduction to simple website development for high-school students at SMA Taman Madya 1 Jakarta. Received Certificate of Appreciation.',
  'Mendapatkan apresiasi sebagai pembicara dalam kegiatan HIMAIF Goes to Class dengan materi pengenalan website sederhana untuk siswa SMA di SMA Taman Madya 1 Jakarta. Menerima Sertifikat Apresiasi.',
  false, false, 4
);

-- Experience 5: Seminar Participant - UI/UX
INSERT INTO experiences (
  title_en, title_id, company,
  period_en, period_id,
  description_en, description_id,
  is_current, is_education, sort_order
) VALUES (
  'Participant — Fundamental of UI/UX Seminar',
  'Peserta — Seminar Fundamental UI/UX',
  'Universitas Bina Sarana Informatika',
  'November 29, 2022',
  '29 November 2022',
  'Participated in the "Fundamental of User Interface/User Experience" seminar as part of developing foundational knowledge in UI/UX. Speaker: Arya Saca, S.Kom.',
  'Mengikuti seminar "Fundamental of User Interface/User Experience" sebagai bagian dari pengembangan pemahaman dasar mengenai UI/UX. Pembicara: Arya Saca, S.Kom.',
  false, false, 5
);

-- ================================================
-- 3. CERTIFICATES (6 entries - Verified from CV)
-- ================================================

INSERT INTO certificates (title_en, title_id, issuer, date, credential_id, credential_url, sort_order) VALUES
('LSP BNSP Analisa Program Certificate',
 'Sertifikat LSP BNSP Analisa Program',
 'LSP / BNSP',
 NULL, NULL, NULL, 1),

('LSP Python Certificate',
 'Sertifikat LSP Python',
 'OpenEDG Python Institute',
 NULL, NULL, NULL, 2),

('Fundamental Python',
 'Fundamental Python',
 'Coding Studio',
 NULL, NULL, NULL, 3),

('Python Intermediate',
 'Python Intermediate',
 'Coding Studio',
 NULL, NULL, NULL, 4),

('Fundamental Web Development with HTML & CSS',
 'Fundamental Membuat Web dengan HTML dan CSS',
 'Dicoding',
 NULL, NULL, NULL, 5),

('Website Development with Laravel 9',
 'Website dengan Laravel 9',
 'Coding Studio',
 NULL, NULL, NULL, 6);

-- ================================================
-- 4. SETTINGS - UPDATED CONTENT
-- ================================================

-- Hero Headline (updated)
INSERT INTO settings (setting_key, setting_value) VALUES
('hero_headline', '{
  "en": "Hi, I am Damar. I build scalable software & infrastructure.",
  "id": "Hai, saya Damar. Saya membangun software dan infrastruktur yang scalable."
}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Hero Description
INSERT INTO settings (setting_key, setting_value) VALUES
('hero_description', '{
  "en": "Freelance IT Full Stack Developer focused on web development, backend development, and server-based application deployment.",
  "id": "Freelance IT Full Stack Developer dengan fokus pada pengembangan website, backend development, dan deployment aplikasi berbasis server."
}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- About Content (Personal Version - v3)
INSERT INTO settings (setting_key, setting_value) VALUES
('about_content', '{
  "en": "I''m Damar Fikrie, an Informatics graduate and freelance IT Full Stack Developer who enjoys turning ideas into working software.\n\nMy journey in technology started from learning the fundamentals of programming and web development, then gradually expanded into full-stack applications, backend APIs, databases, server deployment, infrastructure, AI applications, and automation.\n\nI enjoy working across different layers of a system. On the application side, I work with technologies such as React, Next.js, Go, PHP, Laravel, CodeIgniter, Python, and Flutter. On the infrastructure side, I work with Linux VPS, Nginx, Docker, SSH, SFTP, PM2, and Cloudflare Tunnel.\n\nMy recent projects reflect this broader direction. I build systems such as Dmr x AI, a self-hosted multi-model AI platform; ServerMonitoring, an infrastructure monitoring and management platform; and Hermes, a multi-bot AI automation system.\n\nI also value experiences outside pure coding. In 2024, I participated in HIMAIF activities as a Social Affairs staff member and received an appreciation award. I was also a speaker at the \"HIMAIF Goes to Class\" activity, delivering introductory website material for high-school students.\n\nToday, I continue learning and building with a particular interest in backend engineering, AI systems, infrastructure, DevOps, automation, and self-hosted technology.",
  "id": "Saya Damar Fikrie, lulusan Informatika dan IT Full Stack Developer freelance yang senang mengubah ide menjadi software yang dapat digunakan.\n\nPerjalanan saya di dunia teknologi dimulai dari mempelajari dasar-dasar programming dan web development, kemudian berkembang ke full-stack application, backend API, database, server deployment, infrastructure, AI application, hingga automation.\n\nSaya menikmati proses pengembangan dari berbagai sisi sistem. Pada sisi aplikasi, saya menggunakan teknologi seperti React, Next.js, Go, PHP, Laravel, CodeIgniter, Python, dan Flutter. Pada sisi infrastructure, saya terbiasa bereksperimen dengan Linux VPS, Nginx, Docker, SSH, SFTP, PM2, dan Cloudflare Tunnel.\n\nProject-project terbaru saya menunjukkan arah tersebut. Saya membangun Dmr x AI sebagai platform AI multi-model self-hosted, ServerMonitoring sebagai platform monitoring dan manajemen infrastructure, serta Hermes sebagai sistem automation AI berbasis multi-bot.\n\nSaya juga menghargai pengalaman di luar aktivitas coding. Pada tahun 2024, saya aktif dalam kegiatan HIMAIF sebagai Sie. Sosial Masyarakat dan mendapatkan piagam penghargaan. Saya juga menjadi pembicara dalam kegiatan \"HIMAIF Goes to Class\" dengan materi pengenalan website sederhana untuk siswa SMA.\n\nSaat ini saya terus belajar dan membangun project dengan ketertarikan yang semakin kuat pada backend engineering, AI systems, infrastructure, DevOps, automation, dan self-hosted technology."
}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Timeline (NEW - v3)
INSERT INTO settings (setting_key, setting_value) VALUES
('timeline', '[
  {"year": "2022", "title": {"en": "Started Informatics Education", "id": "Mulai Pendidikan Informatika"}, "description": {"en": "Began Informatics education and early programming and web-development learning.", "id": "Memulai pendidikan Informatika dan pembelajaran dasar programming serta web development."}},
  {"year": "2022", "title": {"en": "UI/UX Seminar", "id": "Seminar UI/UX"}, "description": {"en": "Participated in Fundamental of User Interface/User Experience seminar.", "id": "Mengikuti seminar Fundamental of User Interface/User Experience."}},
  {"year": "2022—Present", "title": {"en": "Freelance IT / Full Stack Developer", "id": "Freelance IT / Full Stack Developer"}, "description": {"en": "Started freelance development journey.", "id": "Memulai perjalanan development freelance."}},
  {"year": "2024", "title": {"en": "HIMAIF Social Affairs", "id": "Sie. Sosial Masyarakat HIMAIF"}, "description": {"en": "Served as Social Affairs staff in Himpunan Lulusan Informatika UBSI.", "id": "Berkontribusi sebagai Sie. Sosial Masyarakat di Himpunan Lulusan Informatika UBSI."}},
  {"year": "2024", "title": {"en": "Speaker at HIMAIF Goes to Class", "id": "Pembicara HIMAIF Goes to Class"}, "description": {"en": "Delivered introductory website material for high-school students.", "id": "Menyampaikan materi pengenalan website untuk siswa SMA."}},
  {"year": "2025", "title": {"en": "Appreciation Award", "id": "Piagam Penghargaan"}, "description": {"en": "Received recognition from Universitas Bina Sarana Informatika.", "id": "Menerima penghargaan dari Universitas Bina Sarana Informatika."}},
  {"year": "2026", "title": {"en": "Informatics Graduate", "id": "Lulusan Informatika"}, "description": {"en": "Graduated and continuing development across AI, infrastructure, backend, and automation.", "id": "Lulus dan melanjutkan pengembangan di bidang AI, infrastructure, backend, dan automation."}}
]'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- ================================================
-- 5. BLOG POSTS (8 entries - v3 drafts)
-- ================================================

-- Blog Post 1: My Journey
INSERT INTO blog_posts (
  slug, title_en, title_id, excerpt_en, excerpt_id,
  content_en, content_id, category, tags, image, read_time, published
) VALUES (
  'my-journey-from-web-development-to-ai-and-infrastructure',
  'From Web Development to AI & Infrastructure: My Developer Journey',
  'Dari Web Development ke AI & Infrastructure: Perjalanan Saya sebagai Developer',
  'A personal look at how my development journey evolved from learning web fundamentals into full-stack applications, backend systems, AI platforms, and infrastructure engineering.',
  'Cerita perjalanan pengembangan saya dari mempelajari dasar web development hingga membangun aplikasi full-stack, backend systems, platform AI, dan infrastructure.',
  '# My Developer Journey

## Where It Started

My journey in technology started from learning the fundamentals of programming and web development. Like many developers, I began with HTML, CSS, and basic programming concepts.

## Expanding Into Full-Stack

From there, I gradually expanded into full-stack applications using PHP with Laravel and CodeIgniter, then React for modern frontend development, and Go for backend API development.

## Backend Engineering

Backend development became a major focus — REST APIs, JWT authentication, database design, and clean architecture principles. Building the Personal Finance API with Go taught me a lot about structured backend development.

## Linux & Infrastructure

Moving beyond local development, I started working with Linux VPS environments — Nginx reverse proxies, PM2 process management, Docker containerization, and Cloudflare Tunnel for secure service exposure.

## AI Applications

My interest in AI led to building Dmr x AI, a self-hosted multi-model AI platform combining multiple AI providers with document analysis, web search, and visualization capabilities.

## Infrastructure Monitoring

ServerMonitoring represents the evolution from simple monitoring into a comprehensive infrastructure management platform with SSH management, container control, and AI integration.

## The Story Continues

Today, I continue learning and building with a particular interest in backend engineering, AI systems, infrastructure, DevOps, automation, and self-hosted technology.',
  '# Perjalanan Developer Saya

## Dimana Semua Dimulai

Perjalanan saya di dunia teknologi dimulai dari mempelajari dasar-dasar programming dan web development. Seperti banyak developer lain, saya memulai dengan HTML, CSS, dan konsep dasar programming.

## Berkembang ke Full-Stack

Dari sana, saya secara bertahap berkembang ke aplikasi full-stack menggunakan PHP dengan Laravel dan CodeIgniter, kemudian React untuk frontend modern, dan Go untuk backend API.

## Backend Engineering

Backend development menjadi fokus utama — REST API, autentikasi JWT, database design, dan prinsip clean architecture. Membangun Personal Finance API dengan Go mengajarkan banyak hal tentang pengembangan backend terstruktur.

## Linux & Infrastructure

Beralih dari local development, saya mulai bekerja dengan lingkungan Linux VPS — Nginx reverse proxy, manajemen proses PM2, containerization Docker, dan Cloudflare Tunnel.

## Aplikasi AI

Ketertarikan saya pada AI membawa saya membangun Dmr x AI, platform AI multi-model self-hosted yang menggabungkan berbagai provider AI dengan analisis dokumen, web search, dan visualisasi.

## Infrastructure Monitoring

ServerMonitoring merepresentasikan evolusi dari monitoring sederhana menjadi platform manajemen infrastructure komprehensif.

## Kisah Berlanjut

Saat ini, saya terus belajar dan membangun dengan ketertarikan khusus pada backend engineering, AI systems, infrastructure, DevOps, automation, dan self-hosted technology.',
  'tutorials',
  '["Career", "Full Stack", "Backend", "AI", "Infrastructure", "Learning"]'::jsonb,
  NULL, 8, true
);

-- Blog Post 2: Building Dmr x AI
INSERT INTO blog_posts (
  slug, title_en, title_id, excerpt_en, excerpt_id,
  content_en, content_id, category, tags, image, read_time, published
) VALUES (
  'building-a-self-hosted-multi-model-ai-platform',
  'Building a Self-Hosted Multi-Model AI Platform',
  'Membangun Platform AI Multi-Model Self-Hosted',
  'Why I built Dmr x AI to combine multiple AI models, document analysis, web search, visualization, and self-hosted deployment into one workspace.',
  'Alasan saya membangun Dmr x AI untuk menggabungkan berbagai model AI, analisis dokumen, web search, visualisasi, dan deployment self-hosted dalam satu workspace.',
  '# Building Dmr x AI

## Why Build Another AI Interface?

AI users often need to switch between different model providers, document tools, search engines, and visualization utilities. I wanted one workspace that combines all of these.

## Multi-Model Architecture

Dmr x AI routes requests through 9Router, allowing access to Claude, GPT, and Gemini models from a single interface with server-managed API keys.

## Document Intelligence

The platform supports Excel, PDF, DOCX, image, and text analysis. For large Excel workbooks, it extracts schema information, calculates numerical statistics, and samples data intelligently.

## Web Search with SearXNG

Local web search through SearXNG provides privacy-focused search capabilities without relying on external search APIs.

## Data Visualization

Interactive chart rendering with 8 chart types via Recharts, plus Mermaid diagram support for technical documentation.

## Docker-Based Deployment

Everything runs in isolated containers with Docker Compose, exposed securely through Cloudflare Tunnel.',
  '# Membangun Dmr x AI

## Kenapa Membangun Interface AI Lain?

Pengguna AI sering perlu beralih antara berbagai provider model, tool dokumen, search engine, dan utilitas visualisasi. Saya ingin satu workspace yang menggabungkan semuanya.

## Arsitektur Multi-Model

Dmr x AI melakukan routing request melalui 9Router, memungkinkan akses ke model Claude, GPT, dan Gemini dari satu interface dengan API key yang dikelola server.

## Document Intelligence

Platform mendukung analisis Excel, PDF, DOCX, gambar, dan teks. Untuk workbook Excel besar, sistem mengekstrak informasi schema dan melakukan sampling data secara cerdas.

## Web Search dengan SearXNG

Web search lokal melalui SearXNG memberikan kemampuan pencarian yang berfokus pada privasi.

## Visualisasi Data

Rendering chart interaktif dengan 8 jenis chart via Recharts, plus dukungan Mermaid diagram untuk dokumentasi teknis.

## Deployment Docker

Semuanya berjalan dalam container terisolasi dengan Docker Compose, diekspos secara aman melalui Cloudflare Tunnel.',
  'tips',
  '["AI", "Next.js", "Self-hosted", "Docker", "LLM", "SearXNG", "9Router"]'::jsonb,
  NULL, 6, true
);

-- Blog Post 3: From VPS Monitoring to Infrastructure Management
INSERT INTO blog_posts (
  slug, title_en, title_id, excerpt_en, excerpt_id,
  content_en, content_id, category, tags, image, read_time, published
) VALUES (
  'from-vps-monitoring-to-infrastructure-management',
  'From VPS Monitoring to Infrastructure Management',
  'Dari Monitoring VPS ke Platform Infrastructure Management',
  'How a simple server monitoring idea evolved into a broader infrastructure monitoring and management platform.',
  'Bagaimana ide sederhana untuk monitoring server berkembang menjadi platform monitoring dan manajemen infrastructure.',
  '# The Evolution of ServerMonitoring

## The Original Problem

Managing multiple servers normally requires switching between SSH terminals, monitoring dashboards, container tools, file managers, and other infrastructure utilities.

## Monitoring Server Resources

The project started as a VPS monitoring dashboard — CPU, memory, disk, and network metrics displayed in real-time.

## SSH-Based Remote Management

Agentless SSH-based remote monitoring and command execution eliminated the need to install agents on every server.

## Multi-Host Architecture

The system evolved to support server registries, enabling management of entire server fleets from one interface.

## Docker and Container Management

Docker fleet management allows monitoring and controlling containers across all connected servers.

## Web Terminal and SFTP

Interactive web terminal (PTY) and SFTP file manager provide full remote access without leaving the browser.

## RBAC and Security

JWT authentication, role-based access control, and safe command execution ensure infrastructure security.',
  '# Evolusi ServerMonitoring

## Masalah Awal

Mengelola multiple server biasanya memerlukan perpindahan antara terminal SSH, dashboard monitoring, container tools, file manager, dan utilitas infrastructure lainnya.

## Monitoring Resource Server

Project dimulai sebagai dashboard monitoring VPS — metrik CPU, memory, disk, dan network yang ditampilkan real-time.

## Manajemen Remote via SSH

Monitoring dan eksekusi command remote berbasis SSH tanpa agent menghilangkan kebutuhan instalasi agent di setiap server.

## Arsitektur Multi-Host

Sistem berevolusi mendukung server registry, memungkinkan manajemen seluruh fleet server dari satu interface.

## Manajemen Docker dan Container

Manajemen fleet Docker memungkinkan monitoring dan kontrol container di semua server terhubung.

## Web Terminal dan SFTP

Web terminal interaktif (PTY) dan SFTP file manager memberikan akses remote penuh tanpa meninggalkan browser.

## RBAC dan Keamanan

Autentikasi JWT, kontrol akses berbasis role, dan eksekusi command aman memastikan keamanan infrastructure.',
  'tutorials',
  '["Linux", "VPS", "Docker", "SSH", "DevOps", "Monitoring", "Go", "Infrastructure"]'::jsonb,
  NULL, 7, true
);

-- Blog Post 4: Building Autonomous Multi-Bot System
INSERT INTO blog_posts (
  slug, title_en, title_id, excerpt_en, excerpt_id,
  content_en, content_id, category, tags, image, read_time, published
) VALUES (
  'building-an-autonomous-multi-bot-ai-system',
  'Building an Autonomous Multi-Bot AI System',
  'Membangun Sistem AI Autonomous Multi-Bot',
  'Exploring autonomous workflows through AI monitoring, scheduling, voice commands, and Telegram-based automation.',
  'Eksperimen membangun workflow autonomous melalui AI monitoring, scheduling, voice command, dan automation berbasis Telegram.',
  '# Building Hermes Multi-Bot System

## Why Multiple Specialized Bots?

Repetitive information monitoring, personal scheduling, and media tasks can require separate manual workflows. I wanted autonomous bots to handle these.

## AI Monitor Bot

Automated AI news aggregation from multiple sources (OpenAI, Google AI, arXiv, HuggingFace, GitHub Trending), delivered to Telegram 3x daily.

## Personal Scheduler Bot

Interactive personal assistant for tasks, habits, and notes with natural language command parsing and voice message support.

## Voice Input

Speech-to-text processing allows voice commands through Telegram voice messages.

## Persistent Storage

Task and habit data persist between sessions using JSON storage.

## Telegram as the Interface

Two-way Telegram interaction makes the bots accessible from anywhere.',
  '# Membangun Hermes Multi-Bot System

## Kenapa Multiple Specialized Bots?

Monitoring informasi berulang, personal scheduling, dan task media dapat memerlukan workflow manual terpisah. Saya ingin bot autonomous yang menangani hal-hal ini.

## AI Monitor Bot

Agregasi berita AI otomatis dari berbagai sumber (OpenAI, Google AI, arXiv, HuggingFace, GitHub Trending), dikirim ke Telegram 3x sehari.

## Personal Scheduler Bot

Asisten personal interaktif untuk task, habit, dan notes dengan parsing command natural language dan dukungan pesan voice.

## Input Voice

Pemrosesan speech-to-text memungkinkan command voice melalui pesan voice Telegram.

## Persistent Storage

Data task dan habit persist antar session menggunakan storage JSON.

## Telegram sebagai Interface

Interaksi Telegram dua arah membuat bot dapat diakses dari mana saja.',
  'tips',
  '["AI", "Automation", "Python", "Telegram", "Agents", "Hermes"]'::jsonb,
  NULL, 5, true
);

-- Blog Post 5: First Speaker Experience
INSERT INTO blog_posts (
  slug, title_en, title_id, excerpt_en, excerpt_id,
  content_en, content_id, category, tags, image, read_time, published
) VALUES (
  'my-first-experience-as-a-website-development-speaker',
  'My First Experience Teaching Web Development',
  'Pengalaman Pertama Saya Mengajar Dasar Web Development',
  'What I learned from speaking at HIMAIF Goes to Class and introducing simple website development to high-school students.',
  'Pengalaman dan pelajaran yang saya dapatkan ketika menjadi pembicara HIMAIF Goes to Class dan memperkenalkan pembuatan website sederhana kepada siswa SMA.',
  '# My First Speaking Experience

## The Event

HIMAIF Goes to Class: Pengenalan Website Sederhana untuk SMA at SMA Taman Madya 1 Jakarta, August 27–28, 2024.

## Preparing the Material

Preparing introductory web development material for high-school students required thinking about how to explain technical concepts simply.

## Explaining to Beginners

Teaching HTML and CSS basics to students who had never written code before taught me a lot about communication.

## Communication Beyond Technical Knowledge

Being a speaker is not just about knowing the material — it is about making it accessible and engaging.

## What I Learned

Teaching changed my perspective as a developer. Explaining concepts to others deepens your own understanding.',
  '# Pengalaman Berbicara Pertama Saya

## Acara

HIMAIF Goes to Class: Pengenalan Website Sederhana untuk SMA di SMA Taman Madya 1 Jakarta, 27–28 Agustus 2024.

## Menyiapkan Materi

Menyiapkan materi pengantar web development untuk siswa SMA memerlukan pemikiran tentang cara menjelaskan konsep teknis secara sederhana.

## Menjelaskan ke Pemula

Mengajarkan dasar HTML dan CSS kepada siswa yang belum pernah menulis kode mengajarkan banyak hal tentang komunikasi.

## Komunikasi di Luar Pengetahuan Teknis

Menjadi pembicara bukan hanya tentang menguasai materi — tapi tentang membuatnya mudah dipahami dan menarik.

## Yang Saya Pelajari

Mengajar mengubah perspektif saya sebagai developer. Menjelaskan konsep kepada orang lain memperdalam pemahaman sendiri.',
  'thoughts',
  '["Teaching", "Web Development", "HTML", "CSS", "Community", "HIMAIF"]'::jsonb,
  NULL, 4, true
);

-- Blog Post 6: What I Learned from HIMAIF
INSERT INTO blog_posts (
  slug, title_en, title_id, excerpt_en, excerpt_id,
  content_en, content_id, category, tags, image, read_time, published
) VALUES (
  'what-i-learned-from-serving-in-himaif',
  'What I Learned from Serving in HIMAIF',
  'Pelajaran dari Pengalaman Berorganisasi di HIMAIF',
  'Lessons from serving as Social Affairs staff in Himpunan Lulusan Informatika UBSI during the 2024 management period.',
  'Pelajaran dari pengalaman menjadi Sie. Sosial Masyarakat di Himpunan Lulusan Informatika UBSI selama periode kepengurusan 2024.',
  '# Serving in HIMAIF

## My Role

I served as Sie. Sosial Masyarakat (Social Affairs staff) in Himpunan Lulusan Informatika UBSI during the January–December 2024 management period.

## The Experience

Organizational work is different from coding — it requires coordination, communication, and consistency over time.

## Recognition

I received a Piagam Penghargaan (appreciation award) dated March 12, 2025, for the 2024 management period.

## Lessons Learned

Technology is not only about writing code. It is also about communicating ideas, helping others, and solving practical problems together.',
  '# Berorganisasi di HIMAIF

## Peran Saya

Saya berkontribusi sebagai Sie. Sosial Masyarakat di Himpunan Lulusan Informatika UBSI selama periode kepengurusan Januari–Desember 2024.

## Pengalamannya

Kerja organisasi berbeda dengan coding — memerlukan koordinasi, komunikasi, dan konsistensi dari waktu ke waktu.

## Penghargaan

Saya menerima Piagam Penghargaan tertanggal 12 Maret 2025 untuk periode kepengurusan 2024.

## Pelajaran

Teknologi bukan hanya tentang menulis kode. Ini juga tentang menyampaikan ide, membantu orang lain, dan menyelesaikan masalah praktis bersama.',
  'thoughts',
  '["HIMAIF", "Organization", "Leadership", "Community", "Personal Growth"]'::jsonb,
  NULL, 4, true
);

-- Blog Post 7: Deploying on Linux VPS
INSERT INTO blog_posts (
  slug, title_en, title_id, excerpt_en, excerpt_id,
  content_en, content_id, category, tags, image, read_time, published
) VALUES (
  'what-i-learned-from-deploying-applications-on-linux-vps',
  'What I Learned from Deploying Applications on Linux VPS',
  'Pelajaran dari Deploy Aplikasi di Linux VPS',
  'Lessons from moving beyond local development and learning how applications behave in real server environments.',
  'Pelajaran ketika mulai berpindah dari local development menuju deployment aplikasi pada lingkungan server nyata.',
  '# Deploying on Linux VPS

## Local vs Server

Moving from local development to server deployment changes everything — security, performance, reliability, and monitoring become real concerns.

## Linux VPS Fundamentals

Learning Linux server administration, SSH access, user management, and file permissions.

## Nginx Reverse Proxy

Nginx as reverse proxy handles SSL termination and routes traffic to applications.

## PM2 Process Management

PM2 keeps Node.js applications running with automatic restarts and log management.

## Docker

Containerization with Docker provides consistent environments and easier deployment.

## Cloudflare Tunnel

Secure service exposure without opening ports directly to the internet.

## Troubleshooting

Real-world deployment teaches troubleshooting skills that local development never will.',
  '# Deploy di Linux VPS

## Local vs Server

Beralih dari local development ke server deployment mengubah segalanya — keamanan, performa, reliabilitas, dan monitoring menjadi perhatian nyata.

## Dasar Linux VPS

Mempelajari administrasi server Linux, akses SSH, manajemen user, dan permission file.

## Nginx Reverse Proxy

Nginx sebagai reverse proxy menangani SSL termination dan melakukan routing traffic ke aplikasi.

## Manajemen Proses PM2

PM2 menjaga aplikasi Node.js tetap berjalan dengan restart otomatis dan manajemen log.

## Docker

Containerization dengan Docker memberikan environment yang konsisten dan deployment lebih mudah.

## Cloudflare Tunnel

Eksposur layanan yang aman tanpa membuka port langsung ke internet.

## Troubleshooting

Deployment di dunia nyata mengajarkan skill troubleshooting yang tidak didapat dari local development.',
  'tutorials',
  '["Linux", "VPS", "Nginx", "PM2", "Docker", "Cloudflare Tunnel", "Deployment"]'::jsonb,
  NULL, 6, true
);

-- Blog Post 8: Building Foundation
INSERT INTO blog_posts (
  slug, title_en, title_id, excerpt_en, excerpt_id,
  content_en, content_id, category, tags, image, read_time, published
) VALUES (
  'building-my-foundation-in-programming-and-web-development',
  'Building My Foundation in Programming & Web Development',
  'Membangun Fondasi Programming dan Web Development',
  'My learning path through certifications and courses in Python, web development, and Laravel.',
  'Jalur pembelajaran saya melalui sertifikasi dan course di Python, web development, dan Laravel.',
  '# Building My Foundation

## Starting with Fundamentals

My foundation started with program analysis certification (LSP BNSP) and fundamental Python courses.

## Python Journey

From Fundamental Python to Python Intermediate at Coding Studio, plus LSP Python certification from OpenEDG Python Institute.

## Web Development Basics

Fundamental web development with HTML and CSS from Dicoding established the building blocks.

## Laravel Development

Website development with Laravel 9 expanded into full-stack PHP application development.

## Continuous Learning

Each certification and course built upon the previous one, creating a structured learning path.',
  '# Membangun Fondasi

## Mulai dari Dasar

Fondasi saya dimulai dengan sertifikasi analisa program (LSP BNSP) dan course Fundamental Python.

## Perjalanan Python

Dari Fundamental Python hingga Python Intermediate di Coding Studio, plus sertifikasi LSP Python dari OpenEDG Python Institute.

## Dasar Web Development

Fundamental web development dengan HTML dan CSS dari Dicoding membangun fondasi.

## Development Laravel

Website development dengan Laravel 9 mengembangkan ke pengembangan aplikasi PHP full-stack.

## Pembelajaran Berkelanjutan

Setiap sertifikasi dan course membangun dari sebelumnya, menciptakan jalur pembelajaran terstruktur.',
  'thoughts',
  '["Python", "HTML", "CSS", "Laravel", "Learning", "Certification"]'::jsonb,
  NULL, 4, true
);

-- ================================================
-- END OF V3 GRADUATE DATA
-- ================================================
-- Summary:
-- - 5 Experiences (updated with achievements & speaking)
-- - 6 Certificates (verified from CV)
-- - 4 Settings updated (hero, about, timeline)
-- - 8 Blog posts (full bilingual content)
--
-- NOTE: Projects & Skills data ada di portfolio-data-insert.sql
-- Run file tersebut TERLEBIH DULU untuk projects & skills,
-- lalu jalankan file ini untuk experiences, certificates, & blog.
-- ================================================