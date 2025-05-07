import { isAuthenticated } from "@/utils/supabase/auth";

export default async function PrivatePage() {
  const user = await isAuthenticated();
  return (
    <div className="rounded border border-dashed border-stone-700 p-4">
      <p>Hello {user.email}</p>
    </div>
  );
}
