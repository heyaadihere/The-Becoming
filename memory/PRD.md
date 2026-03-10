# The Becoming - Landing Page PRD

## Original Problem Statement
Build a "luxe minimalist" website for "The Becoming" - a 7-day psychological and creative reset experience. The site should be vibrant yet professional with warm tones, extensive animations, and full mobile responsiveness.

## Core Requirements
- Video hero carousel with synced content
- Warm color palette (cream, gold) - no black backgrounds
- Luxurious animations throughout
- Multi-step questionnaire modal (all questions mandatory)
- Contact page
- Fully mobile responsive

## Page Structure
Hero > About (The Essence) > **What is The Becoming (Video)** > Experience > What It Is / What It Isn't > Journey (Who Is This For) > Accommodation > **Founder's Vision (Video)** > CTA > FAQ > Contact > Footer

## Color Palette
- Cream: #FAF8F5, Soft Cream: #F5F0EB, Sand: #E8DFD5
- Accent Gold: #C9A962, Accent Bronze: #B8956A
- Deep Charcoal: #2D2926, Charcoal: #4A4543

## Architecture
```
/app/
├── backend/
│   └── server.py
├── frontend/
│   ├── public/videos/
│   │   ├── founder-vision.mp4    # Founder's Vision Instagram Reel
│   │   └── what-is-becoming.mp4  # What is The Becoming Instagram Reel
│   └── src/pages/
│       ├── LandingPage.jsx
│       ├── ContactPage.jsx
│       ├── AdminPage.jsx
│       ├── SignupPage.jsx
│       ├── RefundPolicyPage.jsx
│       ├── PrivacyPolicyPage.jsx
│       └── TermsOfUsePage.jsx
└── memory/PRD.md
```

## Completed Features
- [x] Hero video carousel (6 videos, synced content)
- [x] About section
- [x] **"What is The Becoming" video section** (Instagram Reel, centered vertical video)
- [x] Experience section with pyramid layout
- [x] What It Is / What It Isn't section
- [x] Journey section
- [x] **Founder's Vision section with video** (Instagram Reel + story text side-by-side)
- [x] Accommodation section
- [x] FAQ section
- [x] Questionnaire modal — **all questions mandatory**
- [x] **Fixed creativeExpression blocker bug**
- [x] Admin Dashboard with 3 tabs, XLS/PDF export, WhatsApp reminders
- [x] International phone input with validation
- [x] Partial form tracking
- [x] Email automation via Resend
- [x] Policy Pages: Refund, Privacy, Terms of Use
- [x] Full mobile responsiveness
- [x] Site branding (title, meta tags, favicon)

## Admin Credentials
- URL: /admin
- Username: admin
- Password: TheBecoming@2026

## API Endpoints
- POST /api/signup - Questionnaire submissions
- POST /api/contact - Contact form
- POST /api/partial-signup - Save partial form progress
- POST /api/admin/login - Admin authentication
- GET /api/admin/signups - All completed signups (admin)
- GET /api/admin/contacts - All contacts (admin)
- GET /api/admin/partial-signups - Incomplete form submissions (admin)

## Next Action Items
1. P2: Refactor LandingPage.jsx into smaller components
2. P2: Refactor server.py into routes/models/services

## Future/Backlog
- SEO optimization
- Analytics integration
