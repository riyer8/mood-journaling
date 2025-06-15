import React, { useState, useEffect } from "react";
import Link from "next/link";

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
      <aside className="w-60 bg-[#343541] flex flex-col p-4 space-y-4">
        <Link href="/" className="text-2xl font-bold mb-6 select-none cursor-pointer">
          Mood Journal
        </Link>
        <nav className="flex flex-col space-y-2">
          <Link href="/journal" className="px-3 py-2 rounded-md hover:bg-[#565869] transition">
            Journal Entry
          </Link>
          <Link href="/search" className="px-3 py-2 rounded-md bg-[#444654] hover:bg-[#565869] transition">
            Search
          </Link>
          <Link href="/settings" className="px-3 py-2 rounded-md hover:bg-[#565869] transition">
            Settings
          </Link>
        </nav>
        <div className="mt-auto text-gray-500 text-xs select-none">
          © 2025 Mood Journal
        </div>
      </aside>

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
                <div className="text-sm text-gray-400 mb-2">
                  {new Date(entry.date).toLocaleString()}
                </div>
                <p className="whitespace-pre-line">{entry.text}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
