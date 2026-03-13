import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AU Skatepark Finder — Every Skatepark in Australia",
    template: "%s | AU Skatepark Finder",
  },
  description:
    "Find every skatepark and skate spot in Australia. 1,200+ parks with maps, features, surface info and more.",
  openGraph: {
    title: "AU Skatepark Finder",
    description:
      "Find every skatepark and skate spot in Australia. 1,200+ parks with maps, features, and details.",
    url: "https://skateparks.rollersoft.com.au",
    siteName: "AU Skatepark Finder",
    locale: "en_AU",
    type: "website",
  },
  alternates: { canonical: "https://skateparks.rollersoft.com.au" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="night">
      <body className="min-h-screen bg-base-100 flex flex-col">
        <header className="navbar bg-neutral text-neutral-content shadow-lg">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <a className="text-xl font-bold tracking-tight" href="/">
              🛹 AU Skatepark Finder
            </a>
            <nav className="hidden md:flex gap-4 text-sm">
              <a href="/" className="hover:text-primary transition">Home</a>
              <a href="/states" className="hover:text-primary transition">States</a>
              <a href="/map" className="hover:text-primary transition">Map</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="footer footer-center p-6 bg-neutral text-neutral-content text-sm">
          <p>
            © {new Date().getFullYear()} AU Skatepark Finder. Data from{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              className="link link-primary"
              target="_blank"
            >
              OpenStreetMap
            </a>
            . Built by{" "}
            <a href="https://rollersoft.com.au" className="link link-primary" target="_blank">
              Rollersoft
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
