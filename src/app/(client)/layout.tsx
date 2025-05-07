import { getUser, signOut } from "@/utils/supabase/auth";
import Link from "next/link";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <>
      <header>
        <nav className="flex justify-between border-b border-dashed border-b-stone-700 px-4 py-2">
          <ul className="flex gap-2">
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/todos"}>Todos</Link>
            </li>
          </ul>
          <ul className="flex gap-2">
            {!user ? (
              <li>
                <Link href={"/login"}>Login</Link>
              </li>
            ) : (
              <li>
                <form>
                  <button className="cursor-pointer" formAction={signOut}>
                    Logout
                  </button>
                </form>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className="p-4">{children}</main>
    </>
  );
}
