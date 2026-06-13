"use client";

import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTodoSchema, type CreateTodoInput } from "@/features/todos/todo-schema";
import { useCreateTodoMutation, useTodosQuery } from "@/features/todos/use-todos";

export function TodosPage() {
  const todosQuery = useTodosQuery();
  const createTodoMutation = useCreateTodoMutation();
  const form = useForm<CreateTodoInput>({
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = createTodoSchema.safeParse(values);

    if (!result.success) {
      const titleError = result.error.flatten().fieldErrors.title?.[0];

      if (titleError) {
        form.setError("title", {
          type: "manual",
          message: titleError,
        });
      }

      return;
    }

    await createTodoMutation.mutateAsync(result.data);
    form.reset();
  });

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Full-stack project foundation</p>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Todos</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            A small vertical slice that exercises the API, database, validation, React Query,
            React Hook Form, Zod, and shadcn UI primitives.
          </p>
        </header>

        <section className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
            <div className="flex-1">
              <Input
                aria-label="Todo title"
                placeholder="Add a todo"
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <p className="mt-2 text-sm text-destructive">{form.formState.errors.title.message}</p>
              ) : null}
            </div>
            <Button
              className="sm:w-32"
              disabled={createTodoMutation.isPending}
              type="submit"
            >
              {createTodoMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="size-4" aria-hidden="true" />
              )}
              Add
            </Button>
          </form>
          {createTodoMutation.isError ? (
            <p className="mt-3 text-sm text-destructive">
              {createTodoMutation.error.message}
            </p>
          ) : null}
        </section>

        <section className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3 sm:px-6">
            <h2 className="text-base font-medium">Current todos</h2>
          </div>

          {todosQuery.isPending ? (
            <div className="flex h-36 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
              Loading todos
            </div>
          ) : todosQuery.isError ? (
            <div className="px-4 py-8 text-sm text-destructive sm:px-6">
              {todosQuery.error.message}
            </div>
          ) : todosQuery.data.length === 0 ? (
            <div className="px-4 py-8 text-sm text-muted-foreground sm:px-6">
              No todos yet.
            </div>
          ) : (
            <ul className="divide-y">
              {todosQuery.data.map((todo) => (
                <li className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6" key={todo.id}>
                  <span className="text-sm font-medium">{todo.title}</span>
                  <time className="shrink-0 text-xs text-muted-foreground" dateTime={todo.createdAt}>
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(todo.createdAt))}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
