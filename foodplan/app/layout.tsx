import type { Metadata } from "next";
import "./globals.css";
import AuthButton from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "Foodplan - Family Meal Planning",
  description: "Danish supermarket price verification and family meal planning system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Foodplan</h1>
            <AuthButton />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
