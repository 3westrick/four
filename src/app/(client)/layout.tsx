import Link from "next/link";

export default async function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <header>
                <nav className="flex justify-between py-2 px-4 border-b border-b-stone-700 border-dashed">
                    <ul className="flex gap-2">
                        <li>
                            <Link href={"/"}>Home</Link>
                        </li>
                        <li>
                            <Link href={"/todos"}>Todos</Link>
                        </li>
                    </ul>
                    <ul className="flex gap-2">
                        <li>
                            <Link href={"/login"}>Login</Link>
                        </li>
                        <li>
                            <button className="cursor-pointer">Logout</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="p-4">{children}</main>
        </>
    );
}
