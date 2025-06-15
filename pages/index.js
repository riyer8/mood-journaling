import { useRouter } from "next/router";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/journal");
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex items-center justify-center h-screen bg-[#202123] text-white`}
    >
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold mb-6">Mood Journal</h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Reflect on your day, understand your emotions, and grow your self-awareness.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md text-white text-lg font-medium transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
