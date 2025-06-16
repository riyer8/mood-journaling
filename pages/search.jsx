import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import EmotionTag from "../components/EmotionTag";

export default function Search() {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    setEntries(storedEntries);
  }, []);

  // filter entries based off of searched word
  const filteredEntries = entries.filter((entry) =>
    entry.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#202123] text-white font-sans">
      <Sidebar activePage="search" />

      <main className="flex flex-col flex-grow p-8 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold select-none">Search Your Journal</h1>
        </header>

        <input
          type="text"
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 p-3 rounded-md bg-[#343541] border border-[#555867] text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <section className="max-w-3xl">
          {filteredEntries.length === 0 ? (
            <p className="text-gray-400">No matching journal entries found.</p>
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="mb-6 p-4 bg-[#2a2b32] rounded-md">
                <div className="flex items-center gap-2 flex-wrap text-sm text-gray-400 mb-2">
                  <span>{new Date(entry.date).toLocaleString()}</span>
                  <div className="flex gap-1 flex-wrap">
                    {entry.emotions?.map((emotion, index) => (
                      <EmotionTag key={index} emotion={emotion} />
                    ))}
                  </div>
                </div>

                <p className="whitespace-pre-line mb-3">{entry.text}</p>

                {entry.images?.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {entry.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`journal-img-${i}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}