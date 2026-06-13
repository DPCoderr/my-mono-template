import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, listTodos } from "./todo-api";

export const todoQueryKeys = {
  all: ["todos"] as const,
};

export function useTodosQuery() {
  return useQuery({
    queryKey: todoQueryKeys.all,
    queryFn: listTodos,
  });
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.all });
    },
  });
}
