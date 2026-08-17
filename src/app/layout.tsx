import type { Metadata } from "next";
import { Gilda_Display, Marcellus } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Both faces are self-hosted and subset by next/font, with font-display: swap,
// so these display serifs never block first paint. Exposed as CSS variables and
// consumed through --font-display / --font-body in src/styles/tokens.css.
const gildaDisplay = Gilda_Display({
  variable: "--font-gilda-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Surya Cacao",
  description:
    "Ceremonial cacao made for the first hour of your day. Your morning cup is your ceremony.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${gildaDisplay.variable} ${marcellus.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
