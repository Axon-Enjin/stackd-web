# Chapter 3 — Architecture Deep-Dive

This document explains the architectural decisions behind Stackd Web, how data flows through the system, and how to extend the codebase while respecting established patterns.

---

## Guiding Principle: Clean Architecture

The project follows Robert C. Martin's **Clean Architecture**. The single most important rule is:

> **Dependencies always point inward.**
>
> Outer layers (Infrastructure, HTTP Routes) can depend on inner layers (Application, Domain).  
> Inner layers **never** depend on outer layers.

```
┌─────────────────────────────────────────┐
│        Infrastructure (outermost)        │ ← Supabase, Firebase, Google APIs
│  ┌───────────────────────────────────┐  │
│  │       Application Layer           │  │ ← Controllers, Use Cases
│  │  ┌─────────────────────────────┐  │  │
│  │  │       Domain (innermost)     │  │  │ ← Entities, Interfaces
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

This means:
- Domain entities have **zero** imports from Next.js, Supabase, or any external library
- Use cases depend only on domain interfaces they define themselves
- Repositories are abstract contracts in the domain, implemented concretely in infrastructure
- API route handlers are thin — they parse HTTP input and hand off to a controller

---

## Module Structure

Every feature lives in `src/features/<Feature>/<Module>/` and follows an identical layout:

```
<Module>/
├── <Module>Controller.ts      ← Public API of the module
├── index.ts                   ← Composition root (wires DI, exports singleton)
├── domain/
│   ├── <Entity>.ts            ← Domain entity class
│   ├── I<Entity>Repository.ts ← Abstract repository interface
│   └── I<Service>.ts          ← Abstract service interface (if applicable)
├── useCases/
│   ├── Create<Entity>UseCase.ts
│   ├── Update<Entity>UseCase.ts
│   ├── Delete<Entity>UseCase.ts
│   ├── GetOne<Entity>UseCase.ts
│   └── List<Entities>.ts
└── infrastructure/
    ├── <Entity>Repository.ts  ← Concrete Supabase implementation
    └── <Service>.ts           ← Concrete service implementation
```

---

## Layer Responsibilities

### Domain Layer

**Location:** `<Module>/domain/`

The domain layer is the heart of the application. It contains:

#### 1. Entity Classes

Entities enforce business invariants and own their state. They follow strict conventions:

```ts
// ✅ Required patterns
export class Certification {
  private _props: CertificationProps;       // Private props
  private constructor(props: CertificationProps) { ... } // Private constructor

  get props() { return this._props; }       // Read-only getter

  // Factory for NEW entities (generates UUID + timestamp)
  static create(imageUrl: string, dto: CertificationCreateDTO): Certification { ... }

  // Factory for LOADING from DB (no side-effects, exact data)
  static hydrate(props: CertificationProps): Certification { ... }

  // Controlled mutation
  update(dto: CertificationUpdateDTO): void { ... }
  setImageUrl(url: string): void { ... }
}
```

Key constraints:
- **`private constructor`** — prevents `new Entity()` from outside; all creation goes through factories
- **`static create()`** — generates UUID (`crypto.randomUUID()`) and timestamp (`Date.now()`) for new records; never relies on the database to generate these
- **`static hydrate()`** — reconstitutes an entity from persisted data; no side-effects
- **`private _props`** — prevents direct mutations; state changes only via named methods

#### 2. Repository Interfaces

Abstract contracts that define what persistence operations are available:

```ts
export abstract class ICertificationRepository {
  abstract saveNewCertification(certification: Certification): Promise<Certification>;
  abstract persistUpdates(certification: Certification): Promise<Certification>;
  abstract deleteById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Certification | null>;
  abstract listPaginated(page: number, pageSize: number): Promise<{ list: Certification[]; count: number }>;
}
```

These interfaces live in the domain but have **no implementation** here. The implementation is in Infrastructure.

#### 3. Service Interfaces

For non-persistence external concerns (storage, email, etc.):

```ts
export abstract class IImageService {
  abstract uploadFile(file: File): Promise<string>;   // Returns public URL
  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
```

---

### Application Layer

**Location:** `<Module>/useCases/` and `<Module>Controller.ts`

#### Use Cases

Each use case class handles **exactly one** business operation. It receives all external dependencies via constructor injection:

```ts
export class CreateCertificationUseCase {
  constructor(
    private readonly repo: ICertificationRepository,  // Injected interface
    private readonly imageService: IImageService,      // Injected interface
  ) {}

  async execute(dto: CertificationCreateDTO, image: File): Promise<Certification> {
    const imageUrl = await this.imageService.uploadFile(image);
    const entity = Certification.create(imageUrl, dto);
    await this.repo.saveNewCertification(entity);
    return entity;
  }
}
```

Rules:
- Use case must be **complete** — it handles everything needed for its operation
- Depends only on interfaces defined in the domain (not concrete classes)
- No knowledge of HTTP, Supabase, or Firebase

#### Module Controller

The controller is the **public API of the module**. Other modules and HTTP routes interact exclusively through the controller:

```ts
export class CertificationsModuleController {
  constructor(/* all use cases injected */ ) {}

  // Maps primitive inputs to use case inputs
  // Maps domain entities to plain response DTOs
  async createCertification(title: string, description: string, image: File) {
    const result = await this.createCertificationUseCase.execute({ title, description }, image);
    return this.mapCertificationToResponse(result); // Returns plain object, not domain entity
  }

  private mapCertificationToResponse(entity: Certification) {
    return { id: entity.props.id, title: entity.props.title, ... };
  }
}
```

Rules:
- **Zero business logic** — just method delegation and DTO mapping
- Method names mirror use case names (without "UseCase" suffix)
- Returns plain objects (DTOs), never domain entities, to callers

---

### Infrastructure Layer

**Location:** `<Module>/infrastructure/`

Contains concrete implementations of domain interfaces.

#### Repository Implementation (Supabase)

```ts
export class CertificationRepository implements ICertificationRepository {
  async saveNewCertification(certification: Certification): Promise<Certification> {
    const supabase = await createSupabaseServerClient(); // Or service role client
    
    // Map domain entity props to DB columns
    await supabase
      .from("certifications")
      .insert({
        id: certification.props.id,
        title: certification.props.title,
        // ...
      });
    
    return certification; // Return the same entity (do NOT modify it)
  }
}
```

Rules:
- **No business logic** — only DB CRUD and entity hydration
- Maps DB rows → domain entities using `Entity.hydrate()`
- Maps domain entities → DB rows when writing
- **Never** modifies the entity reference passed in (`saveNew`, `persistUpdates`)

#### Supabase Client Selection

The infrastructure layer uses two different Supabase client factories:

| Client | File | When to Use |
|--------|------|-------------|
| `createSupabaseServerClient()` | `lib/supabase/server.ts` | Cookie-based sessions; marks route as dynamic |
| `createSupabaseAnonymousClient()` | `lib/supabase/server.ts` | No session needed; enables Vercel Edge Cache |
| `createSupabaseServiceRoleClient()` | `lib/supabase/serviceRole.ts` | Admin operations; bypasses RLS |

> Use `createSupabaseAnonymousClient()` for public read operations (listing team members, testimonials) to enable Vercel's Edge Cache and achieve maximum performance.

---

### Composition Root

**Location:** `<Module>/index.ts`

This file is the **only place** where concrete classes are instantiated. It wires the dependency graph and exports the singleton controller:

```ts
// 1. Instantiate Infrastructure
const repo = new CertificationRepository();
const imageService = new ImageService(filesModuleController); // Cross-module via interface

// 2. Instantiate Use Cases (inject infra)
const createUseCase = new CreateCertificationUseCase(repo, imageService);
const deleteUseCase = new DeleteCertificationUseCase(repo, imageService);
// ...

// 3. Instantiate and export the Controller (inject use cases)
export const certificationsModuleController = new CertificationsModuleController(
  createUseCase,
  deleteUseCase,
  // ...
);
```

---

## Cross-Module Dependencies

Modules must **never** import from each other's internals. If Module A needs functionality from Module B:

1. Define an interface in Module A's domain (e.g., `IImageService`)
2. Create an infrastructure implementation in Module A that wraps Module B's **controller** (not internals)
3. Inject the controller via the composition root

**Example:** `CertificationsModule` needs to store images. It has `IImageService` in its domain, and `ImageService` in its infrastructure calls `filesModuleController.uploadFile()`.

```
CertificationsModule/domain/IImageService.ts      ← defines the contract
CertificationsModule/infrastructure/ImageService.ts ← implements it using filesModuleController
CertificationsModule/index.ts → ImageService(filesModuleController) ← injection
```

---

## HTTP Layer

**Location:** `src/app/api/**/route.ts`

API route handlers are thin orchestrators. They:
1. Parse HTTP request parameters (query strings, JSON body, FormData)
2. Validate and throw HTTP errors (`BadRequestError`, `UnprocessableEntityError`)
3. Call the appropriate module controller
4. Return a standardised JSON response

All routes are wrapped with `createRegularHandler`:

```ts
export const POST = createRegularHandler(
  async (req: NextRequest) => {
    // ... handler logic
    return NextResponse.json({ status: "success", data }, { status: 201 });
  },
  {
    limiter: { requestPerDuration: 10, durationSeconds: 60 }, // Optional override
    auth: { required: true },  // Enables requireAuth()
  },
);
```

### `createRegularHandler` Pipeline

```
Incoming Request
      │
      ▼
  Rate Limiter (RateLimiterMemory, per-IP)
      │ throws TooManyRequestsError on exceed
      ▼
  Auth Check (if auth.required = true)
      │ reads Authorization: Bearer <token>
      │ verifies JWT via customAuthModuleController.verifyToken()
      │ throws UnauthorizedError on failure
      ▼
  Handler Function
      │
      ▼
  Error Handler (catches all thrown errors, maps to HTTP responses)
      │
      ▼
  NextResponse
```

### Error Classes

**Location:** `src/lib/errors/HttpError.ts`

| Class | HTTP Status | When to Use |
|-------|-------------|-------------|
| `BadRequestError` | 400 | Missing or malformed input |
| `UnauthorizedError` | 401 | Missing/invalid auth token |
| `ForbiddenError` | 403 | Authenticated but not permitted |
| `NotFoundError` | 404 | Resource does not exist |
| `UnprocessableEntityError` | 422 | Input is well-formed but semantically invalid |
| `TooManyRequestsError` | 429 | Rate limit exceeded |

---

## Booking System Data Flow

The booking system is unique because it has no database — all state lives in Google Calendar.

```
Client: GET /api/booking/available?date=2026-04-01&timezone=America/New_York
      │
      ▼
bookingModuleController.getAvailableSlots("2026-04-01", "America/New_York")
      │
      ▼
GetAvailableSlotsUseCase.execute(date, timezone)
      │
      ▼
GoogleCalendarRepository.getAvailableSlots(date, timezone)
      │  ← Calls Google Calendar Freebusy API
      │  ← Filters to business hours (21:00-24:00 business timezone, Mon-Fri)
      │  ← Filters to exact date in CLIENT's timezone
      │  ← Removes past slots (now > slot start)
      ▼
Returns: Date[] (array of available UTC timestamps)


Client: POST /api/booking { name, email, startTime, timezone }
      │
      ▼
bookingModuleController.createBooking(...)
      │
      ▼
CreateBookingUseCase.execute(name, email, startTime, timezone)
      │
      ▼
GoogleCalendarRepository.createBooking(booking)
      │  ← Creates Google Calendar event
      │  ← Requests Google Meet link (conferenceData)
      │  ← Sends email invites via Google Calendar (sendUpdates: "all")
      ▼
Returns: Booking (with meet link and calendar event ID)
```

Business hours are configured in `GoogleCalendarRepository.ts` and can be adjusted there. The timezone for business hours is read from `BUSINESS_TIMEZONE` environment variable.

---

## File Storage System

The `FileSystemModule` provides a unified storage abstraction. It uses **Firebase Storage** as the primary storage backend while recording file metadata (URLs, paths, timestamps) in **Supabase**.

### Upload Flow

```
Other Module calls: filesModuleController.uploadFile(buffer, type, name, description, path)
      │
      ▼
UploadFile UseCase
      │  ← Creates FileBuffer domain object
      │  ← Uploads to Firebase Storage via IFileStorageService
      │  ← Generates signed/public URL
      │  ← Triggers image resizing (64px, 256px, 512px variants)
      │  ← Saves FileRecord to Supabase (with all variant URLs)
      ▼
Returns: FileRecord entity (with all URLs)
```

Other modules (Certifications, TeamMembers, Testimonials) call `filesModuleController` through their own `IImageService` abstraction, so they remain decoupled from the storage implementation details.

---

## Caching Strategy

| Data Type | Cache Approach |
|-----------|---------------|
| Public content (team, testimonials, certifications) | Next.js `revalidate` tag-based revalidation; uses anonymous Supabase client to enable Vercel Edge Cache |
| Booking slots | No cache — always fetched fresh from Google Calendar |
| CMS admin pages | No cache — always server-rendered dynamically |

On content mutations (POST / PATCH / DELETE), the relevant route calls `revalidateTag("certifications")` (or the equivalent tag) to purge the cache and ensure the public site reflects changes immediately.

---

## Adding a New Feature Module

Follow these steps to add a new CMS-manageable content type (e.g., "Case Studies"):

1. **Create the folder:** `src/features/CaseStudies/CaseStudiesModule/`

2. **Define the domain:**
   - `domain/CaseStudy.ts` — entity with `private constructor`, `static create()`, `static hydrate()`, `update()` methods
   - `domain/ICaseStudyRepository.ts` — abstract repository contract
   - (optional) `domain/ICaseStudyImageService.ts` — if images are needed

3. **Create use cases:**
   - `useCases/CreateCaseStudyUseCase.ts`
   - `useCases/UpdateCaseStudyUseCase.ts`
   - `useCases/DeleteCaseStudyUseCase.ts`
   - `useCases/GetOneCaseStudyUseCase.ts`
   - `useCases/ListCaseStudies.ts`

4. **Create infrastructure:**
   - `infrastructure/CaseStudyRepository.ts` — implements `ICaseStudyRepository` using Supabase
   - `infrastructure/CaseStudyImageService.ts` — implements image interface using `filesModuleController`

5. **Write the controller:**
   - `CaseStudiesModuleController.ts` — delegates to use cases, maps entities to DTOs

6. **Wire the composition root:**
   - `index.ts` — instantiates all classes, exports singleton `caseStudiesModuleController`

7. **Create API routes:**
   - `src/app/api/case-studies/route.ts` — GET (list) + POST (create)
   - `src/app/api/case-studies/[id]/route.ts` — GET (one) + PATCH (update) + DELETE

8. **Create CMS page:**
   - `src/app/cms/case-studies/page.tsx` — CRUD UI using the same patterns as existing content pages

9. **Create Supabase table:**
   - Run `pnpm run gen-types` after adding the table to regenerate TypeScript types

10. **Add to CMS sidebar and dashboard:**
    - `AdminSidebar.tsx` — add a navigation link
    - `src/app/cms/page.tsx` — add a dashboard card
