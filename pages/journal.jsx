import React, { useState, useEffect } from "react";
import { detectEmotions } from "../utils/emotionDetection";
import EmotionTag from "../components/EmotionTag";
import Sidebar from "../components/Sidebar";

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittedText, setSubmittedText] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // users can also hit enter to submit
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
    setSubmittedText(text);

    try {
      const detectedEmotions = await detectEmotions(text);
      setEmotions(detectedEmotions);

      const existingEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
      
      // new jouranl entry with emotions
      const newEntry = {
        id: Date.now(),
        text,
        date: new Date().toISOString(),
        emotions: detectedEmotions,
      };

      localStorage.setItem("journalEntries", JSON.stringify([newEntry, ...existingEntries]));
    } catch (error) {
      setEmotions(["Neutral"]);
      console.error("Emotion detection error:", error);
    }
ß
    setLoading(false);
  }


  return (
    <div className="flex h-screen bg-[#202123] text-white font-sans">
      <Sidebar activePage="journal" />

      <main className="flex flex-col flex-grow p-8 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold select-none">How are you feeling today?</h1>
          <div className="text-gray-400 select-none">{dateTime.toLocaleString()}</div>
        </header>

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

        {(submittedText || emotions.length > 0) && (
          <section className="mt-8 max-w-3xl bg-[#2a2b32] rounded-md p-6">
            {submittedText && (
              <>
                <h2 className="text-xl font-semibold mb-2">Journal Entry</h2>
                <p className="text-gray-200 mb-4 whitespace-pre-line">
                  {submittedText}
                </p>
              </>
            )}

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