import Link from "next/link";

export default function EditButton({ href, label = "Edit" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-300 bg-purple-600/20 border border-purple-500/30 rounded-full hover:bg-purple-600/40 hover:border-purple-500/50 transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
      </svg>
      {label}
    </Link>
  );
}
