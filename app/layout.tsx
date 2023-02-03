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
        <main
          className="h-full w-full bg-cover bg-no-repeat bg-violet-300 bg-center"
          style={{ backgroundImage: "url('./purple-gift-half.png')" }}
        >
          <div className="p-4 flex items-center justify-center min-h-screen backdrop-blur-sm">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
