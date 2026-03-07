"use client";

import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Грешка при връзката с AI." }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Счетоводен Асистент</h1>
      
      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-20">
            Задай въпрос за счетоводство, данъци или осигуровки...
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-3 rounded-lg ${
              msg.role === "user" ? "bg-blue-500 text-white" : "bg-white border"
            }`}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <p className="text-gray-500">AI мисли...</p>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Напиши въпрос..."
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
        >
          Изпрати
        </button>
      </div>
    </div>
  );
}