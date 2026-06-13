using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Todos.ListTodos;

public static class ListTodosEndpoint
{
    public static RouteGroupBuilder MapListTodos(this RouteGroupBuilder todos)
    {
        todos.MapGet("/", async (AppDbContext dbContext, CancellationToken cancellationToken) =>
        {
            var items = await dbContext.Todos
                .AsNoTracking()
                .OrderBy(todo => todo.CreatedAt)
                .Select(todo => TodoResponse.FromTodo(todo))
                .ToListAsync(cancellationToken);

            return Results.Ok(items);
        })
        .WithName("ListTodos");

        return todos;
    }
}
