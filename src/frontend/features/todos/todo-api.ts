import { apiRequest } from "@/lib/api/client";
import { createTodoSchema, todosSchema, todoSchema, type CreateTodoInput } from "./todo-schema";

export async function listTodos() {
  const response = await apiRequest<unknown>("/api/todos");
  return todosSchema.parse(response);
}

export async function createTodo(input: CreateTodoInput) {
  const request = createTodoSchema.parse(input);

  const response = await apiRequest<unknown>("/api/todos", {
    method: "POST",
    body: JSON.stringify(request),
  });

  return todoSchema.parse(response);
}
