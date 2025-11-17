import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ThemeToggle from "./components/ThemeToggle";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Lumibyte Chat</h2>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
          <Sidebar api={API} />
        </div>

        <div className="col-span-9">
          <Routes>
            <Route path="/" element={<Landing api={API} />} />
            <Route path="/chat/:sessionId" element={<ChatWindow api={API} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Landing({ api }) {
  const navigate = useNavigate();
  async function newChat() {
    const r = await fetch(`${api}/api/new-chat`);
    const j = await r.json();
    navigate(`/chat/${j.id}`);
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="text-2xl mb-4">Start a new chat</h3>
      <p className="mb-4">
        Click below to create a new conversation session (unique ID in URL).
      </p>
      <button
        onClick={newChat}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        New Chat
      </button>
    </div>
  );
}
