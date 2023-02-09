"use client";

import { Toaster } from "react-hot-toast";
import { AnalyticsWrapper } from "./analytics";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <main className="h-full w-full bg-violet-900">
          <div className="sm:flex items-center justify-center min-h-screen backdrop-blur-sm relative">
            {children}
          </div>
        </main>
        <AnalyticsWrapper />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 6000,
            error: {
              duration: 4000,
            },
            success: {
              duration: 2000,
            },
          }}
        />
      </body>
    </html>
  );
}
