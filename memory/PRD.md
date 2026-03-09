# The Becoming - Landing Page PRD

## Original Problem Statement
Build a "luxe minimalist" website for "The Becoming" - a 7-day psychological and creative reset experience. The site should be vibrant yet professional with warm tones, extensive animations, and full mobile responsiveness.

## Core Requirements
- 4-image hero carousel with synced content
- Warm color palette (cream, gold) - no black backgrounds
- Luxurious animations throughout
- Multi-step questionnaire modal
- Contact page
- Fully mobile responsive

## Page Structure
Hero > About (The Essence) > Experience > What It Is / What It Isn't > Journey (Who Is This For) > Accommodation > Founder Story > CTA > FAQ > Contact > Footer

## Color Palette
- Cream: #FAF8F5, Soft Cream: #F5F0EB, Sand: #E8DFD5
- Accent Gold: #C9A962, Accent Bronze: #B8956A
- Deep Charcoal: #2D2926, Charcoal: #4A4543

## Architecture
```
/app/
├── backend/
│   └── server.py        # FastAPI: /api/signup, /api/contact, /api/admin/signups, /api/admin/contacts
├── frontend/src/
│   ├── App.js           # Routes: /, /contact, /admin, /signup, /refund-policy, /privacy-policy, /terms-of-use
│   └── pages/
│       ├── LandingPage.jsx    # All landing page sections + questionnaire logic
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
- [x] About section (updated definition from doc)
- [x] Experience section with pyramid layout
- [x] What It Is / What It Isn't section
- [x] Journey section (Working Professionals, Creators, Artists, Homemakers + "Not For" disclaimer)
- [x] Founder Story section
- [x] Accommodation section (Mountains Sunrise, Monsoon Valley, Beach & Open Sky, Starry Night)
- [x] FAQ section (8 questions with real answers)
- [x] Questionnaire modal with HD images, validation error messages
- [x] Form timing options: April 2026, July 2026, Oct 2026, Flexible
- [x] Multi-select max increased to 8
- [x] Success page with large logo, "You're on Your Way!", "A Becoming bud will call you soon!"
- [x] Contact email: enter@thebecoming.in throughout site
- [x] Admin Dashboard at /admin (username: admin, password: TheBecoming@2026)
- [x] Policy Pages: Refund, Privacy, Terms of Use (linked in footer)
- [x] Full mobile responsiveness with hamburger menu
- [x] All background animations (luxurious, subtle)
- [x] International phone input with validation
- [x] Partial form tracking: saves progress on each step, visible in admin 'Incomplete' tab
- [x] Admin dashboard: 3 tabs (Completed, Incomplete with WhatsApp message, Contacts)
- [x] XLS/PDF export from admin dashboard
- [x] Email automation via Resend
- [x] Site branding (title, meta tags, favicon)
- [x] **ALL form questions mandatory** (multi-select, textarea, single-select, text, phone, contact)
- [x] **Fixed creativeExpression blocker bug** - canProceed() now validates multi and textarea types

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
1. P2: Refactor LandingPage.jsx into smaller components (HeroSection, AboutSection, Questionnaire, etc.)
2. P2: Refactor server.py into routes, models, and services folders

## Future/Backlog
- SEO optimization
- Analytics integration
