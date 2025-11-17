import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ChatWindow({ api }) {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  // Load session history when screen opens
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`${api}/api/session/${sessionId}`);
        const data = await res.json();

        setMessages(
          data.history.map((m) => ({
            role: m.role,
            text: m.text,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    }
    loadSession();
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;

    // Show user message
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${api}/api/chat/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Server error." },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 p-4 overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-xl rounded-xl text-white ${
                msg.role === "user" ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="p-3 w-20 bg-gray-600 text-white rounded-xl animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input Section */}
      <div className="mt-4 flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-3 rounded-l-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white outline-none"
          placeholder="Type your message..."
        />

        <button
          onClick={sendMessage}
          className="px-5 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
