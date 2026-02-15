import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bisoue Studio",
  description: "Timeless pieces crafted with care and attention to detail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
