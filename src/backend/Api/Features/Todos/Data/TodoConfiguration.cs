using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Todos.Data;

public sealed class TodoConfiguration : IEntityTypeConfiguration<Todo>
{
    public void Configure(EntityTypeBuilder<Todo> builder)
    {
        builder.ToTable("todos");

        builder.HasKey(todo => todo.Id);

        builder.Property(todo => todo.Title)
            .HasMaxLength(Todo.TitleMaxLength)
            .IsRequired();

        builder.Property(todo => todo.IsComplete)
            .IsRequired();

        builder.Property(todo => todo.CreatedAt)
            .IsRequired();
    }
}
