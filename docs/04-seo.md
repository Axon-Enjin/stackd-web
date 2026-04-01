# Chapter 4 — SEO & Indexing

This chapter documents the SEO architecture of the Stackd website — how metadata is structured, how crawlers are guided, and how to maintain good standing with Google Search.

---

## Overview

SEO is implemented in three layers:

| Layer | Responsibility |
|-------|---------------|
| **`src/configs/seo.ts`** | Central configuration — site name, URL, description, keywords, OG image |
| **`src/app/layout.tsx`** | Root-level metadata — robots rules, OG defaults, Twitter card, GSC verification |
| **Each `page.tsx`** | Per-page metadata — title, description, canonical, page-specific OG |

---

## Central SEO Config

**File:** `src/configs/seo.ts`

All shared site-wide values live here. Import `siteConfig` into any page metadata rather than hardcoding strings.

```ts
export const siteConfig = {
  name: "Stackd",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.stackdpartners.com",
  ogImage: `${...}/og-image.png`,   // Must be a 1200×630px image
  description: "Stackd is a revenue operations partner...",
  keywords: ["TikTok Shop", "revenue operations", ...],
};
```

> **Important:** `NEXT_PUBLIC_SITE_URL` must be set in Vercel environment variables to the canonical production URL — `https://www.stackdpartners.com` (with www, no trailing slash).

---

## Root Layout Metadata

**File:** `src/app/layout.tsx`

The root layout defines metadata that cascades to all pages unless overridden.

### Title Template

```ts
title: {
  default: "Stackd | TikTok Shop Revenue Operations",
  template: "%s | Stackd",
},
```

Child pages that set `title: "Book a Call"` automatically render as `"Book a Call | Stackd"`.

### Robots

```ts
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
},
```

The `/cms/` and `/api/` paths are blocked via `robots.ts` (see below).

### Canonical Tags

**Do not set `alternates.canonical` in the root layout.** Each `page.tsx` sets its own canonical:

```ts
// src/app/page.tsx
alternates: { canonical: "/" }

// src/app/book/page.tsx
alternates: { canonical: "/book" }

// src/app/team/page.tsx
alternates: { canonical: "/team" }
```

Setting a root-level canonical bleeds onto all child pages and overrides their correct per-page values — this was a prior bug that caused indexing issues.

### Google Search Console Verification

```ts
verification: {
  google: "8Qn7UtynOUUSZu4d3TykhaXyffKY_zTZ0Ikl8Y842Q0",
},
```

This renders as `<meta name="google-site-verification" content="...">` and unlocks GSC ownership so you can request re-indexing and view crawl reports.

---

## Per-Page Metadata

Every public `page.tsx` exports a `metadata` object (or `generateMetadata` for dynamic routes).

### Static Page Example (`/book`)

```ts
export const metadata: Metadata = {
  title: "Book a Free TikTok Shop Revenue Review",
  description: "Schedule a free 30-minute TikTok Shop Revenue Review...",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a Free TikTok Shop Revenue Review | Stackd",
    description: "...",
    url: `${siteConfig.url}/book`,
    type: "website",
  },
};
```

### Dynamic Route Example (`/team/[slug]`)

**File:** `src/app/team/[slug]/page.tsx`

Dynamic routes use `generateMetadata` which receives the resolved `params` and fetches server-side data:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const member = await teamMembersModuleController.getMemberByName(slug);

  return {
    title: `${fullName} — ${member.role}`,
    description: member.bio.slice(0, 155) + "…",
    alternates: { canonical: `/team/${slug}` },
    openGraph: { ... },
  };
}
```

### Static Pre-rendering (`generateStaticParams`)

Team member pages are **statically generated at build time** using `generateStaticParams`:

```ts
export async function generateStaticParams() {
  const members = await teamMembersModuleController.listAllMembers();
  return members.map((m) => ({
    slug: `${m.firstName}-${m.lastName}`.toLowerCase(),
  }));
}
```

This means Googlebot receives complete HTML (with name, role, bio) without executing JavaScript — previously these pages were client-rendered (`"use client"`) and Googlebot saw only a loading spinner.

---

## Structured Data (JSON-LD)

Structured data is injected as `<script type="application/ld+json">` directly in page components (not in layout, since schemas are page-specific).

| Page | Schema Type | Purpose |
|------|------------|---------|
| `/` | `Organization` | Site-wide brand entity |
| `/` | `WebSite` | Enables Sitelinks search box signal |
| `/` | `FAQPage` | Rich results for FAQ section |
| `/book` | `Service` + `Offer` | Booking page rich results |

To add structured data to a new page:

```tsx
const mySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "...",
};

export default function MyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mySchema) }}
      />
      {/* page content */}
    </>
  );
}
```

---

## Sitemap

**File:** `src/app/sitemap.ts`

The sitemap is auto-served at `/sitemap.xml` by Next.js.

```ts
const ROUTE_META = [
  { path: "",        lastModified: "2026-04-01", priority: 1.0 },
  { path: "/book",   lastModified: "2026-04-01", priority: 0.9 },
  { path: "/team",   lastModified: "2026-03-01", priority: 0.7 },
  { path: "/privacy",lastModified: "2026-01-01", priority: 0.3 },
  { path: "/terms",  lastModified: "2026-01-01", priority: 0.3 },
];
```

**Rule:** Always use hardcoded `lastModified` dates. Setting `new Date().toISOString()` makes every date "today", which Google treats as a fake freshness signal and may deprioritise. Update the date only when you meaningfully change that page's content.

---

## Robots

**File:** `src/app/robots.ts`

Auto-served at `/robots.txt`.

```ts
rules: {
  userAgent: "*",
  allow: ["/", "/_next/static/"],
  disallow: ["/cms/", "/api/"],
},
sitemap: `${siteConfig.url}/sitemap.xml`,
```

The CMS and API routes are blocked from crawling. All public-facing routes are crawlable.

---

## Canonical Domain Redirect

**File:** `next.config.ts`

Any request to the bare domain (`stackdpartners.com`, without www) is permanently redirected to the canonical www version:

```ts
async redirects() {
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: "stackdpartners.com" }],
      destination: "https://www.stackdpartners.com/:path*",
      permanent: true, // 308 — tells Google to update its index permanently
    },
  ];
},
```

This fixes the **"Redirect error"** that caused deindexing — Googlebot was hitting `http://stackdpartners.com/` and encountering a broken redirect chain with no defined destination.

**Vercel domain settings must also be configured** so that `stackdpartners.com` (non-www) is assigned as a redirect to `www.stackdpartners.com` in the Vercel dashboard under **Project → Settings → Domains**.

---

## Favicon & PWA Icons

**Architecture:** Next.js App Router auto-detects icon files placed directly in `src/app/` and generates the correct `<link>` tags without manual configuration.

| File | Location | Purpose |
|------|----------|---------|
| `favicon.ico` | `src/app/` | Browser tab icon |
| `icon.svg` | `src/app/` | Vector icon (best quality) |
| `icon.png` | `src/app/` | 96×96 raster fallback |
| `apple-icon.png` | `src/app/` | 180×180 Apple touch icon |
| `web-app-manifest-192x192.png` | `public/` | PWA home screen icon |
| `web-app-manifest-512x512.png` | `public/` | PWA splash icon |
| `site.webmanifest` | `public/` | PWA manifest (name, theme color, icons) |

The manifest is linked via a `<link rel="manifest">` in the root layout `<head>`.

To update icons, replace the files above and redeploy — no code changes required.

---

## Requesting Re-Indexing

After any significant SEO change (new pages, canonical fixes, redirect fixes), submit for re-indexing:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. **URL Inspection** → paste `https://www.stackdpartners.com/` → **Request Indexing**
3. **Sitemaps** → submit `https://www.stackdpartners.com/sitemap.xml`
4. Monitor the **Coverage** report for any "Crawled - currently not indexed" or "Redirect error" entries

---

## Adding SEO to a New Page

Checklist when creating a new public-facing `page.tsx`:

- [ ] Export `metadata` with `title`, `description`, and `alternates.canonical`
- [ ] Add an `openGraph` block with `title`, `description`, `url`, and `type`
- [ ] Add the route to `sitemap.ts` with a hardcoded `lastModified` date
- [ ] Consider whether structured data (JSON-LD) is appropriate for the page type
- [ ] Ensure the page is a **Server Component** (not `"use client"`) so Googlebot sees the content
- [ ] If the page has dynamic content, use `generateMetadata` instead of `export const metadata`

---

## Incident History — April 2026 Deindexing & Recovery

### What Happened

Google Search Console reported:

```
Page is not indexed: Redirect error
Page fetch: Failed — Redirect error
Referring page: http://stackdpartners.com/
```

The site had been indexed previously but was dropped after Google's crawl encountered a broken redirect chain on the non-www, non-HTTPS entry point (`http://stackdpartners.com/`). Googlebot could not reach the site at all.

### Root Causes Identified

| # | Problem | Root Cause |
|---|---------|-----------|
| 1 | **Redirect error** | `next.config.ts` had no redirect rules. Non-www requests had no defined destination — Vercel needs an explicit Next.js redirect or domain-level config to handle `stackdpartners.com` → `www.stackdpartners.com` |
| 2 | **Team pages invisible to Googlebot** | `src/app/team/[slug]/page.tsx` used `"use client"` with TanStack Query. Googlebot saw only a loading spinner — no title, no bio, no metadata |
| 3 | **`/team` route 404'd** | No `page.tsx` existed at `src/app/team/` but the URL was listed in `sitemap.ts` |
| 4 | **Root canonical bleed** | `layout.tsx` had `alternates: { canonical: "/" }` which overrode child pages' own canonical values |
| 5 | **No GSC verification** | The verification token was commented out — couldn't request re-indexing or see crawl errors |
| 6 | **Fake sitemap dates** | `lastModified: new Date().toISOString()` — every entry showed today's date on every crawl, a signal Google ignores |
| 7 | **Oversized favicon** | `public/favicon.ico` was 90KB — should be under 5KB |

---

### Step-by-Step Fixes Applied

#### Step 1 — Fix the redirect error (critical, do this first)

**File:** `next.config.ts`

Added `async redirects()` to permanently redirect any non-www request to the canonical www domain:

```ts
async redirects() {
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: "stackdpartners.com" }],
      destination: "https://www.stackdpartners.com/:path*",
      permanent: true,
    },
  ];
},
```

Also verify in **Vercel → Project → Settings → Domains** that `stackdpartners.com` has a redirect arrow pointing to `www.stackdpartners.com`.

---

#### Step 2 — Add Google Search Console verification

**File:** `src/app/layout.tsx`

```ts
verification: {
  google: "YOUR_TOKEN_FROM_GSC",
},
```

Get the token from: **Google Search Console → Settings → Ownership Verification → HTML tag method**.

---

#### Step 3 — Remove the root layout canonical

**File:** `src/app/layout.tsx`

Removed `alternates: { canonical: "/" }` from root metadata. This was overriding child pages. Each `page.tsx` sets its own canonical instead.

---

#### Step 4 — Convert `team/[slug]` from CSR to SSR

**Files:** `src/app/team/[slug]/page.tsx` and new `src/app/team/[slug]/TeamMemberContent.tsx`

The old page was a single `"use client"` file using `useTeamMemberByNameQuery`. Split into:

- **`page.tsx`** (Server Component) — fetches data server-side via `teamMembersModuleController.getMemberByName()`, exports `generateMetadata` and `generateStaticParams`
- **`TeamMemberContent.tsx`** (`"use client"`) — receives data as props, handles animations (`BlurFade`)

This ensures Googlebot receives complete HTML with name, role, and bio on every team member URL.

---

#### Step 5 — Create `/team` index page

**File:** `src/app/team/page.tsx` _(new file)_

The `/team` route was in the sitemap but returned a 404. Created a new Server Component page that:
- Exports `metadata` with title "Meet the Team" and canonical `/team`
- Fetches all members via `listAllMembers()` server-side
- Renders a grid of member cards, each linking to `/team/[slug]`

---

#### Step 6 — Fix sitemap dates

**File:** `src/app/sitemap.ts`

Replaced `new Date().toISOString()` with stable hardcoded dates per route. Added proper `priority` values (homepage: 1.0, book: 0.9, team: 0.7, legal: 0.3).

---

#### Step 7 — Replace favicon files

Used **[realfavicongenerator.net](https://realfavicongenerator.net)** to generate properly sized icons from the Stackd logo.

Placed files in their correct Next.js App Router locations:

```
src/app/favicon.ico          ← browser tab
src/app/icon.svg             ← vector (best quality)
src/app/icon.png             ← 96×96 raster
src/app/apple-icon.png       ← 180×180 Apple touch
public/web-app-manifest-192x192.png
public/web-app-manifest-512x512.png
public/site.webmanifest      ← updated name/colors
```

Removed the manual `icons` block from `layout.tsx` — Next.js auto-generates the tags.
Deleted old `public/favicon.ico` (was 90KB).

---

#### Step 8 — Deploy and request re-indexing

1. `git push` → deploy to Vercel
2. Open `http://stackdpartners.com` in a browser — verify it redirects to `https://www.stackdpartners.com`
3. **Google Search Console → Settings → Ownership Verification** → click **Verify**
4. **URL Inspection** → `https://www.stackdpartners.com/` → **Request Indexing**
5. **Sitemaps** → submit `https://www.stackdpartners.com/sitemap.xml`
6. Check back in 3–7 days under **Coverage** report

---

### Recovery Playbook (if deindexed again)

Follow these steps in order whenever GSC shows a crawl or indexing error:

**1. Read the GSC error carefully**

| Error | Likely Cause |
|-------|-------------|
| `Redirect error` | Broken redirect chain — check `next.config.ts` and Vercel domain settings |
| `Crawled - currently not indexed` | Thin content, CSR-only pages, or duplicate content |
| `Blocked by robots.txt` | Check `src/app/robots.ts` |
| `Page with redirect` | Old URL in index — submit correct canonical via URL Inspection |
| `Soft 404` | Page returns 200 but looks like a 404 to Google — add real content or return `notFound()` |

**2. Check for CSR pages on public routes**

Search for `"use client"` in `src/app/` (not features, not components — in pages specifically):

```bash
grep -r '"use client"' src/app --include="page.tsx"
```

Any public `page.tsx` with `"use client"` needs to be converted to a Server Component or split using the pattern in `team/[slug]/`.

**3. Verify the redirect chain**

```bash
curl -I http://stackdpartners.com
curl -I https://stackdpartners.com
curl -I https://www.stackdpartners.com
```

All three should eventually reach `https://www.stackdpartners.com/` with a `200`. Any loop or dead-end is the problem.

**4. Check for 404s in the sitemap**

Every URL in `src/app/sitemap.ts` must have a corresponding `page.tsx`. Mismatches cause Google to discredit the entire sitemap.

**5. Re-submit after every fix**

- Deploy → verify redirect works → GSC URL Inspection → Request Indexing
- Re-submit sitemap
- Wait 3–7 days and check Coverage report

