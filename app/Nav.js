"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/add", label: "Add Assignment" },
    { href: "/courses", label: "Courses" },
    { href: "/books", label: "Books" },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 flex items-center h-12 gap-6">
        <Link href="/" className="font-semibold text-sm tracking-tight mr-4">
          DDL Tracker
        </Link>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm transition-colors ${
              pathname === href
                ? "text-gray-900 font-medium"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {label}
          </Link>
        ))}
        <div className="ml-auto">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
