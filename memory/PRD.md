# The Becoming - Landing Page PRD

## Original Problem Statement
Build a website for "The Becoming" - a curated human experience landing page with:
- Hero section with headline "Do you need a reset?"
- What Is It section explaining what The Becoming is (and isn't)
- Experience section detailing what participants will experience
- Who It's For section targeting working professionals, creators, artists, homemakers
- The Circle section about the continuing community
- Testimonials/Stories section
- Multi-step questionnaire modal for sign-up
- FAQ section
- "Powered by Techbook Technologies" footer badge

## User Personas
- **Working Professionals (21-65)**: High-functioning externally but feeling paused/restless inside
- **Creators & Curators**: Artists seeking deeper meaning beyond their craft
- **Homemakers**: Those who feel there must be more depth to who they are
- **Anyone Ready**: People quietly losing or quietly lost, seeking authentic connection

## Core Requirements
1. **Immersive, journey-like design** with full-screen sections and video backgrounds
2. Warm color palette: terracotta (#c4a484), deep-sage (#7a9484), charcoal (#3a3a3a), warm-cream (#faf8f5)
3. Calm video backgrounds (lake/nature scenes)
4. High text contrast with text shadows for readability
5. Multi-step questionnaire modal with progress tracking
6. Smooth scroll navigation with parallax effects
7. Responsive design for all screen sizes

## Tech Stack
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Email**: Resend integration (pending API key)

## What's Been Implemented

**Date: Feb 20, 2025**
- ✅ Fixed text contrast issue - added text shadows and darker overlays for readability
- ✅ Replaced hero video with calm lake video for peaceful atmosphere
- ✅ Replaced CTA video with misty forest video

**Previous Implementation:**
- ✅ Complete landing page with full-screen immersive sections
- ✅ Video hero with calm lake background
- ✅ Cormorant Garamond + DM Sans typography
- ✅ Framer Motion animations (parallax, reveal, floating particles)
- ✅ Multi-step questionnaire modal (18 questions)
- ✅ Animated stats banner with counters
- ✅ Experience cards with hover effects
- ✅ Testimonials carousel with auto-rotation
- ✅ Journey section with parallax mountain banner
- ✅ Circle section with community benefits
- ✅ Sticky navigation with scroll behavior
- ✅ "Powered by Techbook Technologies" footer badge
- ✅ Test IDs for all interactive elements
- ✅ Responsive design for mobile/tablet/desktop

## Backend Status
- ✅ `/api` - Health check endpoint
- ⚠️ `/api/questionnaire` - Returns mock success (DB save NOT implemented)
- ⚠️ Email notifications - NOT implemented (awaiting Resend API key)

## Prioritized Backlog
### P0 (Critical)
- **Implement questionnaire database storage** - Save submissions to MongoDB
- **Implement email notifications** - Requires Resend API key

### P1 (High Priority)
- Embed actual founder video when available
- Update contact email if needed
- Replace placeholder video backgrounds with final assets

### P2 (Nice to Have)
- Admin dashboard to view/manage submissions
- SEO meta tags and Open Graph images
- Refactor LandingPage.jsx into smaller components

## Next Action Items
1. Implement `/api/questionnaire` to save data to MongoDB
2. User to provide Resend API key for email notifications
3. User to provide founder video URL when ready
4. Consider testing agent for full flow validation
