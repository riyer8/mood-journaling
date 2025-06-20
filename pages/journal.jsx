/* Main journal entry page
- current journal entry text
- image uploads
- emotion analysis
- display and edit past entries
*/

import React, { useState, useEffect, useRef } from "react";
import { detectEmotions } from "../utils/emotionDetection";
import EmotionTag from "../components/EmotionTag";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";

export default function Journal() {
  const router = useRouter();

  // state management
  const [entry, setEntry] = useState("");
  const [images, setImages] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittedText, setSubmittedText] = useState("");
  const [submittedImages, setSubmittedImages] = useState([]);

  const [entries, setEntries] = useState([]);
  const [activeEntryId, setActiveEntryId] = useState(null);

  const fileInputRef = useRef();

  // date and time for entries
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // loads entries on page loading
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    setEntries(stored);
    if (stored.length > 0) {
      setActiveEntryId(stored[0].id);
    }
  }, []);

  // sync activeEntryId from URL query param
  useEffect(() => {
    const entryIdFromQuery = router.query.entryId;
    if (entryIdFromQuery && entries.length > 0) {
      const match = entries.find((e) => String(e.id) === String(entryIdFromQuery));
      if (match) {
        setActiveEntryId(match.id);
      }
    }
  }, [router.query.entryId, entries]);

  // new entry --> populates new entries for each state
  useEffect(() => {
    if (activeEntryId === null) {
      clearForm();
      return;
    }
    const found = entries.find((e) => e.id === activeEntryId);
    if (found) {
      setEntry(found.text);
      setImages(found.images || []);
      setEmotions(found.emotions || []);
      setSubmittedText(found.text);
      setSubmittedImages(found.images || []);
    }
  }, [activeEntryId, entries]);

  // clears form when new entry is called
  function clearForm() {
    setEntry("");
    setImages([]);
    setEmotions([]);
    setSubmittedText("");
    setSubmittedImages([]);
  }

  // allows user to hit enter to submit entry
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (entry.trim()) {
        await analyzeEntry(entry);
      }
    }
  };

  // drag and drop photos
  const handleFiles = (files) => {
    const fileArr = Array.from(files);
    const readers = fileArr.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((base64Images) => {
      setImages((prev) => [...prev, ...base64Images]);
    });
  };

  const handleImageUpload = (e) => {
    handleFiles(e.target.files);
  };

  // drag and drop entry
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // removes image for preview
  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // analyzes emotion, updates and create entry, refreshes UI
  async function analyzeEntry(text) {
    setLoading(true);

    try {
      const detectedEmotions = await detectEmotions(text);
      setEmotions(detectedEmotions);

      let updatedEntries;
      if (activeEntryId) {
        updatedEntries = entries.map((e) =>
          e.id === activeEntryId
            ? { ...e, text, emotions: detectedEmotions, images }
            : e
        );
      } else {
        const newEntry = {
          id: Date.now(),
          text,
          date: new Date().toISOString(),
          emotions: detectedEmotions,
          images,
        };
        updatedEntries = [newEntry, ...entries];
        setActiveEntryId(newEntry.id);
      }

      localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
      setEntries(updatedEntries);

      setSubmittedText(text);
      setSubmittedImages(images);
    } catch (error) {
      setEmotions(["Neutral"]);
      console.error("Emotion detection error:", error);
    }

    setLoading(false);
  }

  // new entry
  const handleNewEntry = () => {
    setActiveEntryId(null);
    clearForm();
  };

  return (
    <div className="flex h-screen bg-[#202123] text-white font-sans">
      <Sidebar
        activePage="journal"
        entries={entries}
        activeEntryId={activeEntryId}
        setActiveEntryId={setActiveEntryId}
        onSelectEntry={setActiveEntryId}
        onNewEntry={handleNewEntry}
      />

      <main className="flex flex-col flex-grow p-8 overflow-auto max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold select-none">How are you feeling today?</h1>
          <div className="text-gray-400 select-none">{dateTime.toLocaleString()}</div>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (entry.trim()) analyzeEntry(entry);
          }}
          className="flex flex-col flex-grow"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What are you currently thinking about?"
            rows={10}
            className="bg-[#343541] border border-[#555867] rounded-md p-4 text-white text-lg placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <label
            htmlFor="imageUpload"
            className="mt-4 cursor-pointer inline-block rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 select-none w-max"
          >
            Choose Images
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
          />

          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-4">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded overflow-hidden border border-gray-600"
                >
                  <img src={src} alt={`upload-${i}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-red-600 rounded-bl px-1 text-white text-xs hover:bg-red-700"
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading || !entry.trim()}
              className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Analyzing..." : activeEntryId ? "Update Entry" : "Submit"}
            </button>
          </div>
        </form>

        {(submittedText || emotions.length > 0 || submittedImages.length > 0) && (
          <section className="mt-8 bg-[#2a2b32] rounded-md p-6">
            {submittedText && (
              <>
                <h2 className="text-xl font-semibold mb-2">Journal</h2>
                <p className="text-gray-200 mb-4 whitespace-pre-line">{submittedText}</p>
              </>
            )}

            {submittedImages.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-2">Attached Images</h2>
                <div className="flex gap-3 flex-wrap mb-4">
                  {submittedImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`uploaded-${i}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
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