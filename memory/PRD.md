# The Becoming - Landing Page PRD

## Original Problem Statement
Build a luxe minimalist website for "The Becoming" - a curated human experience platform.

## Latest Updates (Dec 2025)

### Implemented Changes:
1. **Hero Section - 4 Dynamic Content Versions**
   - Content changes with each of the 4 carousel images
   - Version 1: "You've always known there's more to who you are"
   - Version 2: "The journey within begins with a single step"
   - Version 3: "Where learning meets transformation"
   - Version 4: "Not just an experience but a becoming"

2. **About Section - Added Images**
   - Each of the 3 cards now has a relevant image
   - Images: Growth (leaves), Journey (person), Connection (group)

3. **Experience Section - Added Image Strip**
   - 5 images at the top representing each experience
   - Pyramid layout maintained

4. **Journey Section Updates**
   - Removed age restriction (no more "aged 21-65")
   - Pointers now start with capital letters:
     - "Are ready to embrace..."
     - "Seek deeper meaning..."
     - "Want to learn..."
     - "Crave authentic connections..."
     - "Are open to exploring..."
     - "Feel ready to step..."

5. **New Accommodation Section**
   - Added before FAQ
   - 4 accommodation images gallery
   - 3 feature cards (Serene Surroundings, Comfortable Spaces, Nourishing Meals)

6. **FAQ Section**
   - Title changed to "Frequently Asked Questions" (full form)
   - Positioned before footer

7. **No Black Backgrounds**
   - Contact section: Now uses soft-cream background
   - Footer: Now uses cream background
   - All text uses charcoal/deep-charcoal instead of white-on-black

8. **Section Order Updated**
   - Hero > About > Experience > Journey > Accommodation > CTA > FAQ > Contact > Footer

## Color Palette (No Black)
- **Cream:** #FAF7F2 (primary background)
- **Soft Cream:** #F5F1EA (section backgrounds)
- **Sand:** #E5DDD0 (borders, dividers)
- **Accent Gold:** #B8A67E (primary accent)
- **Deep Charcoal:** #1A1A1A (text only, not backgrounds)
- **Charcoal:** #4A4A4A (body text)

## Tech Stack
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Database**: MongoDB (signup_submissions, contact_submissions)

## API Endpoints
- `POST /api/signup` - Questionnaire submissions
- `POST /api/contact` - Contact form submissions
- `GET /api/signups` - List submissions

## Completed Features
- [x] 4-image hero carousel with dynamic content
- [x] About section with images
- [x] Experience section with image strip + pyramid layout
- [x] Journey section (capitalized pointers, no age)
- [x] Accommodation section with gallery
- [x] FAQ section (full title)
- [x] Contact form (warm theme)
- [x] Footer (warm theme)
- [x] Questionnaire modal with images per slide
- [x] All background animations (luxurious, subtle)
- [x] No black backgrounds anywhere
- [x] Journey section title fixed: "Who Is This For?" (was repetitive)
- [x] Form validation error messages on required fields
- [x] Accommodation images: mountains sunrise, monsoon valley, beach open sky, starry night
- [x] Timing options updated: April 2026, July 2026, Oct 2026, Flexible
- [x] Form images upgraded to HD resolution (w=1920&q=90)
- [x] Success page: logo + celebratory "You're on Your Way!" message
- [x] Duplicate friends image removed (unique images across all sections)

- [x] FAQ section populated with real content (5 Q&As from doc)
- [x] CTA subtitle removed ("If something within you resonates...")
- [x] "And Most Importantly" removed above Maybe YOU
1. **Form Validation Errors** - Red error messages when mandatory fields are empty and user clicks Continue
2. **Accommodation Images** - Mountain sunrise, monsoon valley, beach with open sky, starry night (with labels)
3. **Timing Options** - April 2026, July 2026, Oct 2026, Flexible
4. **HD Form Images** - All form step images at w=1920&q=90
5. **Success Page** - Logo, checkmark, "You're on Your Way!", motivational quote
6. **Duplicate Image Fix** - Mindful Connection now uses a unique community image
7. **Title Fix** - "Who Is This For?" replaces the repetitive subtitle

## Next Action Items
1. 🟠 P1: Integrate Resend email notifications (need API key)
2. 🟡 P2: Replace "[Contact Number]" placeholder
3. 🟡 P2: Refactor LandingPage.jsx into smaller components

## Future/Backlog
- Admin dashboard for submissions
- SEO optimization
