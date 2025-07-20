import Link from "next/link";
import React from "react";

export type TocItem = { id: string; text: string; level: number };

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Table of contents" className="relative top-2 p-5 border rounded-lg">
      <h2 className="logo text-xl font-bold pb-3 mb-4 border-b border-primary w-full">► Table of Contents</h2>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={`${item.id || "empty"}-${idx}`}
            className={`ml-${(item.level - 1) * 4}`}
          >
            <Link
              href={`#${item.id}`}
              className="text-primary text-start hover:underline text-sm"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
