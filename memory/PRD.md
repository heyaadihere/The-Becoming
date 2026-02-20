# The Becoming - Landing Page PRD

## Original Problem Statement
Build a website for "The Becoming" - a curated human experience landing page with:
- Hero section with headline "Do you need a reset?"
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

## Design Direction (Updated Feb 20, 2025)
**Luxe Minimalist / Happy yet Luxurious / Pastel Approach**

### Color Palette
- **Pearl White:** #FEFEFA (primary background)
- **Ivory:** #FFFFF0
- **Soft Beige:** #F5F1EB (section backgrounds)
- **Warm Sand:** #E8E0D5 (borders, dividers)
- **Muted Gold:** #C9B896 (primary accent)
- **Rich Gold:** #B8A67E (hover states)
- **Deep Gold:** #9A8A6E (dark accents)
- **Charcoal:** #2C2C2C (text)

### Typography
- **Headings:** Playfair Display (serif, elegant, timeless)
- **Body:** Raleway (sans-serif, clean, modern)

### Visual Style
- Clean, minimal layouts
- No video backgrounds - static with subtle gradient transitions
- Large, prominent logo in circular design
- Sharp-edged buttons (no rounded corners)
- Elegant gold dividers
- Generous white space

## Tech Stack
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Email**: Resend integration (pending API key)

## What's Been Implemented

**Date: Feb 20, 2025 - Major Redesign**
- ✅ Complete visual overhaul to luxe minimalist aesthetic
- ✅ New color palette: muted gold + soft beige + pearl white
- ✅ New typography: Playfair Display + Raleway
- ✅ Large, prominent logo redesign
- ✅ Removed video backgrounds for clean static design
- ✅ Removed testimonials section
- ✅ Clean FAQ accordion with elegant styling
- ✅ Sharp-edged buttons and minimal UI elements

**Previous Implementation:**
- ✅ Multi-step questionnaire modal (18 questions)
- ✅ Smooth scroll navigation
- ✅ About, Experience, Journey, Circle sections
- ✅ Footer with Techbook Technologies badge
- ✅ Test IDs for all interactive elements
- ✅ Responsive design

## Backend Status
- ✅ `/api` - Health check endpoint
- ⚠️ `/api/questionnaire` - Returns mock success (DB save NOT implemented)
- ⚠️ Email notifications - NOT implemented (awaiting Resend API key)

## Prioritized Backlog
### P0 (Critical)
- **Implement questionnaire database storage** - Save submissions to MongoDB
- **Implement email notifications** - Requires Resend API key

### P1 (High Priority)
- Update contact email if needed
- Finalize any imagery/photos

### P2 (Nice to Have)
- Admin dashboard to view/manage submissions
- SEO meta tags and Open Graph images

## Next Action Items
1. Implement `/api/questionnaire` to save data to MongoDB
2. User to provide Resend API key for email notifications
3. User feedback on new design direction
