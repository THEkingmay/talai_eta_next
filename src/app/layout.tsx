import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Talai ETA",
  description: "ETA FOR STUDENT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
