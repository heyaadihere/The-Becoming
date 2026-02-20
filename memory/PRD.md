# The Becoming - Landing Page PRD

## Original Problem Statement
Build a website for "The Becoming" - a curated human experience landing page with:
- Hero section with powerful, emotionally engaging headline
- What Is It section explaining what The Becoming is (and isn't)
- Experience section detailing what participants will experience
- Who It's For section targeting working professionals, creators, artists, homemakers
- The Circle section about the continuing community
- Multi-step questionnaire modal for sign-up
- FAQ section
- "Powered by Techbook Technologies" footer badge

## User Personas
- **Working Professionals (21-65)**: High-functioning externally but feeling paused/restless inside
- **Creators & Curators**: Artists seeking deeper meaning beyond their craft
- **Homemakers**: Those who feel there must be more depth to who they are
- **Anyone Ready**: People quietly losing or quietly lost, seeking authentic connection

## Design Direction (Updated Feb 20, 2026)
**Luxe Minimalist - Powerful & Immersive**

### Color Palette (Approved)
- **Cream:** #FAF7F2 (primary background)
- **Soft Cream:** #F5F1EA (section backgrounds)
- **Sand:** #E5DDD0 (borders, dividers)
- **Accent Gold:** #B8A67E (primary accent)
- **Accent Bronze:** #A08B5B (hover/gradients)
- **Rich Gold:** #9A8456 (dark accents)
- **Charcoal:** #4A4A4A (body text)
- **Deep Charcoal:** #1A1A1A (headings, dark sections)

### Typography
- **Headings:** Playfair Display (serif, elegant, timeless) - Italic for impact
- **Body:** Raleway (sans-serif, clean, modern)

### Visual Style
- Clean, minimal layouts with generous white space
- Background video in hero with cinematic overlay
- Large, prominent transparent logo (white/dark variants)
- Sharp-edged buttons (no rounded corners)
- Elegant gold dividers
- Professional Framer Motion animations throughout

## Tech Stack
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Email**: Resend integration (pending API key)

## What's Been Implemented

**Date: Feb 20, 2026 - Major UI Enhancement (Latest)**
- ✅ Changed all CTA buttons from "Begin" to "Enter The Becoming"
- ✅ Updated hero headline to "You've been waiting for this"
- ✅ Updated subheadline to emotionally engaging copy
- ✅ Implemented new transparent logo (white/dark variants)
- ✅ Added extensive Framer Motion animations:
  - Parallax scrolling effects
  - Floating elements
  - Staggered reveals on scroll
  - Hover animations on cards/buttons
  - Smooth page transitions
- ✅ Refined text alignment for premium look
- ✅ Made homepage more powerful and immersive
- ✅ Logo component now uses separate files for different backgrounds

**Date: Feb 20, 2026 - Previous Changes**
- ✅ Complete visual overhaul to luxe minimalist aesthetic
- ✅ Color palette implementation
- ✅ Typography implementation (Playfair Display + Raleway)
- ✅ Large, prominent logo implementation
- ✅ Background video in hero section
- ✅ Removed testimonials section
- ✅ Clean FAQ accordion with elegant styling
- ✅ Sharp-edged buttons and minimal UI elements

**Core Features:**
- ✅ Multi-step questionnaire modal (18 questions)
- ✅ Smooth scroll navigation
- ✅ About, Experience, Journey, Circle sections
- ✅ Footer with Techbook Technologies badge
- ✅ Test IDs for all interactive elements
- ✅ Responsive design

## Logo Assets
- `/images/logo-white.png` - For dark backgrounds (hero, footer, questionnaire modal)
- `/images/logo-dark.png` - For light backgrounds (scrolled header, CTA section)

## Backend Status
- ✅ `/api` - Health check endpoint
- ⚠️ `/api/signup` - Returns mock success (DB save NOT fully implemented)
- ⚠️ Email notifications - NOT implemented (awaiting Resend API key)

## Prioritized Backlog
### P0 (Critical)
- **Implement questionnaire database storage** - Save submissions to MongoDB
- **Implement email notifications** - Requires Resend API key

### P1 (High Priority)
- Embed founder's video in founder's note section
- Update contact email if needed (hello@thebecoming.in)

### P2 (Nice to Have)
- Admin dashboard to view/manage submissions
- SEO meta tags and Open Graph images
- Refactor LandingPage.jsx into smaller components

## Test Results (Feb 20, 2026)
- **Frontend:** 100% pass rate
- All CTA buttons verified: "Enter The Becoming"
- Questionnaire modal: fully functional (18 steps)
- Logo variants: working correctly
- Smooth scroll navigation: working
- FAQ accordion: working
- Animations: working

## Next Action Items
1. Implement `/api/signup` to save questionnaire data to MongoDB
2. User to provide Resend API key for email notifications
3. Collect user feedback on latest design enhancements
