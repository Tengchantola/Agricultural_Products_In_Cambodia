import type { Metadata } from "next";
import { Battambang, Moul, Hanuman } from "next/font/google";
import "./globals.css";
import HeaderFooterWrapper from "./components/HeaderFooterWrapper";

const hanuman = Hanuman({
  subsets: ["latin"],
  variable: "--font-inter",
});

const battambang = Battambang({
  subsets: ["khmer"],
  weight: ["400", "700"],
  variable: "--font-battambang",
  display: "swap",
});

const moul = Moul({
  subsets: ["khmer"],
  weight: ["400"],
  variable: "--font-moul",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ផលិតផលកសិកម្មនៅកម្ពុជា - Agricultural products in Cambodia",
  description: "កម្មវិធីតាមដានតម្លៃផលិតផលកសិកម្មនៅទីផ្សារផ្សេងៗ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${hanuman.variable} ${battambang.variable} ${moul.variable}`}
    >
      <body className={`font-khmer ${hanuman.className} antialiased`}>
        <HeaderFooterWrapper>
          <main className="grow">{children}</main>
        </HeaderFooterWrapper>
      </body>
    </html>
  );
}
