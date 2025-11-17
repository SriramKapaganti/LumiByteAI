import React from "react";

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 rounded-full flex items-center justify-center 
                 bg-gray-200 dark:bg-gray-700 transition-all hover:scale-110"
    >
      {theme === "light" ? (
        <span className="text-yellow-500 text-2xl transition-all">☀️</span>
      ) : (
        <span className="text-blue-300 text-2xl transition-all">🌙</span>
      )}
    </button>
  );
}
