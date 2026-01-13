import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jermai – AI Researcher Studio",
  description: "Generate structured research: outlines, chapters, references, and visuals for Undergrad, MSc, or PhD work with globally aware settings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
