import React from "react";
import Sidebar from "../components/Sidebar";

export default function Settings() {
  const handleClearEntries = () => {
    if (confirm("Are you sure you want to clear all journal entries?")) {
      localStorage.removeItem("journalEntries");
      alert("All journal entries have been cleared.");
    }
  };

  return (
    <div className="flex h-screen bg-[#202123] text-white font-sans">
      <Sidebar activePage="settings" />
      <main className="flex flex-col flex-grow p-8 overflow-auto">
        <h1 className="text-3xl font-semibold mb-6 select-none">Settings</h1>
        <button
          onClick={handleClearEntries}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition"
        >
          Clear All Journal Entries
        </button>
      </main>
    </div>
  );
}
