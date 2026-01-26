# Portfolio Project Context

> This file preserves project state for continuity across sessions.

## Project Overview

Next.js 16 portfolio with Tailwind CSS v4, React 19, and motion animations. Content is markdown-based with frontmatter stored in `src/content/`.

## Typography

- **Display font**: Playwrite US Trad (name, section titles)
- **Body font**: Carrois Gothic SC (small caps aesthetic)
- **Mono font**: Geist Mono (code blocks)

## Current State [2026-01-26]

### Completed Features

1. **Homepage Redesign**
   - Hero section with Playwrite font for name
   - Three curated sections: Things Made, Things You Need To Read, What I'm Reading
   - Unified `ShowcaseCard` component (3:4 aspect ratio, viewport-aware)
   - Modal for project details

2. **Navigation**
   - Header: "Your Name" | Search bar (expanded) | Posts | RSS | Theme toggle
   - Removed redundant "Home" link (logo serves as home)
   - Search dropdown with keyboard navigation (↑↓ navigate, Enter select, Esc close)

3. **Posts Page**
   - Received stats section from homepage (Posts Written, Categories, Topics)
   - Explore by Category section
   - Featured, Recent, Archive sections

4. **Content System**
   - Tag-based queries: `getProjectsForShowcase()`, `getEvergreenReads()`, `getCurrentlyReading()`
   - Sample content with proper tags created

### Tag Patterns
```yaml
modal-product-{1,2,3}    # Things Made (projects)
{year}-read-evergreen    # Things You Need To Read (reviews)
currently-reading        # What I'm Reading (reviews)
```

## Quick Commands

```bash
bun dev          # Development server
bun run build    # Production build
bunx tsc --noEmit # Type check
bun run lint     # Lint
```

## Key Files

```
src/
├── app/
│   ├── layout.tsx            # Fonts, metadata, providers
│   ├── page.tsx              # Homepage with 3 sections
│   └── posts/
│       ├── page.tsx          # Posts listing with stats
│       └── [slug]/page.tsx   # Post detail
├── components/
│   ├── ShowcaseCard.tsx      # Unified 3:4 card (project/evergreen/reading variants)
│   ├── Modal.tsx             # Animated modal for projects
│   ├── Search.tsx            # Dropdown search with keyboard nav
│   ├── Header.tsx            # Navigation with expanded search
│   └── homepage/
│       ├── ThingsMade.tsx
│       ├── ThingsToRead.tsx
│       └── CurrentlyReading.tsx
├── lib/
│   └── posts.ts              # Content queries + showcase helpers
└── types/
    └── post.ts               # Type definitions
```

## Schema & SEO [COMPLETE]

- [x] Created `JsonLd` component with schema generators
- [x] Homepage: WebSite + Person schemas
- [x] Posts page: Blog schema
- [x] Post detail: Article schema (or Recipe schema for recipes)
- [x] Enhanced metadata in layout.tsx (Open Graph, Twitter, robots, keywords)
- [x] Site config in `src/components/JsonLd.tsx` (update name, url, social handles)

## Next Steps

- [ ] Create `/public/og-image.jpg` (1200x630)
- [ ] Update `siteConfig` in JsonLd.tsx with real values
- [ ] Set `NEXT_PUBLIC_SITE_URL` environment variable
- [ ] Test responsive layouts
- [ ] Add real project/book images

---
*Updated: 2026-01-26*
