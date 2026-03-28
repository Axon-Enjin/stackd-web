# Chapter 1 — The Public Website

The public-facing website lives at the root route (`/`) and presents Stackd's brand, services, and booking system to potential clients. It is a **server-rendered, statically-optimised** Next.js application.

---

## Pages

### Landing Page — `/`

**File:** `src/app/page.tsx`

The landing page is composed of discrete section components assembled in a fixed order. Each section is a self-contained React component in `src/components/sections/`.

| Order | Section Component | Purpose |
|-------|------------------|---------|
| 1 | `HeroSection` | Above-the-fold hero, primary CTA |
| 2 | `FounderCredibilitySection` | Founder background and credibility signals |
| 3 | `ProblemSection` | Pain points of the target client |
| 4 | `WhyStackdExistsSection` | Origin story and mission |
| 5 | `OurPositionSection` | Stackd's differentiated position in the market |
| 6 | `WhoWeWorkWithSection` | Ideal client profile |
| 7 | `ProcessSection` | How Stackd works (step-by-step) |
| 8 | `FAQSection` | Frequently asked questions |
| 9 | `VisionValuesSection` | Vision and core values |
| 10 | `TestimonialSection` | Client testimonials (fetched from Supabase) |
| 11 | `FinalCTASection` | Bottom call-to-action |

#### Section IDs (for in-page navigation)

The following sections have explicit HTML `id` attributes for anchor linking from the `Navbar`:

| ID | Section |
|----|---------|
| `team` | FounderCredibilitySection wrapper |
| `why-stackd` | WhyStackdExistsSection wrapper |
| `our-position` | OurPositionSection wrapper |
| `how-we-work` | ProcessSection wrapper |
| `faq` | FAQSection wrapper |

---

### Booking Page — `/book`

**File:** `src/app/book/page.tsx`

A dedicated page for booking a free **30-minute TikTok Shop Revenue Review** call.

#### Page Structure

```
/book
├── Navbar
├── Hero Section (dark bg, interactive grid pattern)
│   ├── "Revenue Review" label
│   ├── Headline
│   ├── Description
│   └── Stats row (30 min · Free · Google Meet)
├── Main Booking Area
│   ├── "Schedule Your Call" heading
│   ├── CalendarBookingUI (interactive date + time picker)
│   └── "What to Expect" section (3-step explanation)
└── Footer
```

#### CalendarBookingUI Component

**File:** `src/components/booking/CalendarBookingUI.tsx`

The calendar booking widget is the core of this page. It handles the entire booking flow client-side with three stages:

1. **Date selection** — `react-day-picker` calendar; past dates and weekends are disabled
2. **Time slot selection** — Fetches available slots from `GET /api/booking/available?date=YYYY-MM-DD&timezone=IANA` using the visitor's detected local timezone
3. **Details form** — Collects name and email, submits to `POST /api/booking`

After submission, a success confirmation is shown with the booked date/time displayed in the visitor's local timezone.

**Timezone handling:** The component auto-detects the visitor's timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone` and passes it along with every request so slots are returned and displayed correctly regardless of the visitor's location.

---

### Team Page — `/team`

A dedicated team showcase page (separate from the landing page section).

---

### Legal Pages

| Route | Description |
|-------|-------------|
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

---

## Layout Components

### Navbar — `src/components/layout/Navbar.tsx`

- Responsive navigation with anchor links to landing page sections
- Includes "Book a Call" CTA button linking to `/book`
- Mobile hamburger menu
- Logo (uses `public/logo-*.png` variants)

### Footer — `src/components/layout/Footer.tsx`

- Branding and copyright
- Quick links to legal pages

---

## Testimonials on the Public Site

**File:** `src/components/sections/TestimonialSection.tsx`

The `TestimonialSection` component fetches live testimonial data from the API at build/request time. It uses optimised image URLs (the `256px` variant) for fast loading while linking to the original if needed.

Testimonials are sorted by `rankingIndex` which is controlled via the CMS drag-and-drop sort modal.

---

## MagicUI Components

**Directory:** `src/components/magicui/`

These are animation and decorative components used throughout the site:

| Component | Used In | Effect |
|-----------|---------|-------|
| `BlurFade` | Booking page | Staggered fade-in on scroll/load |
| `InteractiveGridPattern` | Booking page hero | Mouse-reactive grid background |

These are performance-conscious wrappers around `motion` (Framer Motion) library primitives.

---

## SEO & Metadata

**File:** `src/app/layout.tsx`

Global metadata is defined using Next.js's `Metadata` API:

```ts
export const metadata: Metadata = {
  title: "Stackd",
  description: "Stackd is a revenue operations partner for direct-to-consumer brands scaling on TikTok Shop...",
  keywords: ["TikTok Shop", "revenue operations", "live commerce", ...],
};
```

Per-page metadata can be added in each page file using the same pattern.

- **Font:** Inter (Google Fonts), loaded via `next/font/google`, weights 300–900
- **Analytics:** Vercel Analytics is injected globally in `RootLayout` via `<Analytics />`

---

## Global Providers

**File:** `src/providers/ProviderCompose.tsx`

All React context providers wrap the app in this order (outermost first):

| Provider | Responsibility |
|----------|---------------|
| `CustomAuthProvider` | Initialises the Zustand `useUserStore` on app start (calls `GET /api/custom-auth/session`) |
| `SupabaseAuthProvider` | Initialises the Supabase client-side auth state |
| `GoogleOAuthProvider` | Provides Google OAuth context (`@react-oauth/google`) |
| `QueryProvider` | TanStack Query `QueryClient` with default config |
| `ToastProvider` | `react-toastify` container |

---

## Development Widgets

When `NEXT_PUBLIC_ENVIRONMENT=DEVELOPMENT`, two additional components are rendered:

| Widget | Purpose |
|--------|---------|
| `BreakpointIndicator` | Shows the current Tailwind breakpoint (sm/md/lg/xl/2xl) in the corner |
| `DebugNavigator` | Floating panel for quick navigation between routes during development |

These are **never rendered in production**.
