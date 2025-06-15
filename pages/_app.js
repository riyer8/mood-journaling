import "../styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${geistSans.variable} ${geistMono.variable}`} style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Component {...pageProps} />
    </main>
  );
}