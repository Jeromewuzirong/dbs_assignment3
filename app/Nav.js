"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/add", label: "📝 Add Assignment" },
    { href: "/courses", label: "📚 Courses" },
    { href: "/books", label: "🔖 Books" },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 flex items-center h-12 gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight mr-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Calendar body */}
            <rect x="2" y="5" width="24" height="21" rx="3" fill="#3b82f6" />
            {/* Calendar header bar */}
            <rect x="2" y="5" width="24" height="7" rx="3" fill="#2563eb" />
            {/* Calendar binding pegs */}
            <rect x="8" y="2" width="3" height="6" rx="1.5" fill="#1d4ed8" />
            <rect x="17" y="2" width="3" height="6" rx="1.5" fill="#1d4ed8" />
            {/* Checkmark */}
            <path d="M9 16.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Clock circle overlay */}
            <circle cx="21" cy="21" r="6" fill="#7c3aed" stroke="white" strokeWidth="1.5" />
            {/* Clock hands */}
            <line x1="21" y1="18.5" x2="21" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="21" y1="21" x2="23" y2="22.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
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
