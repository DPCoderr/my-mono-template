using Api.Features.Todos.CreateTodo;
using Api.Features.Todos.ListTodos;

namespace Api.Features.Todos;

public static class TodoEndpoints
{
    public static RouteGroupBuilder MapTodos(this RouteGroupBuilder api)
    {
        var todos = api.MapGroup("/todos")
            .WithTags("Todos");

        todos.MapListTodos();
        todos.MapCreateTodo();

        return todos;
    }
}
