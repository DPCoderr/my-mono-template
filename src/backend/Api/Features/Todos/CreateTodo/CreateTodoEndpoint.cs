using Api.Common.Validation;
using Api.Data;
using Api.Features.Todos.Data;
using Api.Features.Todos.ListTodos;

namespace Api.Features.Todos.CreateTodo;

public static class CreateTodoEndpoint
{
    public static RouteGroupBuilder MapCreateTodo(this RouteGroupBuilder todos)
    {
        todos.MapPost("/", async (
            CreateTodoRequest request,
            AppDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            var todo = new Todo
            {
                Id = Guid.NewGuid(),
                Title = request.Title.Trim(),
                IsComplete = false,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            dbContext.Todos.Add(todo);
            await dbContext.SaveChangesAsync(cancellationToken);

            return Results.Created($"/api/todos/{todo.Id}", TodoResponse.FromTodo(todo));
        })
        .WithName("CreateTodo")
        .WithValidation<CreateTodoRequest>();

        return todos;
    }
}
