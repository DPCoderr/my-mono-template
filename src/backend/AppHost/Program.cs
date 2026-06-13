using Aspire.Hosting.ApplicationModel;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin()
    .WithDataVolume();

var database = postgres.AddDatabase("appdb");

var api = builder.AddProject<Projects.Api>("api")
    .WithReference(database)
    .WaitFor(database);

builder.AddExecutable("frontend", "npm", "../../frontend", "run", "dev")
    .WithEnvironment("NEXT_PUBLIC_API_BASE_URL", api.GetEndpoint("http"))
    .WithHttpEndpoint(env: "PORT", port: 3000)
    .WithExternalHttpEndpoints()
    .WaitFor(api);

builder.Build().Run();
