# Frontend Architecture

The frontend is a Next.js App Router application under `src/frontend`. It uses React Server Components by default and adds client boundaries only where browser state, forms, or React Query are needed.

## Core Conventions

- Application-level client providers live in `components/providers`.
- Shared UI primitives live in `components/ui` and follow shadcn naming and styling conventions.
- Cross-feature utilities live in `lib`, including the typed API request helper in `lib/api/client.ts`.
- Product features live in `features/<feature-name>` for schemas, API calls, React Query hooks, and feature-specific helpers.
- Route-level composition stays in `app`, with client components placed below the route when they need browser behavior.

## Data Fetching

Client-side server state uses TanStack React Query. The root layout wraps the app with `AppProviders`, which owns the `QueryClient`.

Feature hooks expose query and mutation behavior:

- Query keys are exported from the feature hook file.
- API calls parse backend responses with Zod before returning data to components.
- Mutations invalidate the related query keys on success.

The browser calls the .NET API directly through `NEXT_PUBLIC_API_BASE_URL`. Aspire supplies this value during local development, and production hosting should set it to the public API origin.

## Forms And Validation

Forms use React Hook Form for field state and submission flow. Zod schemas define input shape and are used before mutations leave the browser.

The `Todos` feature demonstrates the pattern:

- `features/todos/todo-schema.ts` owns request and response schemas.
- `features/todos/todo-api.ts` owns typed API calls.
- `features/todos/use-todos.ts` owns React Query hooks.
- `app/features/todos/todos-page.tsx` owns the screen and form composition.

## UI Guidance

Use shadcn UI primitives for repeatable controls, keep feature screens focused, and avoid hiding business behavior inside generic components. Components should receive already-validated data whenever practical.
