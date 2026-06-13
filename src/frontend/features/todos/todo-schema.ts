import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Enter a title.").max(200, "Keep titles under 200 characters."),
});

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  isComplete: z.boolean(),
  createdAt: z.string(),
});

export const todosSchema = z.array(todoSchema);

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type Todo = z.infer<typeof todoSchema>;
