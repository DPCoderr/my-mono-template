using Api.Features.Todos.Data;
using FluentValidation;

namespace Api.Features.Todos.CreateTodo;

public sealed class CreateTodoRequestValidator : AbstractValidator<CreateTodoRequest>
{
    public CreateTodoRequestValidator()
    {
        RuleFor(request => request.Title)
            .NotEmpty()
            .MaximumLength(Todo.TitleMaxLength);
    }
}
