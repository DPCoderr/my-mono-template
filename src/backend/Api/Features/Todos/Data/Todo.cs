namespace Api.Features.Todos.Data;

public sealed class Todo
{
    public const int TitleMaxLength = 200;

    public Guid Id { get; set; }
    public required string Title { get; set; }
    public bool IsComplete { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
