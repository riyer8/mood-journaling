import React, { useState, useEffect } from "react";
import { detectEmotions } from "../utils/emotionDetection";
import EmotionTag from "../components/EmotionTag";


export default function Journal() {
  const [entry, setEntry] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [title, setTitle] = useState("");
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (entry.trim()) {
        await analyzeEntry(entry);
      }
    }
  };

  async function analyzeEntry(text) {
    setLoading(true);

    // Create a simple title from the first few words
    const words = text.trim().split(/\s+/);
    const generatedTitle = words.slice(0, 6).join(" ") + (words.length > 6 ? "..." : "");
    setTitle(generatedTitle);

    try {
      const detectedEmotions = await detectEmotions(text);
      setEmotions(detectedEmotions);
    } catch (error) {
      setEmotions(["Neutral"]);
      console.error("Emotion detection error:", error);
    }

    setLoading(false);
  }

  return (
    <div className="flex h-screen bg-[#202123] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-[#343541] flex flex-col p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6 select-none">Mood Journal</h2>
        <nav className="flex flex-col space-y-2">
          <a
            href="/journal"
            className="px-3 py-2 rounded-md bg-[#444654] hover:bg-[#565869] transition"
          >
            Journal Entry
          </a>
          <a
            href="/history"
            className="px-3 py-2 rounded-md hover:bg-[#565869] transition"
          >
            History
          </a>
          <a
            href="/settings"
            className="px-3 py-2 rounded-md hover:bg-[#565869] transition"
          >
            Settings
          </a>
        </nav>
        <div className="mt-auto text-gray-500 text-xs select-none">
          © 2025 JournalApp
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-col flex-grow p-8 overflow-auto">
        {/* Header with date/time */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold select-none">How are you feeling today?</h1>
          <div className="text-gray-400 select-none">{dateTime.toLocaleString()}</div>
        </header>

        {/* Journal Input area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (entry.trim()) analyzeEntry(entry);
          }}
          className="flex flex-col flex-grow max-w-3xl"
        >
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your journal entry here..."
            rows={10}
            className="bg-[#343541] border border-[#555867] rounded-md p-4 text-white text-lg placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading || !entry.trim()}
              className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Output */}
        {(title || emotions.length > 0) && (
          <section className="mt-8 max-w-3xl bg-[#2a2b32] rounded-md p-6">
            <h2 className="text-xl font-semibold mb-2">Title</h2>
            <p className="italic text-gray-300 mb-4">{title}</p>

            <h2 className="text-xl font-semibold mb-2">Detected Emotions</h2>
            <div>
                {emotions.map((e, i) => (
                    <EmotionTag key={i} emotion={e} />
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
