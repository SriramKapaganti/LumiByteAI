import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ api }) {
  const [sessions, setSessions] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      const r = await fetch(`${api}/api/sessions`);
      const j = await r.json();
      setSessions(j.slice().reverse());
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded p-3 shadow">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Conversations</h4>
        <button className="text-sm text-indigo-500" onClick={fetchSessions}>
          Refresh
        </button>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {sessions.length === 0 && (
          <div className="text-sm text-gray-500">No sessions — create one</div>
        )}
        {sessions.map((s) => (
          <Link
            key={s.id}
            to={`/chat/${s.id}`}
            className={`block p-2 rounded ${
              location.pathname === `/chat/${s.id}`
                ? "bg-indigo-50 dark:bg-indigo-900"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <div className="text-sm font-semibold truncate">{s.title}</div>
            <div className="text-xs text-gray-500">
              {new Date(s.createdAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
