import Link from "next/link";

export default function ActionButtons({
  editHref,
  deleteAction,
  showDelete = true,
}) {
  return (
    <div className="flex gap-2">
      <Link href={editHref} className="text-sm text-blue-500 hover:underline">
        Edit
      </Link>
      {showDelete && deleteAction}
    </div>
  );
}
