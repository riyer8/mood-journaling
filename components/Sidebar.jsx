import Link from "next/link";

export default function Sidebar({ activePage }) {
  const baseLinkClasses = "px-3 py-2 rounded-md hover:bg-[#565869] transition";
  const activeLinkClasses = "bg-[#444654]";

  return (
    <aside className="w-60 bg-[#343541] flex flex-col p-4 space-y-4">
      <h2
        className="text-2xl font-bold mb-6 select-none cursor-pointer"
        onClick={() => window.location.href = "/"}
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
            Journal Entry
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
      <div className="mt-auto text-gray-500 text-xs select-none">
        © 2025 Mood Journal
      </div>
    </aside>
  );
}