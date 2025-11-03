import React, { useState } from "react";
import axios from "axios";

export default function InputBar({ onSend }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto-switch between local and deployed
  const backendURL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

  const handleSend = async () => {
    if (!input.trim()) return;
    await handleChat(input.trim());
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleChat = async (userText) => {
    setLoading(true);
    try {
      console.log("🔹 Sending to backend:", `${backendURL}/api/chat/message`);

      const res = await axios.post(`${backendURL}/api/chat/message`, {
        message: userText,
      });

      console.log("✅ Chat response:", res.data);

      // ✅ Use the correct response property
      const botReply = res.data.text || res.data.reply || "No response from server.";
      onSend(userText, botReply);
    } catch (err) {
      console.error("❌ Chat error:", err);
      onSend(userText, "⚠️ Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-bar slide-up">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={loading ? "Waiting for response..." : "Type something..."}
        disabled={loading}
      />
      <button className="send-btn" onClick={handleSend} disabled={loading}>
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
