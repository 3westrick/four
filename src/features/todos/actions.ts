"use server";

import { getUser } from "@/utils/supabase/auth";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag, unstable_cache } from "next/cache";

export async function getTodos() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) throw new Error("User is not authenticated");

  const getTodosHelper = unstable_cache(
    async () => {
      console.log(222, user.id);
      const { data: todos, error } = await supabase
        .from("todos")
        .select("*")
        .filter("user_id", "eq", user.id);
      if (error) throw new Error(error.message);
      return todos;
    },
    ["todos", user.id],
    {
      revalidate: 3600,
      tags: [`todos-${user.id}`],
    },
  );

  return getTodosHelper();
}

export async function createTodo(formData: FormData) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) throw new Error("User is not authenticated");
  const task = formData.get("task") as string;

  const { error } = await supabase.from("todos").insert({
    user_id: user.id,
    task,
  });

  if (error) throw new Error(error.message);

  //   revalidatePath("/todos");
  revalidateTag(`todos-${user.id}`);
}

export async function deleteTodo(formData: FormData) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) throw new Error("User is not authenticated");
  const todoId = formData.get("todoId") as string;
  const { error } = await supabase
    .from("todos")
    .delete()
    .filter("user_id", "eq", user.id)
    .filter("id", "eq", todoId);

  if (error) throw new Error(error.message);

  revalidateTag(`todos-${user.id}`);
}

export async function revalidateTodos() {
  console.log("allalal");
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) throw new Error("User is not authenticated");
  revalidateTag(`todos-${user.id}`);
}
