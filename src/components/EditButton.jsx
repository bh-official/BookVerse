import Link from "next/link";

export default function EditButton({ href, label = "Edit" }) {
  return (
    <Link href={href} className="text-sm text-blue-500 hover:underline">
      {label}
    </Link>
  );
}
