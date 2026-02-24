# The Becoming - Landing Page PRD

## Original Problem Statement
Build a website for "The Becoming" - a curated human experience landing page with:
- Hero section with 4-image carousel featuring pastel, serene landscape images
- Multi-section layout: About, Experience (pyramid), Journey, FAQs, CTA, Contact
- Multi-step questionnaire modal for sign-up with images/animations per slide
- Contact form with required fields
- "Powered by Techbook Technologies" footer badge

## User Personas
- **Working Professionals (21-65)**: High-functioning externally but feeling paused/restless inside
- **Creators & Curators**: Artists seeking deeper meaning beyond their craft
- **Homemakers**: Those who feel there must be more depth to who they are
- **Anyone Ready**: People quietly losing or quietly lost, seeking authentic connection

## Design Direction
**Luxe Minimalist - Powerful & Immersive**

### Color Palette
- **Cream:** #FAF7F2 (primary background)
- **Soft Cream:** #F5F1EA (section backgrounds)
- **Sand:** #E5DDD0 (borders, dividers)
- **Accent Gold:** #B8A67E (primary accent)
- **Accent Bronze:** #A08B5B (hover/gradients)
- **Rich Gold:** #9A8456 (dark accents)
- **Charcoal:** #4A4A4A (body text)
- **Deep Charcoal:** #1A1A1A (headings, dark sections)

### Typography
- **Headings:** Cormorant Garamond (serif, elegant, timeless) - Italic for impact
- **Body:** Inter (sans-serif, clean, modern)

## Tech Stack
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Database**: MongoDB (signup_submissions, contact_submissions)
- **Email**: Resend integration (pending API key)

## What's Been Implemented

### Date: Dec 2025 - Complete Redesign

**Hero Section:**
- ✅ 4-image carousel with pastel landscape backgrounds
- ✅ "A Curated Human Experience" text prominently visible
- ✅ Large logo display
- ✅ Auto-rotating images every 5 seconds
- ✅ Clickable image indicators

**About Section ("What is The Becoming?"):**
- ✅ Positive framing (not what it isn't)
- ✅ No yoga image
- ✅ Animated background elements
- ✅ Three feature cards with hover animations

**Experience Section:**
- ✅ Pyramid structure layout (items narrow toward bottom)
- ✅ "Learning & Unlearning" as first item
- ✅ Animated "No promises. Only experiences." tagline
- ✅ Five experience items with descriptions

**Journey Section ("Who it's for"):**
- ✅ Bold **YOU** styling in headings
- ✅ Mountain landscape image
- ✅ Six "Maybe YOU..." pointers

**FAQ Section:**
- ✅ Accordion style with expand/collapse
- ✅ Placeholder answers (waiting for content)

**CTA Section:**
- ✅ Large animated logo
- ✅ "Ready to begin your journey?" heading
- ✅ "Enter The Becoming" button

**Questionnaire Modal:**
- ✅ 11-step questionnaire
- ✅ Split-screen layout with images per slide
- ✅ Mandatory fields: email, phone, social media handle
- ✅ Alternate phone field (optional)
- ✅ Instagram/LinkedIn selection for social media
- ✅ "A Becoming bud will call you soon!" thank-you message
- ✅ Progress indicator
- ✅ Warm cream/beige color palette

**Contact Section:**
- ✅ Large logo (h-32 md:h-40)
- ✅ Contact form: Name, Email*, Phone*, Message*
- ✅ Submit button with loading state
- ✅ Email & Phone display
- ✅ Privacy Policy & Terms of Service links

**Footer:**
- ✅ "Powered by Techbook Technologies" badge
- ✅ Copyright notice

**Backend APIs:**
- ✅ POST /api/signup - Saves questionnaire submissions to MongoDB
- ✅ POST /api/contact - Saves contact form submissions to MongoDB
- ✅ GET /api/signups - Lists all signup submissions
- ✅ All endpoints tested and working (100% pass rate)

## Logo Assets
- `/images/logo-white.png` - For dark backgrounds
- `/images/logo-dark.png` - For light backgrounds

## Database Schema

### signup_submissions
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string (email)",
  "phone": "string (optional)",
  "alt_phone": "string (optional)",
  "social_media": "string (optional)",
  "questionnaire_data": "string (JSON)",
  "submitted_at": "datetime",
  "status": "pending|contacted|converted"
}
```

### contact_submissions
```json
{
  "id": "uuid",
  "name": "string (optional)",
  "email": "string (email)",
  "phone": "string",
  "message": "string",
  "submitted_at": "datetime"
}
```

## Test Results (Dec 2025)
- **Backend:** 100% (14/14 tests passed)
- **Frontend:** 100% (all UI tests passed)
- All features verified working

## Prioritized Backlog

### P0 (Completed)
- ✅ Full site redesign with all sections
- ✅ 4-image hero carousel
- ✅ Pyramid layout for Experience section
- ✅ Questionnaire with mandatory fields
- ✅ Contact form with submission
- ✅ Database storage for submissions

### P1 (High Priority)
- **Email notifications** - Requires Resend API key from user
- **FAQ content** - Waiting for answers from client

### P2 (Nice to Have)
- Embed founder's video
- Admin dashboard to view/manage submissions
- SEO meta tags and Open Graph images
- Refactor LandingPage.jsx into smaller components

## Next Action Items
1. User to provide Resend API key for email notifications
2. User to provide FAQ answers
3. User to provide actual contact phone number (currently placeholder)
