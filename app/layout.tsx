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
      </body>
    </html>
  );
}
