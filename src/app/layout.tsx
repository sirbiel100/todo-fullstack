import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google"
import "./globals.scss";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});


export const metadata: Metadata = {
  title: "Todo App | Gabriel Crispim",
  description: "Fullstack ToDO application challenged by Frontend Mentor",
  creator: "Gabriel Crispim",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${josefin.className}`}>
        {children}
      </body>
    </html>
  );
}
