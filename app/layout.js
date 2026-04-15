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
  description: "Deadline tracking for UChicago MPCS",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <AssignmentProvider>
            <Nav />
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
              {children}
            </main>
          </AssignmentProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
