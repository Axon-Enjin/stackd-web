# Chapter 2 — The Admin CMS

The Admin CMS is a protected back-office application at `/cms`. It gives administrators the ability to manage all dynamic content displayed on the public-facing website — team members, certifications, and testimonials.

---

## Accessing the CMS

Navigate to: **`/cms/login`**

Enter your `username` and `password`. Credentials are managed entirely in the Supabase `user_credentials` table and are **not** tied to Supabase Auth.

> There is no self-registration. All admin users must be created by a system administrator using the `pnpm create-user` CLI script (see [Creating Admin Users](#creating-admin-users)).

---

## CMS Routes

| Route | Page | Description |
|-------|------|-------------|
| `/cms/login` | Login | Admin sign-in screen |
| `/cms` | Dashboard | Overview with cards linking to all content sections |
| `/cms/team-members` | Team Members | CRUD + reorder for team directory |
| `/cms/certifications` | Certifications | CRUD + reorder for certifications |
| `/cms/testimonials` | Testimonials | CRUD + reorder for client testimonials |
| `/cms/profile` | Profile | Change username or password |

---

## Shell Layout

**File:** `src/app/cms/layout.tsx`

All CMS pages (except `/cms/login`) share a persistent shell layout:

```
┌────────────────────────────────────────────────────┐
│  AdminTopbar  (sticky, 4rem height)                │
├──────────────┬─────────────────────────────────────┤
│              │                                     │
│ AdminSidebar │   <page content>                    │
│  (fixed,     │   (flex-1, min-h calc(100vh-4rem))  │
│  collapsible │                                     │
│  on mobile)  │                                     │
│              │                                     │
├──────────────┴─────────────────────────────────────┤
│  AdminFooter                                       │
└────────────────────────────────────────────────────┘
```

### Route Protection

The CMS layout checks authentication on every render via the `useUserStore` Zustand store. If a user is not authenticated and is not on the `/cms/login` page, they are redirected to `/cms/login`. A loading spinner is shown while the session is being verified.

```ts
useEffect(() => {
  if (!loading && !user && pathname !== "/cms/login") {
    router.push("/cms/login");
  }
}, [user, loading, pathname, router]);
```

---

## Dashboard — `/cms`

**File:** `src/app/cms/page.tsx`

The dashboard displays card links to each content section. Clicking a card navigates to the corresponding management page.

| Card | Icon | Destination |
|------|------|-------------|
| Team Members | Users | `/cms/team-members` |
| Certifications | Award | `/cms/certifications` |
| Testimonials | MessageSquareQuote | `/cms/testimonials` |
| View Live Website | Globe (teal) | Opens `/` in new tab |

---

## Team Members — `/cms/team-members`

**File:** `src/app/cms/team-members/page.tsx`

### Features

- **List view** with pagination (10 per page by default)
- **Add member** — form with fields: First Name, Middle Name (optional), Last Name, Role, Bio, LinkedIn URL (optional), Achievements (dynamic list), Profile Photo
- **Edit member** — pre-filled form with option to replace the profile photo
- **Delete member** — confirmation dialog before irreversible deletion
- **Reorder** — "Sort Order" button opens the `SortContentsModal` with drag-and-drop reordering; changes persist to the database immediately

### Profile Photo Processing

When a profile photo is uploaded, the `FileSystemModule` automatically:
1. Uploads the original to Firebase Storage
2. Generates three resized variants: `64px`, `256px`, `512px`
3. Stores all four URLs in the database

The public site uses the `256px` or `512px` variant for performance.

---

## Certifications — `/cms/certifications`

**File:** `src/app/cms/certifications/page.tsx`

### Features

- **List view** with pagination
- **Add certification** — form: Title, Description, Image
- **Edit certification** — update text fields and/or replace the image
- **Delete certification** — removes the record and deletes the image from Firebase Storage
- **Reorder** — drag-and-drop sort order via `SortContentsModal`

### What is a Certification?

A certification represents a professional or technical credential that Stackd holds (e.g., TikTok Shop certifications, platform badges). Each entry has:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Name of the certification |
| `description` | string | Short description or issuing body |
| `imageUrl` | string | Badge or certificate image |
| `rankingIndex` | number | Sort position (lower = appears first) |

---

## Testimonials — `/cms/testimonials`

**File:** `src/app/cms/testimonials/page.tsx`

### Features

- **List view** with pagination
- **Add testimonial** — form: Client Name, Role/Title (optional), Company (optional), Quote Body, Person Photo, Company Logo (optional)
- **Edit testimonial** — update all fields, replace either image
- **Delete testimonial** — removes the record and both images from storage
- **Reorder** — drag-and-drop sort order via `SortContentsModal`

### Testimonial Data Structure

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Client's full name |
| `role` | string \| null | Job title or role |
| `company` | string \| null | Company name |
| `body` | string | The quote / testimonial text |
| `imageUrl` | string | Client's photo |
| `companyLogoUrl` | string \| null | Optional company logo |
| `rankingIndex` | number | Sort position |

Both `imageUrl` and `companyLogoUrl` have `64px`, `256px`, and `512px` variants automatically stored.

---

## Sort / Reorder — `SortContentsModal`

**File:** `src/components/cms/SortContentsModal.tsx`

A reusable drag-and-drop reorder modal shared across all three content types. It uses `@dnd-kit/core` and `@dnd-kit/sortable`.

### How it Works

1. Clicking **"Sort Order"** fetches **all** items (`?all=true` query flag) regardless of current pagination
2. Items are displayed in a vertical sortable list with drag handles
3. Dragging an item updates its position in the local state
4. Clicking **"Save Order"** sends `PATCH` requests to update each item's `rankingIndex` in the database
5. The public site reads items in ascending `rankingIndex` order

---

## Profile — `/cms/profile`

**File:** `src/app/cms/profile/page.tsx`

Allows the logged-in admin to update their own credentials. The page has three view modes:

| Mode | Description |
|------|-------------|
| `details` | Shows current username and account ID with action buttons |
| `change-username` | Form to set a new username (requires current password to confirm) |
| `change-password` | Form to set a new password (requires current password) |

Changes are submitted to `POST /api/custom-auth/update-profile` with an `action` field (`change-username` \| `change-password`).

---

## Creating Admin Users

Admin users are created via the CLI, **not** through the CMS UI. This is intentional — user management is an infrastructure concern, not a content management concern.

```bash
pnpm create-user
```

The script (`scripts/create-user.ts`) will:
1. Prompt for a `username`
2. Prompt for a `password`
3. Hash the password with bcrypt (10 rounds)
4. Call `CreateUserUseCase` directly (uses the real application logic)
5. Insert the user into the `user_credentials` table in Supabase

The user can then log in immediately at `/cms/login`.

---

## CMS Shell Components Reference

### `AdminTopbar`
**File:** `src/components/cms/AdminTopbar.tsx`

- Displays the Stackd logo
- Shows the current admin's username from `useUserStore`
- Contains a mobile hamburger button (calls `onToggleSidebar` prop)
- Contains a user dropdown with "Profile" and "Logout" options

### `AdminSidebar`
**File:** `src/components/cms/AdminSidebar.tsx`

Navigation links with active state highlighting:

| Label | Route | Icon |
|-------|-------|------|
| Dashboard | `/cms` | LayoutDashboard |
| Team Members | `/cms/team-members` | Users |
| Certifications | `/cms/certifications` | Award |
| Testimonials | `/cms/testimonials` | MessageSquareQuote |

On mobile: the sidebar is an overlay drawer controlled by `isOpen` prop. Clicking outside (or the close button) calls `onClose`.

### `AdminFooter`
**File:** `src/components/cms/AdminFooter.tsx`

Minimal footer shown at the bottom of every CMS page with version/copyright info.

### `LogoutButton`
**File:** `src/components/cms/LogoutButton.tsx`

Calls `useUserStore().logout()` which:
1. Calls `POST /api/custom-auth/logout` (server-side)
2. Removes the token from `localStorage`
3. Sets `user: null` in Zustand state
4. CMS layout detects the null user and redirects to `/cms/login`

### `Pagination`
**File:** `src/components/cms/Pagination.tsx`

Reusable pagination component used by all content list pages. Accepts `currentPage`, `totalPages`, and an `onPageChange` callback.

---

## State Management in the CMS

### Zustand — `useUserStore`

**File:** `src/store/useUserStore.ts`

Global client-side auth store. State shape:

```ts
{
  user: { id: string; username: string } | null;
  loading: boolean;
  initialize: () => Promise<void>;  // Called once on app start
  login: (user, token?) => void;    // Sets user, stores token in localStorage
  logout: () => Promise<void>;      // Clears token, calls logout API
}
```

### TanStack Query

Data fetching for CMS lists uses TanStack Query for caching, background refetch, and loading states. Each content section has custom hooks in `src/features/<Feature>/hooks/`.

---

## Email Testing

During development, you can verify that Resend is configured correctly:

```bash
pnpm test-email
```

This runs `scripts/test-email.ts` which sends a test email using your `RESEND_API_KEY`.
