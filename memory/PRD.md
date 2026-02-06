# The Becoming - Landing Page PRD

## Original Problem Statement
Build a website for "The Becoming" - a curated human experience landing page with:
- Hero section with compelling headline about becoming real again
- What Is It section explaining what The Becoming is (and isn't)
- Experience section detailing what participants will experience
- Who It's For section targeting working professionals, creators, artists, homemakers
- The Circle section about the continuing community
- Pilot Batch section for the first 20-person experience
- How It Works section (sign-up process)
- Sign-Up Form with name, email, phone (optional), and reflective questions
- Founder's Note section with video placeholder

## User Personas
- **Working Professionals (21-65)**: High-functioning externally but feeling paused/restless inside
- **Creators & Curators**: Artists seeking deeper meaning beyond their craft
- **Homemakers**: Those who feel there must be more depth to who they are
- **Anyone Ready**: People quietly losing or quietly lost, seeking authentic connection

## Core Requirements
1. Dark, moody, introspective theme (blacks, deep grays, warm sand accents)
2. Mix of minimalist, rich textures, and editorial/magazine style
3. Nature/stillness, abstract/artistic, and human connection imagery
4. Sign-up form with database storage + email notifications
5. Video placeholder for founder section
6. Smooth scroll navigation between sections
7. Responsive design for all screen sizes

## Tech Stack
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Email**: Resend integration (ready when API key provided)

## What's Been Implemented
**Date: Feb 6, 2025**
- ✅ Complete landing page with all 9 sections
- ✅ Dark theme with Playfair Display + Manrope typography
- ✅ Framer Motion animations (fade-in-up, stagger effects)
- ✅ Grain texture overlay for premium feel
- ✅ Sign-up form with MongoDB storage
- ✅ Email notification system (ready - needs Resend API key)
- ✅ Glass-morphism cards with hover effects
- ✅ Video placeholder with custom play button
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Test IDs for all interactive elements

## Prioritized Backlog
### P0 (Critical)
- None - MVP complete

### P1 (High Priority)
- Configure Resend API key for email notifications
- Add actual founder video when available
- Admin dashboard to view/manage submissions

### P2 (Nice to Have)
- Add loading states for images
- Implement analytics tracking
- Add SEO meta tags and Open Graph images
- Add smooth scroll library (Lenis) for enhanced UX

## Next Action Items
1. Test end-to-end flow with testing agent
2. User to provide Resend API key for email notifications
3. User to provide founder video URL when ready
4. Consider adding admin panel for viewing submissions
