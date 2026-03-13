import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-center gap-8 p-4 bg-white/5 border-b border-white/10">
      <Link
        href="/"
        className="text-white hover:text-purple-300 transition-colors font-medium"
      >
        Home
      </Link>
      <Link
        href="/books"
        className="text-white hover:text-purple-300 transition-colors font-medium"
      >
        Books
      </Link>
      <Link
        href="/users/you"
        className="text-white hover:text-purple-300 transition-colors font-medium"
      >
        Profile
      </Link>
    </nav>
  );
}
