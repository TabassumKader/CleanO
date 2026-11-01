import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "CLEAN - O · ক্লিন - ও",
    template: "%s · CLEAN - O",
  },
  description:
    "A web platform for transparent household waste collection: pickups, fees, receipts and complaints in one shared record.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body>{children}</body>
    </html>
  );
}
