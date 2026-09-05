# 🚀 DamarDev — Portfolio & Engineering Platform

> Full-stack developer portfolio dengan CMS, dibangun dengan arsitektur modern dan desain premium.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5)

---

## ✨ Tentang Proyek

Portfolio pribadi **Damar (DamarDev)** — seorang Full-Stack Developer & Backend Engineer. Website ini menampilkan karya, skills, pengalaman, sertifikat, dan blog, dilengkapi dengan **CMS dashboard** untuk mengelola seluruh konten.

### Fitur Utama

- 🌐 **Bilingual** (English & Bahasa Indonesia)
- 🎨 **Aurora UI** — desain premium dengan glassmorphism & animasi halus
- 💻 **MacBook 3D Mockup** — interaktif dengan lenticular effect (4 arah drag)
- 🖼️ **Cloudinary CDN** — upload & optimasi gambar otomatis
- 🔐 **Supabase Auth** — autentikasi dengan JWT + password reset
- 📝 **CMS Dashboard** — kelola projects, blog, skills, experience, certificates
- ♻️ **Recycle Bin** — soft delete dengan restore (30 hari auto-purge)
- ⏸️ **Pending System** — sembunyikan project sementara tanpa hapus
- 📱 **Fully Responsive** — optimal di semua device

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 7**
- **Tailwind CSS** (design system custom)
- **Framer Motion** (animasi)
- **i18next** (bilingual)

### Backend
- **Node.js** + **Express**
- **Supabase** (PostgreSQL + Auth)
- **Cloudinary** (image CDN)
- **Helmet** (security headers)
- **Rate Limiting** (anti brute-force)

---

## 📁 Struktur Proyek

```
├── src/                      # Frontend (React)
│   ├── components/           # Reusable components
│   ├── pages/                # Route pages (Home, About, Projects, Blog, Dashboard, dll)
│   ├── services/             # API service layer
│   ├── hooks/                # Custom hooks
│   ├── styles/               # Global styles & design tokens
│   ├── data/locales/         # i18n (EN/ID translations)
│   └── utils/                # Helpers
├── server/                   # Backend (Express)
│   ├── config/               # Supabase & Cloudinary config
│   ├── routes/               # API routes
│   ├── middleware/           # Auth middleware
│   ├── migrations/           # SQL migration files
│   └── scripts/              # Utility scripts
├── public/                   # Static assets
│   └── videos/               # Lenticular videos (WebM)
├── tailwind.config.js        # Design tokens
└── vite.config.js            # Vite config
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Supabase project
- Cloudinary account

### 1. Clone & Install
```bash
git clone https://github.com/KarmaSenzu/Portofolio.git
cd Portofolio
npm install
cd server && npm install && cd ..
```

### 2. Konfigurasi Environment
```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env dengan credentials Anda
```

Isi `server/.env`:
```env
PORT=5001
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 3. Setup Database (Supabase)
Jalankan migration SQL di Supabase SQL Editor secara berurutan:
1. `server/migrations/supabase-schema.sql`
2. `server/migrations/portfolio-data-insert.sql`
3. `server/migrations/portfolio-data-v3-graduate.sql`
4. `server/migrations/pending-projects.sql`
5. `server/migrations/recycle-bin.sql`

### 4. Jalankan
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm run dev
```

Buka: `http://localhost:3000`

---

## 🔐 Keamanan

- ✅ CORS locked (reject unknown origins)
- ✅ Rate limiting pada login (anti brute-force)
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Supabase Auth (JWT + password reset via email)
- ✅ SVG upload blocked (anti XSS)
- ✅ Soft delete (Recycle Bin) — tidak langsung hapus permanen

---

## 🌐 API Endpoints

### Public (tanpa auth)
| Endpoint | Fungsi |
|----------|--------|
| `GET /api/projects` | List projects |
| `GET /api/projects/:slug` | Detail project |
| `GET /api/blog` | List blog posts |
| `GET /api/skills` | List skills |
| `GET /api/experiences` | List experiences |
| `GET /api/certificates` | List certificates |
| `GET /api/settings` | Site settings |
| `GET /api/health` | Health check |

### Protected (butuh auth)
| Endpoint | Fungsi |
|----------|--------|
| `POST /api/auth/login` | Login |
| `POST /api/auth/forgot-password` | Kirim reset email |
| `POST /api/auth/reset-password` | Reset password |
| `POST/PUT/DELETE /api/projects` | CRUD projects |
| `POST/PUT/DELETE /api/blog` | CRUD blog |
| `GET /api/recycle-bin` | List item terhapus |
| `POST /api/upload` | Upload gambar |

---

## 🎨 Design System

### Color Palette (Precision Luminescence)
- **Primary**: `#630ED4` (violet)
- **Secondary**: `#0051D5` (blue)
- **Background**: `#FBF8FC` (lavender-white)
- **Tertiary**: `#005A3D` (emerald)

### Typography
- **Heading**: Space Grotesk
- **Body**: Geist
- **Icons**: Material Symbols

---

## 📦 Deployment

### Cloudflare Tunnel
Lihat konfigurasi di `server/.env` (set `FRONTEND_URL` & `CORS_ORIGIN` ke domain publik), lalu:

```bash
npm run build
cd server && npm start

# Install & run tunnel
cloudflared tunnel login
cloudflared tunnel create portfolio
cloudflared tunnel route dns portfolio your-domain.com
cloudflared tunnel run portfolio
```

---

## 📝 License

Proyek pribadi — hak cipta dilindungi. Tidak untuk distribusi ulang tanpa izin.

---

## 👤 Author

**Damar (DamarDev)** — Full-Stack Developer & Backend Engineer

- GitHub: [@KarmaSenzu](https://github.com/KarmaSenzu)
- LinkedIn: [Damar Fikrie](https://www.linkedin.com/in/damar-fikrie-216240238/)

---

*Dibangun dengan ❤️ dan banyak ☕*
