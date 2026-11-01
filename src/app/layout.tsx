import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin", "latin-ext", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FLAVOR. Cook with what you have.",
  description:
    "Chọn những nguyên liệu bạn đang có và khám phá món có thể nấu tối nay. Choose the ingredients already in your kitchen and discover what you can cook tonight.",
};

export const viewport: Viewport = {
  themeColor: "#F5F1E8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}