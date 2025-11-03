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

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      const aiMsg = { sender: "ai", text: data.text || "Sorry, something went wrong." };
      setMessages((prev) => [...prev, aiMsg]);

      setTimeout(() => {
        chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
      }, 100);

      if (data.ttsUrl) new Audio(data.ttsUrl).play();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Server not reachable." }]);
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
