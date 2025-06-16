import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

// Utility: Detect system theme
const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

// Apply theme to <html>
const applyTheme = (mode) => {
  const root = document.documentElement;

  // Remove both first
  root.classList.remove("dark");
  root.classList.remove("light");

  const resolved = mode === "system" ? getSystemTheme() : mode;
  root.classList.add(resolved);

  localStorage.setItem("theme", mode);
};

export default function Settings() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const handleThemeChange = (e) => {
    const selected = e.target.value;
    setTheme(selected);
    applyTheme(selected);
  };

  const handleReset = () => {
    setTheme("system");
    applyTheme("system");
  };

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
        <h1 className="text-3xl font-semibold mb-8 select-none">Settings</h1>

        {/* Theme Settings */}
        <div className="mb-8 max-w-md bg-[#2a2b32] p-6 rounded-md space-y-4">
          <label htmlFor="theme" className="block text-lg font-medium">
            Theme
          </label>

          <select
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            className="bg-[#343541] border border-[#555867] text-white rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition"
          >
            Reset to System Default
          </button>

          <p className="mt-4 text-sm text-gray-400">
            The app will follow your OS appearance when set to "System".
          </p>

        </div>

        {/* Clear entries */}
        <div className="max-w-md">
          <button
            onClick={handleClearEntries}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition"
          >
            Clear All Journal Entries
          </button>
        </div>
      </main>
    </div>
  );
}