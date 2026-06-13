using Api.Features.Todos.Data;

namespace Api.Features.Todos.ListTodos;

public sealed record TodoResponse(Guid Id, string Title, bool IsComplete, DateTimeOffset CreatedAt)
{
    public static TodoResponse FromTodo(Todo todo)
    {
        return new TodoResponse(todo.Id, todo.Title, todo.IsComplete, todo.CreatedAt);
    }
}
