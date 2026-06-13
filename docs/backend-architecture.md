# Backend Architecture

The backend is a .NET 10 Minimal API under `src/backend`. It is organized around vertical feature slices, with Aspire handling local orchestration and shared service defaults.

## Projects

- `Api`: HTTP API, endpoint mapping, EF Core data access, validation, and feature slices.
- `AppHost`: Aspire local stack orchestration for Postgres, API, and frontend.
- `ServiceDefaults`: shared health checks, OpenTelemetry, service discovery, and HTTP resilience setup.

## API Composition

`Program.cs` wires the cross-cutting concerns:

- `AddServiceDefaults()` for health, telemetry, discovery, and resilience.
- `AddNpgsqlDbContext<AppDbContext>("appdb")` for Postgres access.
- FluentValidation assembly scanning.
- ProblemDetails and CORS.
- `/api` route group with feature endpoint registration.

Feature folders own their endpoint mapping, request and response contracts, validators, and feature-specific data access. Within a feature, each use case should have its own folder. The `Todos` folder is the reference slice.

## Data Access

`AppDbContext` is the shared EF Core unit of work. Feature-owned entities and EF configuration should live in the feature's `Data` folder, then be applied from the DbContext. Move persistence types to a shared data/domain area only when multiple features need them.

Local development receives the `appdb` connection string from Aspire Postgres. Production should provide the same connection string name from the host environment, commonly backed by Neon.

The current development startup calls `EnsureCreatedAsync()` so the example feature runs immediately. Replace this with EF Core migrations before production deployment.

## Validation

Requests use FluentValidation validators and opt in per endpoint with:

```csharp
.WithValidation<TRequest>()
```

The reusable endpoint filter lives under `Common/Validation`. It resolves `IValidator<TRequest>`, validates the matching request argument, and returns a standard validation problem response when validation fails.

## Adding A Feature Slice

Create a folder under `Features`, then add:

- A small feature endpoint aggregator, for example `TodoEndpoints.cs`.
- One folder per use case, for example `CreateTodo` or `ListTodos`.
- Request and response contracts beside the endpoint that owns them.
- FluentValidation validators beside the request types they validate.
- A `Data` folder for entities and EF configuration when persistence is needed.

Register the slice from the `/api` route group in `Program.cs`. Keep shared behavior in `Common` only when more than one slice needs it.
