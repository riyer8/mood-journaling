import "../styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";

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
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "system";
    const html = document.documentElement;
    html.classList.remove("dark", "light");

    const actual =
      saved === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : saved;

    html.classList.add(actual);
  }, []);

  return (
    <main
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <Component {...pageProps} />
    </main>
  );
}