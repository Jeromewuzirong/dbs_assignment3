"use client";

import { useState, useEffect } from "react";
import {
  searchBooks,
  getSavedBooks,
  saveBook,
  removeSavedBook,
} from "../actions";

const inputClass =
  "w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors";

function CoverImg({ coverId, title }) {
  if (!coverId) {
    return (
      <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs shrink-0">
        No cover
      </div>
    );
  }
  return (
    <img
      src={`https://covers.openlibrary.org/b/id/${coverId}-S.jpg`}
      alt={title}
      className="w-12 h-16 object-cover rounded shrink-0"
    />
  );
}

export default function Books() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [saved, setSaved] = useState([]);
  const [savedKeys, setSavedKeys] = useState(new Set());
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState("search");

  useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {
    try {
      const books = await getSavedBooks();
      setSaved(books);
      setSavedKeys(new Set(books.map((b) => b.ol_key)));
    } catch (err) {
      console.error("Failed to load saved books:", err);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const books = await searchBooks(query.trim());
      setResults(books);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  }

  async function handleSave(book) {
    try {
      await saveBook(book);
      await loadSaved();
    } catch (err) {
      console.error("Failed to save book:", err);
    }
  }

  async function handleRemove(id) {
    try {
      await removeSavedBook(id);
      await loadSaved();
    } catch (err) {
      console.error("Failed to remove book:", err);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Books</h1>
      <p className="text-sm text-gray-500 mb-6">
        Search for textbooks and save them to your reading list.
      </p>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab("search")}
          className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
            tab === "search"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Search
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
            tab === "saved"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Saved ({saved.length})
        </button>
      </div>

      {tab === "search" && (
        <div>
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Search by title, author, or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 cursor-pointer transition-colors shrink-0 disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </form>

          {results.length === 0 && !searching && (
            <p className="text-sm text-gray-400 text-center py-12">
              Search for books using the Open Library API.
            </p>
          )}

          {results.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-2 w-16"></th>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Author</th>
                    <th className="px-3 py-2 w-16">Year</th>
                    <th className="px-3 py-2 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((book) => (
                    <tr
                      key={book.ol_key}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <CoverImg coverId={book.cover_id} title={book.title} />
                      </td>
                      <td className="px-3 py-3 font-medium">{book.title}</td>
                      <td className="px-3 py-3 text-gray-600">
                        {book.author || "Unknown"}
                      </td>
                      <td className="px-3 py-3 text-gray-500">
                        {book.first_publish_year || "-"}
                      </td>
                      <td className="px-3 py-3">
                        {savedKeys.has(book.ol_key) ? (
                          <span className="text-xs text-green-600 font-medium">
                            Saved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSave(book)}
                            className="text-xs text-gray-600 hover:text-gray-900 font-medium cursor-pointer transition-colors"
                          >
                            + Save
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "saved" && (
        <div>
          {saved.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              No saved books yet. Search and save some!
            </p>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-2 w-16"></th>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Author</th>
                    <th className="px-3 py-2 w-16">Year</th>
                    <th className="px-3 py-2 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {saved.map((book) => (
                    <tr
                      key={book.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <CoverImg coverId={book.cover_id} title={book.title} />
                      </td>
                      <td className="px-3 py-3 font-medium">{book.title}</td>
                      <td className="px-3 py-3 text-gray-600">
                        {book.author || "Unknown"}
                      </td>
                      <td className="px-3 py-3 text-gray-500">
                        {book.first_publish_year || "-"}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleRemove(book.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
