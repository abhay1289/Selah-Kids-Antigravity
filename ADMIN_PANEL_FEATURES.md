# Selah Kids — Admin Panel Features

> Complete inventory of every module, page, and capability built into the CMS dashboard.
> **Last Updated:** April 20, 2026

---

## 🏗️ Architecture Overview

| Layer | Technology |
|:------|:-----------|
| Framework | Next.js 15 (App Router) |
| UI Library | Framer Motion + Tailwind CSS 4 |
| Database | Supabase (PostgreSQL) with offline fallback |
| Auth | Supabase Auth with admin guard |
| Hosting | Vercel (Edge Network) |
| Fonts | Fredoka (headings) + Quicksand (body) |

**Total Admin Routes:** 40
**Sidebar Sections:** 5 (Content → Website → Marketing → Technical → System)

---

## 📁 Module Inventory (28 Modules)

---

### 🔐 Authentication & Layout

| Feature | File | Description |
|:--------|:-----|:------------|
| Login Page | `admin/login/page.tsx` | Email/password login with branded UI |
| Auth Guard | `admin/layout.tsx` | Protects all `/admin/*` routes |
| Admin Sidebar | `components/admin/AdminSidebar.tsx` | 5-section sidebar with dividers, collapsible sub-menus, mobile drawer |
| Admin Header | `components/admin/AdminHeader.tsx` | Top bar with breadcrumbs and view-site link |

---

### 📊 Dashboard (`/admin`)

| Feature | Description |
|:--------|:------------|
| Welcome Banner | Branded gradient hero with greeting |
| Stats Grid | 4 metric cards: Total Pages, Blog Posts, Videos, Team Members |
| Quick Actions | 6 shortcut cards to key modules |
| Pages Overview | Clickable list of all 9 public pages with Published badges |

---

### 📄 Page Editors (7 Pages)

All editors feature **bilingual EN/ES side-by-side fields** with collapsible sections.

| Page | Route | Fields |
|:-----|:------|:-------|
| Homepage | `/admin/pages/home` | 7 sections, 40+ fields |
| About | `/admin/pages/about` | Core values, team, 19 fields |
| Watch | `/admin/pages/watch` | Hero section |
| Families | `/admin/pages/parents` | Hero section |
| Donate | `/admin/pages/donate` | Hero section |
| Contact | `/admin/pages/contact` | Hero section |
| Resources | `/admin/pages/resources` | Hero section |

---

### 📚 Content Managers (5 Collections)

| Collection | Route | Capabilities |
|:-----------|:------|:-------------|
| Blog Posts | `/admin/content/blog` | Add/delete, bilingual, slug, image preview, publish toggle |
| Videos | `/admin/content/videos` | YouTube URL, thumbnails, bilingual titles |
| Characters | `/admin/content/characters` | Andy/Libni/Shiloh editor with gradient colors |
| Testimonials | `/admin/content/testimonials` | 5 testimonials, accent color, publish/draft |
| Team Members | `/admin/content/team` | Leah/Rey/Carla with bios |

---

### 🖼️ Media Library (`/admin/media`)

| Feature | Description |
|:--------|:------------|
| Drag & Drop Upload | File drop zone with visual feedback |
| Search & Grid | Filter and browse thumbnails |
| File Actions | Delete, copy URL |

---

### 🧭 Navigation Bar (`/admin/navbar`)

| Feature | Description |
|:--------|:------------|
| Live Preview | Real-time rendered navbar showing links, logo, CTA |
| Menu Links | Add/delete/reorder bilingual nav links with visibility toggle |
| Logo Settings | Editable logo image path |
| CTA Button | Bilingual CTA label, target URL |
| Toggles | Sticky-on-scroll, language switcher show/hide |

---

### 🦶 Footer (`/admin/footer`)

| Feature | Description |
|:--------|:------------|
| Brand Tagline | Bilingual tagline (EN/ES) |
| Page Links | Add/delete with emoji icons, bilingual labels |
| Social Media | Per-platform bilingual URLs (Instagram, YouTube, Music) |
| Newsletter | Title, placeholder, button text (EN/ES) |
| Copyright & Credits | Copyright text, "Designed by" link |

---

### 📢 Announcements (`/admin/announcements`)

| Feature | Description |
|:--------|:------------|
| Live Preview | Real-time banner rendering with custom colors |
| Banner Management | Multiple banners, only one active at a time |
| Bilingual Text | EN/ES announcement text |
| Color Picker | Custom BG with native picker + hex input |
| Page Targeting | All Pages / Homepage / Custom |
| Dismissible Toggle | Allow visitors to close banner |

---

### 📝 Forms (`/admin/forms`)

| Feature | Description |
|:--------|:------------|
| Form Selector | Contact Form + Newsletter sidebar |
| Recipient Email | Where submissions are sent |
| Success Messages | Bilingual confirmations |
| Field Builder | Add/remove fields with types (Text/Email/Phone/Textarea/Select) |
| Required Toggle | Mark fields required or optional |

---

### 🌐 Translations (`/admin/translations`)

| Feature | Description |
|:--------|:------------|
| Coverage Dashboard | Overall EN↔ES translation percentage |
| Per-Page Status | Complete / Partial / Missing badges |
| Word Counts | EN vs ES word counts with progress bars |
| Missing Fields | Specific warnings showing untranslated content |
| Component Coverage | Tracks Navbar and Footer translations too |

---

### 🔍 SEO Manager (`/admin/seo`)

| Feature | Description |
|:--------|:------------|
| Per-Page SEO Cards | Expandable card for each of 8 pages |
| Meta Title | Live character counter (🟢 <50 / 🟡 50-60 / 🔴 >60) |
| Meta Description | Live character counter (🟢 <140 / 🟡 140-160 / 🔴 >160) |
| Focus Keyword | Input per page |
| Robots Directive | Dropdown (Index/NoIndex × Follow/NoFollow) |
| Canonical URL | Monospaced input |
| Google Preview | Live SERP preview |
| Open Graph | OG Title, Description, Image with social card preview |
| Structured Data | Schema type selector + JSON-LD code preview |
| SEO Score | 0-100 per page + site-wide average |

---

### 🎯 Keyword Tracker (`/admin/keywords`)

| Feature | Description |
|:--------|:------------|
| 12 Tracked Keywords | With search positions, volume, difficulty, CPC |
| Position Badges | Up/down arrows showing rank changes |
| Stats Cards | Avg. position, Top 3 count, Top 10 count, Improved count |
| Rank Trend Chart | 6-week average position bar chart |
| Search & Sort | Filter by keyword, sort by position or volume |
| Difficulty Levels | Low/Medium/High color-coded badges |
| Page Mapping | Shows which page ranks for each keyword |

---

### 📊 Content Quality (`/admin/content-quality`)

| Feature | Description |
|:--------|:------------|
| Readability Scores | Per-page 0-100 with Easy/Standard/Advanced labels |
| Word Counts | Total and per-page word counts |
| Keyword Density | Percentage with optimal range indicator (1-3%) |
| SEO Metrics Grid | Headings, images, internal links, meta length per page |
| Pass/Fail Icons | ✓/⚠ indicators for each metric |
| Focus Keywords | Displayed per page with highlight badges |

---

### 🔗 Link Checker (`/admin/links`)

| Feature | Description |
|:--------|:------------|
| Full Site Scan | 12 links checked (internal + external) |
| Status Badges | 200 OK, 404 Broken, 301 Redirect, Timeout |
| Stats Cards | Healthy/Broken/Redirect/Timeout counts (clickable filters) |
| Response Times | Millisecond timing per link |
| Type Labels | Internal / External badges |
| Source Pages | Shows which page contains each link |
| Re-scan Button | Manual rescan trigger |

---

### 📊 Analytics (`/admin/analytics`)

| Feature | Description |
|:--------|:------------|
| Period Selector | 7d / 30d / 90d toggle |
| Real-Time Banner | Active visitors with pulsing indicator |
| Stats Cards | Visits, Unique Visitors, Avg. Duration, Bounce Rate |
| Traffic Chart | SVG area chart with daily data |
| Top Pages | Ranked list with growth percentages |
| Traffic Sources | Bar chart (Organic/YouTube/Direct/Social/Referral) |
| Device Breakdown | Mobile/Desktop/Tablet with icons |
| Top Countries | 6 countries with flag emojis |

---

### 📅 Scheduler (`/admin/scheduler`)

| Feature | Description |
|:--------|:------------|
| Interactive Calendar | Monthly grid with navigable months |
| Content Dots | Color-coded (Blog/Page/Video) |
| Upcoming Queue | Scheduled items sidebar |
| Drafts Panel | Draft items awaiting scheduling |

---

### ⚡ Performance (`/admin/performance`)

| Feature | Description |
|:--------|:------------|
| Score Gauge | Animated circular SVG (0-100) |
| Core Web Vitals | LCP/INP/CLS with targets and pass/fail |
| Page Speed Table | Mobile + desktop scores per page |
| Optimization Tips | 4 recommendations with impact levels |

---

### 📡 Uptime Monitor (`/admin/uptime`)

| Feature | Description |
|:--------|:------------|
| Live Status | Green pulsing "Online" indicator |
| 90-Day Grid | GitHub-style availability heatmap (Up/Degraded/Down) |
| Stats | Uptime %, avg. response time, incident count |
| Incident History | Past outages with cause, duration, severity |
| Color Legend | Green = Up, Yellow = Degraded, Red = Down |

---

### 🔒 Security (`/admin/security`)

| Feature | Description |
|:--------|:------------|
| Security Grade | A+ / A / B letter grade |
| 15 Security Checks | Across SSL, Headers, Auth, Data, Network, Privacy |
| Severity Levels | Pass (green), Warning (yellow), Critical (red) |
| SSL | Certificate validity, HTTPS redirect |
| Headers | X-Frame-Options, CSP, HSTS, X-Content-Type-Options |
| Auth | Admin panel protection, RLS, password policy |
| Data | Database backups, environment variables |
| Network | DDoS protection, API rate limiting |
| Privacy | Cookie consent, privacy policy |

---

### 🔄 Redirects (`/admin/redirects`)

| Feature | Description |
|:--------|:------------|
| 7 Redirect Rules | Source → destination with 301/302 types |
| Hit Counter | Times each redirect has fired |
| Active/Inactive | Per-rule toggle |
| Add/Delete/Search | Full CRUD with filtering |

---

### 📋 Activity Log (`/admin/activity`)

| Feature | Description |
|:--------|:------------|
| Timeline | 15 entries from Leah/Rey/Carla |
| Action Types | Updated/Published/Created/Deleted/Login/Settings |
| Filters & Search | By action type and user name |

---

### ♿ Accessibility (`/admin/accessibility`)

| Feature | Description |
|:--------|:------------|
| WCAG Grade | A / AA / Needs Work |
| 14 Checks | Images, Headings, Links, Contrast, Forms, ARIA |
| Fix Suggestions | Actionable recommendations per issue |

---

### 🗺️ Sitemap & Robots (`/admin/sitemap`)

| Feature | Description |
|:--------|:------------|
| Visual Page Tree | Include/exclude toggles |
| Priority/Frequency | Per-page dropdowns |
| Auto-Generate | Toggle for automatic regeneration |
| Robots.txt Editor | Dark-theme code editor |

---

### 💻 Custom Code (`/admin/code`)

| Feature | Description |
|:--------|:------------|
| Pre-built Blocks | GA4, Facebook Pixel, Custom CSS, Custom JS |
| Dark Code Editor | Monospace textarea |
| Placement | Head / Body Start / Body End |
| Safety Warning | Risk notice for custom code |

---

### 🎨 Theme & Design (`/admin/theme`)

| Feature | Description |
|:--------|:------------|
| 10 Color Tokens | Native color pickers + hex inputs |
| Live Swatches | Animated color preview row |
| Typography | Fredoka + Quicksand preview |
| Design Tokens | Border radius, glass opacity controls |

---

### 👥 Users & Roles (`/admin/users`)

| Feature | Description |
|:--------|:------------|
| Team Members | Leah (Admin), Rey (Editor), Carla (Editor) |
| Invite System | Email invite with role selector |
| 3 Roles | Admin / Editor / Viewer |
| Permissions Matrix | 12-row access control table |

---

### 💾 Backup & Export (`/admin/backups`)

| Feature | Description |
|:--------|:------------|
| 5 Export Options | Database (JSON), Media (ZIP), SEO (CSV), Redirects (CSV), Full Backup |
| Auto-Backup | Daily toggle with 30-day retention |
| Backup History | Timeline with auto/manual labels, sizes, download |
| Create Backup | Manual one-click backup creation |

---

### ⚙️ Settings (`/admin/settings`)

| Group | Fields |
|:------|:-------|
| Branding | Site Title, Meta Description, Logo, Footer Tagline (EN/ES) |
| Social Links | YouTube EN/ES, Instagram EN/ES |
| Music | Spotify, Apple Music |
| Contact | Email |

---

## 📐 Design System

- **Cards**: `bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm`
- **Headings**: Fredoka in `#3a6b44` (forest green)
- **Accents**: `#ff5c00` (orange), `#93d35c` (green), `#feb835` (yellow), `#00BFFF` (blue)
- **Inputs**: Rounded with transparent borders, orange focus
- **Animations**: Framer Motion spring transitions

---

## 🔗 Complete Route Map (40 Routes)

### Admin Routes
```
/admin                          Dashboard
/admin/login                    Login
/admin/pages/home               Homepage Editor
/admin/pages/about              About Editor
/admin/pages/watch              Watch Editor
/admin/pages/parents            Families Editor
/admin/pages/donate             Donate Editor
/admin/pages/contact            Contact Editor
/admin/pages/resources          Resources Editor
/admin/content/blog             Blog Manager
/admin/content/videos           Video Manager
/admin/content/characters       Characters Manager
/admin/content/testimonials     Testimonials Manager
/admin/content/team             Team Manager
/admin/media                    Media Library
/admin/navbar                   Navigation Bar Editor
/admin/footer                   Footer Editor
/admin/announcements            Announcement Bar
/admin/forms                    Forms Manager
/admin/translations             Translation Manager
/admin/seo                      SEO Manager
/admin/keywords                 Keyword Tracker
/admin/content-quality          Content Quality Scorer
/admin/links                    Link Checker
/admin/analytics                Analytics Dashboard
/admin/scheduler                Content Scheduler
/admin/performance              Performance Monitor
/admin/uptime                   Uptime Monitor
/admin/security                 Security Scanner
/admin/redirects                Redirects Manager
/admin/accessibility            Accessibility Checker
/admin/sitemap                  Sitemap & Robots
/admin/activity                 Activity Log
/admin/code                     Custom Code Injection
/admin/theme                    Theme & Design
/admin/users                    Users & Roles
/admin/backups                  Backup & Export
/admin/settings                 Global Settings
```

### Public Routes (9) — Untouched
```
/                               Homepage
/about                          About
/watch                          Watch
/parents                        Families
/blog                           Blog
/resources                      Resources
/donate                         Donate
/contact                        Contact
/music                          Music
```
