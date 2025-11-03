import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ChatBubble from "./components/ChatBubble";
import InputBar from "./components/InputBar";
import AppointmentForm from "./components/AppointmentForm";
import HomePage from "./components/HomePage";

function ChatPage() {
  const [messages, setMessages] = React.useState([
    { sender: "ai", text: "👋 Hello, I’m your smart dental receptionist. How can I help you today?" },
  ]);
  const chatRef = React.useRef(null);

  // ✅ Dynamically pick backend (local or deployed)
  const backendURL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      console.log("🔹 Sending chat to:", `${backendURL}/api/chat/message`);

      const res = await fetch(`${backendURL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const aiMsg = {
        sender: "ai",
        text: data.text || data.reply || "⚠️ No valid response from server.",
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Auto-scroll to latest message
      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);

      // Optional: play TTS audio if provided
      if (data.ttsUrl) {
        const audio = new Audio(data.ttsUrl);
        audio.play();
      }
    } catch (err) {
      console.error("❌ Chat fetch error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Server not reachable or crashed." },
      ]);
    }
  };

  return (
    <div className="background">
      <div className="floating-orb orb1"></div>
      <div className="floating-orb orb2"></div>

      <div className="app-container">
        <header className="fade-in">
          <h1>🦷 Voice AI Receptionist</h1>
          <p>AI-powered booking assistant for your dental clinics</p>
        </header>

        <main ref={chatRef} className="chat-box">
          {messages.map((msg, i) => (
            <ChatBubble key={i} sender={msg.sender} text={msg.text} />
          ))}
        </main>

        <InputBar onSend={sendMessage} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">🏠 Home</Link>
        <Link to="/chat">💬 Chat</Link>
        <Link to="/appointment">📅 Appointment</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/appointment" element={<AppointmentForm />} />
      </Routes>
    </Router>
  );
}
