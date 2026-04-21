"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/courses", label: "Courses" },
    { href: "/books", label: "Books" },
  ];

  return (
    <nav className="border-b border-white/60 bg-[rgba(255,252,247,0.85)] backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-5xl items-center gap-4 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="mr-2 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff8a5b,#f3c96b)] shadow-[0_10px_30px_rgba(243,201,107,0.35)]">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="5" width="22" height="19" rx="4" fill="#fff7ed" />
              <rect x="3" y="5" width="22" height="6" rx="4" fill="#fb923c" />
              <rect x="8" y="2" width="3" height="6" rx="1.5" fill="#9a3412" />
              <rect x="17" y="2" width="3" height="6" rx="1.5" fill="#9a3412" />
              <path d="M9 16.5 12.2 19.5 18.8 12.8" stroke="#9a3412" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-gray-900">
              DDL Tracker
            </span>
            <span className="block text-xs text-gray-500">
              Stay ahead of every reading, lab, and due date
            </span>
          </span>
        </Link>

        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-3 py-2 text-sm transition-colors ${
              pathname === href
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-600 hover:bg-white/70 hover:text-gray-900"
            }`}
          >
            {label}
          </Link>
        ))}

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/add"
            className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
          >
            Add Assignment
          </Link>
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
