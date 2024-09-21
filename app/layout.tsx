import { AnalyticsWrapper, ToasterWrapper } from "./ClientDirectiveWrapper";
import "./globals.css";
import { AddToHomeScreen } from "./AddToHomeScreen";

export const metadata = {
  title: "Giftwise",
  description: "Personalized gift recommendations",
  manifest: "/manifest.json",
  themeColor: "#6d28d9",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
  ],
};

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
        <AddToHomeScreen />
        <AnalyticsWrapper />
        <ToasterWrapper />
      </body>
    </html>
  );
}
