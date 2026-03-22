# GEMINI.md - Stackd Web Project Context

## Project Overview
**Stackd Web** is a modern Next.js application built with a focus on clean architecture and high-performance web standards. It serves as the web platform for "Stackd," incorporating a CMS, booking system, and various business-related sections.

### Main Technologies
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Styling:** Tailwind CSS v4, Motion (framer-motion)
- **Database & Auth:** Supabase (SSR, PostgreSQL)
- **State Management:** TanStack Query (Server State), Zustand (Client State)
- **Services:** Firebase, Resend (Email), Google APIs (Calendar/Auth)
- **Validation:** Zod

---

## Architecture & Development Conventions

### Feature-Based Clean Architecture
The project follows a modular, feature-based architecture located in `src/features`. Each module is structured to separate concerns:

1.  **Controller (`*ModuleController.ts`):** The public entry point for the module, mapping domain entities to response DTOs.
2.  **Use Cases (`useCases/`):** Orchestrates business logic. Each use case typically handles a single operation.
3.  **Domain (`domain/`):** Contains core business entities and logic.
4.  **Infrastructure (`infrastructure/`):** Handles external concerns like database persistence (Repositories) or third-party services.
5.  **Composition Root (`index.ts`):** Wire up dependencies and exports the singleton controller instance.

**Example Path:** `src/features/Certifications/CertificationsModule/`

### API Layer
- **Handlers:** Located in `src/app/api`.
- **Wrapper:** Uses `createRegularHandler` from `@/lib/api/createHandler` for consistent error handling, rate limiting, and auth checks.
- **Return Format:** Standardized JSON responses with `status`, `message`, and `data`.

### Frontend Patterns
- **Components:** Split between global `src/components` (UI, Layout) and feature-specific components within `src/features`.
- **Hooks:** Custom hooks for data fetching (TanStack Query) are located in `src/features/[Feature]/hooks`.
- **State:** Zustand stores in `src/store` for global UI state (e.g., `useUserStore`).

---

## Building and Running

### Key Commands
- **Development:** `pnpm dev`
- **Build:** `pnpm build`
- **Linting:** `pnpm lint`
- **Type Generation (Supabase):** `pnpm run gen-types`
    - Fetches latest schema from Supabase and generates TypeScript definitions and Zod schemas.

### Authentication & Security
- **Middleware:** `src/middleware.ts` protects `/cms` routes by redirecting unauthenticated users to `/cms/login` using Supabase Auth.
- **API Security:** Use the `requireAuth` middleware or the `auth` option in `createRegularHandler` for server-side protection. Role authorization is handled within API routes.

---

## Technical Standards
- **Type Safety:** Strict TypeScript usage. Ensure all API responses and domain entities are properly typed.
- **Surgical Edits:** When modifying features, respect the `Controller -> UseCase -> Repository` flow. Do not bypass the architecture by putting business logic directly in API routes.
- **Styling:** Use Tailwind CSS v4 utility classes. Prefer `clsx` and `tailwind-merge` for dynamic class names.
- **Authentication:** Follow the Supabase SSR patterns for server-side operations and hooks for client-side state.



## 4. CLEAN ARCHITECTURE 
Dependencies MUST point INWARD toward the Domain.

### A. Presentation Layer 
- the presentation layer is the next application itself

### B. Application Layer (`features/featureName/<ModuleName>/`)
- **Role:** Core business logic.
- **Constraint:** Must be completely agnostic to external frameworks, databases, or HTTP contexts. Dependencies flow *inward*. Modules cannot directly call other modules (must use injected interfaces).
- **Coupling:** To avoid coupling between modules, they should not directly depend on one another. Modules should treat other modules as an external services, which means that you have to create an interface to use the other modules. Interface implementations can only then use the controller of the module you need to use. and it must be injected as well.
- **`useCases/`:** Orchestrates logic. One class per operation. Must accept required external dependencies via constructor injection (e.g., `constructor(private readonly repo: IStudyJamRepository) {}`). Must do everything needed to do its job (independent), meaning it should not depend on users having to do a separate operation before the useCase can be invoked.
- **`<Module>Controller.ts`:** Adapts primitive inputs to Use Cases. NO BUSINESS LOGIC. This is what other modules and layers see. Everything must pass through the controller instead of directly to the use case or repositories. The methods of the controller should exactly match the names of the use cases, but not including the "useCase" words.
- **`domain/I<Name>Repository.ts`:** Abstract contracts for persistence/external services.

### C. Domain Entities (`features/featureName/<ModuleName>/domain/`)
- **Role:** Enforces state and validation securely. Agnostic to DBs/frameworks.
- **Constraint:** MUST use `private constructor`. State mutation ONLY via controlled methods (`update(props)`). 
- **Constraint:** MUST use static factories: `create(props)` for new entities, `hydrate(props)` for existing DB data.
* Must encapsulate own state. Never rely on DB for ID or timestamp generation.
* Must use `private _props` to prevent direct mutation.
* Must use `private constructor`.
* Must expose `static create(props: InsertProps)` (for new items) and `static hydrate(props: Props)` (for loading from DB).
* Must handle mutations via controlled methods (e.g., `update(props: UpdateProps)`).

### D. Infrastructure Layer (`features/featureName/<ModuleName>/infrastructure/`)
- **Role:** Implements Application Interfaces (e.g., Supabase Repositories).
- **Constraint:** ABSOLUTELY NO BUSINESS LOGIC. Transforms DB schema to Domain objects and vice versa. Do NOT modify the domain object reference passed to `saveNew()` or `persistUpdates()`.

### E. Dependency Injection Flow
1. Instantiate Infra (`new SupabaseRepo()`).
2. Inject into Use Case (`new UseCase(repo)`).
3. Inject into App Controller (`new ModuleController(useCase)`).
4. HTTP Controller calls App Controller.