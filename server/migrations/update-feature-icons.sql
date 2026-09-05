-- ================================================
-- UPDATE PROJECT FEATURES ICONS
-- Ganti emoji icon → Material Symbols icon name
-- ================================================

-- Catatan: field `features` adalah JSONB array berisi objek { icon, title, description }
-- Kita update icon emoji menjadi nama Material Symbols

-- 1. ServerMonitoring - Server Registry 🖥️ → dns
UPDATE projects
SET features = jsonb_set(
  features,
  '{0,icon}',
  '"dns"'
)
WHERE slug = 'server-monitoring';

-- 2. ServerMonitoring - Monitoring Real-time 📊 → monitoring
UPDATE projects
SET features = jsonb_set(
  features,
  '{1,icon}',
  '"monitoring"'
)
WHERE slug = 'server-monitoring';

-- 3. ServerMonitoring - SSH Engine 🔐 → key
UPDATE projects
SET features = jsonb_set(
  features,
  '{2,icon}',
  '"key"'
)
WHERE slug = 'server-monitoring';

-- 4. ServerMonitoring - Container Management 🐳 → deployed_code
UPDATE projects
SET features = jsonb_set(
  features,
  '{3,icon}',
  '"deployed_code"'
)
WHERE slug = 'server-monitoring';

-- 5. ServerMonitoring - Web Terminal 💻 → terminal
UPDATE projects
SET features = jsonb_set(
  features,
  '{4,icon}',
  '"terminal"'
)
WHERE slug = 'server-monitoring';

-- 6. ServerMonitoring - MCP/AI 🤖 → psychology
UPDATE projects
SET features = jsonb_set(
  features,
  '{5,icon}',
  '"psychology"'
)
WHERE slug = 'server-monitoring';

-- ================================================
-- CARA MENGGUNAKAN:
-- Jalankan di Supabase SQL Editor
-- ================================================
-- Atau jika ingin update SEMUA project sekaligus (generic mapping):
-- Emoji → Material Symbols mapping:
-- 🖥️ → dns / monitor / desktop_windows
-- 📊 → monitoring / analytics / insights
-- 🔐 → key / lock / shield
-- 🐳 → deployed_code / cloud / dock
-- 💻 → terminal / code / laptop_mac
-- 🤖 → psychology / smart_toy / robot_2
-- 🛒 → shopping_cart
-- 💳 → credit_card
-- 📄 → description
-- 🔍 → search
-- 🎯 → target / my_location
-- ⚡ → bolt
-- 🏛️ → account_balance
-- ⏱️ → timer
-- 📚 → menu_book
-- 👤 → person
-- 📋 → checklist
-- 💵 → payments
-- 🏞️ → landscape
-- 📱 → smartphone
-- ☕ → coffee
-- 🚂 → train
-- 🐍 → data_object
-- 🎨 → palette
-- 🛠️ → build
-- 💻 → code
-- ================================================
