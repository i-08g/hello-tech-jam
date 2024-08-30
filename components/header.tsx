import { ThemeToggle } from "@/components/theme-toggle";
import { LoginUser } from "./Authentication/page";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background border-b">
      <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" passHref>
          <h1 className="text-xl font-bold cursor-pointer">Attack on Rappin</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LoginUser />
        </div>
      </nav>
    </header>
  );
}
