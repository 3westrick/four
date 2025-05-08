"use client";
import {
  createTodo,
  deleteTodo,
  revalidateTodos,
} from "@/features/todos/actions";
import { Todo } from "@/features/todos/types";
import { createClient } from "@/utils/supabase/client";
import { Trash } from "lucide-react";
import { useEffect } from "react";

export default function Todos({ todos }: { todos: Todo[] }) {
  const supabase = createClient();

  useEffect(() => {
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        async (payload) => {
          console.log("aaaa");
          await revalidateTodos();
          console.log("Change received!", payload);
        },
      )
      .subscribe();
  }, []);
  return (
    <div className="space-y-2 rounded border border-dashed border-stone-700 p-4">
      <div>
        <form>
          <div className="space-x-2">
            <input
              name="task"
              type="text"
              className="rounded pl-2 ring-1 outline-none"
            />
            <button formAction={createTodo}>Create</button>
          </div>
        </form>
      </div>
      <div>
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id}>
              <div className="flex items-center justify-between rounded border border-dashed border-stone-400 p-2 md:w-1/2">
                <div className="flex gap-2">
                  <input
                    name="is_complete"
                    type="checkbox"
                    id={todo.id}
                    checked={todo.is_complete}
                    readOnly
                  />
                  <input type="hidden" name="todoId" value={todo.id} />
                  <label>{todo.task}</label>
                </div>

                <form>
                  <button formAction={deleteTodo} className="cursor-pointer">
                    <input type="hidden" name="todoId" value={todo.id} />
                    <Trash className="size-4" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
