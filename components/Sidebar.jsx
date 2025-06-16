import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Sidebar({
  activePage,
  activeEntryId,
  setActiveEntryId,
  onNewEntry,
  onSelectEntry,
  entries: propEntries,
}) {
  const baseLinkClasses = "px-3 py-2 rounded-md hover:bg-[#565869] transition";
  const activeLinkClasses = "bg-[#444654]";
  const [entries, setEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (propEntries) {
      setEntries(propEntries);
    } else {
      const stored = JSON.parse(localStorage.getItem("journalEntries") || "[]");
      setEntries(stored);
    }
  }, [propEntries]);

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleEntryClick(id) {
    router.push(`/journal?entryId=${id}`);

    if (setActiveEntryId) setActiveEntryId(id);
    if (typeof onSelectEntry === "function") onSelectEntry(id);
  }

  return (
    <aside className="w-60 bg-[#343541] flex flex-col p-4 space-y-4">
      <h2
        className="text-2xl font-bold mb-6 select-none cursor-pointer"
        onClick={() => {
          if (router.pathname !== "/journal") router.push("/journal");
          if (setActiveEntryId) setActiveEntryId(null);
          if (typeof onSelectEntry === "function") onSelectEntry(null);
        }}
      >
        Mood Journal
      </h2>

      <nav className="flex flex-col space-y-2">
        <Link href="/journal" legacyBehavior>
          <a
            className={`${baseLinkClasses} ${
              activePage === "journal" ? activeLinkClasses : ""
            }`}
          >
            Journal
          </a>
        </Link>
        <Link href="/search" legacyBehavior>
          <a
            className={`${baseLinkClasses} ${
              activePage === "search" ? activeLinkClasses : ""
            }`}
          >
            Search
          </a>
        </Link>
        <Link href="/settings" legacyBehavior>
          <a
            className={`${baseLinkClasses} ${
              activePage === "settings" ? activeLinkClasses : ""
            }`}
          >
            Settings
          </a>
        </Link>
      </nav>

      {/* New Entry button */}
      <button
        onClick={() => {
          if (router.pathname !== "/journal") router.push("/journal");
          if (onNewEntry) onNewEntry();
          if (setActiveEntryId) setActiveEntryId(null);
        }}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
        aria-label="Create new journal entry"
      >
        + New Entry
      </button>

      {/* Journal entries list */}
      <div className="flex-grow overflow-auto mt-4 border-t border-[#565869] pt-4">
        {entries.length === 0 ? (
          <p className="text-gray-400 select-none text-sm px-2">No entries yet</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li
                key={entry.id}
                onClick={() => handleEntryClick(entry.id)}
                className={`cursor-pointer px-2 py-2 mb-1 rounded-md hover:bg-[#565869] transition ${
                  activeEntryId === entry.id ? "bg-indigo-700" : ""
                }`}
                title={
                  entry.text.length > 100
                    ? entry.text.slice(0, 100) + "…"
                    : entry.text
                }
              >
                <p className="text-sm truncate">
                  {entry.text || "<Empty Entry>"}
                </p>
                <time className="text-xs text-gray-400">
                  {formatDate(entry.date)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-auto text-gray-500 text-xs select-none">
        © 2025 Mood Journal
      </div>
    </aside>
  );
}