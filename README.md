# Stackd Web

**Stackd** is a revenue operations partner for direct-to-consumer brands scaling on TikTok Shop. This repository is the official marketing and operations web platform — a Next.js application that combines a public-facing landing page, a booking system for discovery calls, and a headless admin CMS for managing dynamic site content.

**Tech Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Zustand · TanStack Query · Google Calendar API · Firebase · Resend

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
3. [Environment Variables](#environment-variables)
4. [Key Commands](#key-commands)
5. [Architecture Overview](#architecture-overview)
6. [Features & Modules](#features--modules)
7. [API Reference](#api-reference)
8. [Admin CMS](#admin-cms)
9. [Authentication](#authentication)
10. [Documentation](#documentation)

---

## Project Structure

```
stackd-web/
├── public/               # Static assets (logos, icons)
├── scripts/              # CLI utility scripts (create-user, test-email)
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (root)/       # Public marketing pages
│   │   │   ├── page.tsx      # Landing page (/)
│   │   │   ├── book/         # Booking page (/book)
│   │   │   ├── team/         # Team page
│   │   │   ├── privacy/      # Privacy policy
│   │   │   └── terms/        # Terms of service
│   │   ├── api/          # API route handlers
│   │   │   ├── auth/
│   │   │   ├── booking/
│   │   │   ├── certifications/
│   │   │   ├── custom-auth/
│   │   │   ├── team-members/
│   │   │   └── testimonials/
│   │   └── cms/          # Admin CMS (protected, /cms)
│   │       ├── certifications/
│   │       ├── team-members/
│   │       ├── testimonials/
│   │       ├── profile/
│   │       └── login/
│   ├── components/       # Shared React components
│   │   ├── booking/      # Booking UI (CalendarBookingUI)
│   │   ├── cms/          # Admin shell (Sidebar, Topbar, Footer)
│   │   ├── layout/       # Navbar, Footer
│   │   ├── magicui/      # Animation & decorative UI
│   │   ├── sections/     # Landing page sections
│   │   ├── ui/           # Core UI primitives
│   │   └── widgets/      # Debug/dev widgets
│   ├── configs/          # Centralised environment config
│   ├── features/         # Feature modules (Clean Architecture)
│   │   ├── Auth/         # Custom auth + Supabase auth
│   │   ├── Booking/      # Calendar booking via Google API
│   │   ├── Certifications/
│   │   ├── FileSystem/   # Storage abstraction (Firebase/Supabase)
│   │   ├── TeamMembers/
│   │   └── Testimonials/
│   ├── hooks/            # Global custom hooks
│   ├── lib/              # Shared libraries
│   │   ├── api/          # API handler factory, rate limiter, requireAuth
│   │   ├── errors/       # HTTP error classes
│   │   └── supabase/     # Supabase client factories
│   ├── providers/        # React context providers (Query, Auth, Toast)
│   ├── store/            # Zustand global stores (useUserStore)
│   └── types/            # TypeScript types & Supabase-generated schemas
└── docs/                 # Extended documentation (see /docs)
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | ≥ 9 |
| Supabase project | Required |
| Google Cloud project | Required (Calendar API, OAuth) |
| Firebase project | Required (Storage) |
| Resend account | Required (email) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Axon-Enjin/stackd-web.git
cd stackd-web

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# → Fill in all required values (see Environment Variables section)

# 4. Generate Supabase types (requires Supabase CLI login)
pnpm run gen-types

# 5. Start the dev server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file at the project root. All variables below are required unless marked optional.

> **Security note:** Never commit `.env.local` or `.env`. The `SUPABASE_SECRET_KEY` and `FIREBASE_PRIVATE_KEY` are server-only; prefix them with `NEXT_PUBLIC_` only if they are safe to expose to the browser.

---

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Produce a production build |
| `pnpm start` | Serve the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm run gen-types` | Pull the latest Supabase schema and regenerate TypeScript types + Zod schemas |
| `pnpm create-user` | Interactive CLI to create a new CMS admin user |
| `pnpm test-email` | Send a test email via Resend to verify configuration |

---

## Architecture Overview

Every feature follows a **Clean Architecture** pattern with strict dependency inversion. Dependencies always point **inward** — Infrastructure → Application → Domain.

```
HTTP Request
    │
    ▼
API Route Handler (src/app/api/**/route.ts)
    │  uses createRegularHandler (rate limiting + auth)
    │
    ▼
Module Controller (*ModuleController.ts)
    │  maps primitives → use case inputs
    │  maps domain entities → response DTOs
    │
    ▼
Use Cases (useCases/*.ts)
    │  encapsulates a single business operation
    │  receives interfaces via constructor injection
    │
    ▼
Domain Entities (domain/*.ts)
    │  private constructor, static create/hydrate factories
    │  holds all business rules
    │
    ▼
Infrastructure (infrastructure/*.ts)
    │  implements domain interfaces
    │  talks to Supabase, Firebase, Google APIs, etc.
    │
    ▼
External Services (Supabase, Firebase, Google, Resend)
```

### Module Layout

Each feature module under `src/features/<Feature>/<Module>/` contains:

| File/Folder | Purpose |
|-------------|---------|
| `<Module>Controller.ts` | Public API of the module — no business logic |
| `useCases/` | One class per operation (e.g. `CreateCertificationUseCase`) |
| `domain/` | Entities and abstract repository/service interfaces |
| `infrastructure/` | Concrete implementations (Supabase repos, image services) |
| `index.ts` | Composition root — wires all dependencies and exports singleton controller |

### Cross-Module Communication

Modules **never** import each other's internals. If Module A depends on Module B, it receives the controller through interface injection. For example, `CertificationsModule` depends on `FileSystemModule` only by receiving `filesModuleController` as a constructor argument in `ImageService`.

---

## Features & Modules

### Auth — `src/features/Auth`

| Sub-module | Description |
|-----------|-------------|
| `CustomAuthModule` | Username/password authentication. JWT tokens stored in `localStorage` and sent as Bearer headers. Passwords hashed with bcrypt (10 rounds). Users stored in Supabase `user_credentials` table. |
| `AuthModule` | Supabase Auth integration (available for future use). |

Operations: `createUser` · `login` · `logout` · `verifyToken` · `changeUsername` · `changePassword` · `deleteUser`

### Booking — `src/features/Booking`

Calendar-based booking system backed by the **Google Calendar API**.

- Checks the admin's Google Calendar free/busy slots
- Filters to business hours (9 PM–12 AM business timezone, weekdays only)
- Creates a Google Calendar event with a **Google Meet** link for confirmed bookings
- Sends email invites to both attendee and admin via Google Calendar's built-in notifications
- Booking duration: **30 minutes**

Operations: `getAvailableSlots(date, timezone)` · `createBooking(name, email, startTime, timezone)`

### Certifications — `src/features/Certifications`

CRUD management for professional certifications displayed on the public site.

- Images uploaded to Firebase Storage via `FileSystemModule`
- Multiple image size variants stored (original, 64px, 256px, 512px thumbnails)
- Drag-and-drop reordering via `rankingIndex` (timestamp-based ordering)

Operations: `createCertification` · `getOneCertification` · `listCertifications` · `listAllCertifications` · `updateCertification` · `deleteCertification`

### Team Members — `src/features/TeamMembers`

Manages the team directory displayed on the site.

- Fields: `firstName`, `middleName`, `lastName`, `role`, `bio`, `linkedinProfile`, `achievements[]`
- Profile images uploaded with three auto-generated size variants
- Members can be looked up by name (`getMemberByName`) in addition to ID

Operations: `createMember` · `getOneMember` · `getMemberByName` · `listMembers` · `listAllMembers` · `updateMember` · `deleteMember`

### Testimonials — `src/features/Testimonials`

Manages client testimonials with support for both a **person photo** and a **company logo**.

- Fields: `name`, `role`, `company`, `body`
- Both images (person + logo) support multiple size variants
- Supports drag-and-drop reordering

Operations: `createTestimonial` · `getOneTestimonial` · `listTestimonials` · `listAllTestimonials` · `updateTestimonial` · `deleteTestimonial`

### FileSystem — `src/features/FileSystem`

Internal storage abstraction. Used by other modules (never called directly from API routes).

- Wraps Firebase Storage (primary) and records file metadata in Supabase
- Automatically generates `previewUrl` and size variants (`64`, `256`, `512`)
- Other modules inject `filesModuleController` into their `ImageService`

Operations: `uploadFile` · `getOneFileById` · `updateFileById` · `deleteFileById` · `deleteFileByPreviewUrl` · `listFilesWithPagination`

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require a `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/custom-auth/login` | ✗ | Login with username + password; returns JWT |
| `GET` | `/api/custom-auth/session` | ✗ | Verify current session token |
| `POST` | `/api/custom-auth/logout` | ✗ | Clear session |
| `POST` | `/api/custom-auth/register` | ✓ | Create a new admin user |
| `POST` | `/api/custom-auth/update-profile` | ✓ | Change username or password |
| `POST` | `/api/custom-auth/delete-user` | ✓ | Delete an admin user |

### Booking

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/booking/available?date=YYYY-MM-DD&timezone=IANA` | ✗ | List available time slots for a date |
| `POST` | `/api/booking` | ✗ | Create a booking (name, email, startTime, timezone) |

### Certifications

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/certifications?pageNumber=1&pageSize=10` | ✗ | Paginated list |
| `GET` | `/api/certifications?all=true` | ✗ | All certifications (for sort modal) |
| `POST` | `/api/certifications` | ✓ | Create (multipart/form-data: title, description, image) |
| `GET` | `/api/certifications/[id]` | ✗ | Get one certification |
| `PATCH` | `/api/certifications/[id]` | ✓ | Update certification |
| `DELETE` | `/api/certifications/[id]` | ✓ | Delete certification |

### Team Members

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/team-members?pageNumber=1&pageSize=10` | ✗ | Paginated list |
| `GET` | `/api/team-members?all=true` | ✗ | All members |
| `POST` | `/api/team-members` | ✓ | Create member (multipart) |
| `GET` | `/api/team-members/[id]` | ✗ | Get one member |
| `PATCH` | `/api/team-members/[id]` | ✓ | Update member |
| `DELETE` | `/api/team-members/[id]` | ✓ | Delete member |

### Testimonials

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/testimonials?pageNumber=1&pageSize=10` | ✗ | Paginated list |
| `GET` | `/api/testimonials?all=true` | ✗ | All testimonials |
| `POST` | `/api/testimonials` | ✓ | Create testimonial (multipart) |
| `GET` | `/api/testimonials/[id]` | ✗ | Get one testimonial |
| `PATCH` | `/api/testimonials/[id]` | ✓ | Update testimonial |
| `DELETE` | `/api/testimonials/[id]` | ✓ | Delete testimonial |

### Standard Response Shape

```json
{
  "status": "success" | "error",
  "message": "Human-readable description",
  "data": { ... },
  "meta": {
    "totalRecords": 42,
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

---

## Admin CMS

The CMS is accessible at `/cms` and is protected by client-side auth guard in `CMSLayout`. Authentication state is managed by `useUserStore` (Zustand).

| Route | Description |
|-------|-------------|
| `/cms/login` | Login screen (username + password) |
| `/cms` | Dashboard with shortcuts to all content sections |
| `/cms/team-members` | Manage team member records |
| `/cms/certifications` | Manage certification records |
| `/cms/testimonials` | Manage testimonial records |
| `/cms/profile` | Change admin username or password |

### CMS Shell Components

| Component | Description |
|-----------|-------------|
| `AdminTopbar` | Top navigation bar with user menu and mobile sidebar toggle |
| `AdminSidebar` | Left navigation; collapses on mobile |
| `AdminFooter` | Minimal footer |
| `SortContentsModal` | Drag-and-drop reorder modal (dnd-kit) shared across all content types |
| `Pagination` | Reusable pagination component |
| `LogoutButton` | Calls `/api/custom-auth/logout` and clears Zustand store |

### Creating the First Admin User

Admin users are **not** created through the CMS UI. Use the CLI script:

```bash
pnpm create-user
# → Prompts for username and password
# → Hashes password with bcrypt and inserts into Supabase
```

---

## Authentication

The system uses a **custom username/password JWT** scheme — not Supabase Auth — for CMS admin access.

### Flow

1. User submits username + password at `/cms/login`
2. `POST /api/custom-auth/login` validates credentials via bcrypt
3. A JWT is signed with `JWT_SECRET` and returned in the response body
4. Frontend stores the token in `localStorage` via `useUserStore`
5. `apiFetch` (in `src/lib/clientApi.ts`) automatically attaches the token as `Authorization: Bearer <token>` on every request
6. Protected API routes call `requireAuth()` which verifies the JWT via `customAuthModuleController.verifyToken()`

### Token Lifecycle

- Tokens are stored in `localStorage` (`auth_token` key)
- Session is validated on app start via `CustomAuthProvider` → `useUserStore.initialize()` → `GET /api/custom-auth/session`
- Logout clears `localStorage` and calls the server-side logout endpoint

---

## Documentation

Extended documentation is located in the [`/docs`](./docs) directory:

| File | Description |
|------|-------------|
| [`docs/01-website.md`](./docs/01-website.md) | Public website — pages, sections, booking flow |
| [`docs/02-cms.md`](./docs/02-cms.md) | Admin CMS — content management for team, certs, testimonials |
| [`docs/03-architecture.md`](./docs/03-architecture.md) | Deep-dive into Clean Architecture, modules, and data flow |