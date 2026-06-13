# Full-Stack Project Foundation

This repository contains a Next.js frontend and a .NET backend designed to grow around vertical feature slices.

## Structure

- `src/frontend`: Next.js App Router app with shadcn UI, React Query, React Hook Form, and Zod.
- `src/backend/Api`: .NET Minimal API with EF Core, Postgres, FluentValidation, and feature slices.
- `src/backend/AppHost`: Aspire orchestration for Postgres, the API, and the frontend dev server.
- `src/backend/ServiceDefaults`: shared health check, telemetry, service discovery, and resilience defaults.
- `docs`: architecture notes for frontend and backend development.

## Local Development

Restore and build the backend:

```powershell
dotnet restore src/backend/App.slnx
dotnet build src/backend/App.slnx
```

Install frontend dependencies if needed:

```powershell
cd src/frontend
npm install
```

Run the full local stack through Aspire:

```powershell
dotnet run --project src/backend/AppHost/AppHost.csproj
```

Aspire starts:

- Postgres with a persistent local data volume.
- pgAdmin for local database inspection.
- The .NET API, with `ConnectionStrings:appdb` supplied from Aspire.
- Scalar API reference at `/scalar` in development.
- The Next.js dev server, with `NEXT_PUBLIC_API_BASE_URL` pointing at the API.

## Production Database

Use Neon by setting the API connection string named `appdb` in the production host:

```text
ConnectionStrings__appdb=Host=...;Database=...;Username=...;Password=...;Ssl Mode=Require
```

The example database table is created automatically in development. For production apps, add EF Core migrations and run them as part of deployment.

## Validation

Backend request validation uses FluentValidation endpoint filters. Add a validator for the request type and opt into validation on the endpoint:

```csharp
todos.MapPost("/", Handler)
    .WithValidation<CreateTodoRequest>();
```

Frontend form validation uses Zod schemas shared by the feature's API functions and React Hook Form submit path.
