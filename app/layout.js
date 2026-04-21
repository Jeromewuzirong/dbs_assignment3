import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./Nav";
import { AssignmentProvider } from "./context/AssignmentContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DDL Tracker",
  description: "A calmer dashboard for tracking coursework, reading, and due dates.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ClerkProvider>
          <AssignmentProvider>
            <Nav />
            <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </AssignmentProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
