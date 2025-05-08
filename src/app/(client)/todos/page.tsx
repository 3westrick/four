import { getTodos } from "@/features/todos/actions";
import { isAuthenticatedOrRedirect } from "@/utils/supabase/auth";
import Todos from "./Todos";

export default async function PrivatePage() {
  await isAuthenticatedOrRedirect();
  const todos = await getTodos();

  return <Todos todos={todos} />;
}
