import React, { useState } from "react";
import axios from "axios";
import MicButton from "./MicButton";

export default function InputBar({ onSend }) {
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ Automatically use Render URL if available
  const backendURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSend = async () => {
    if (input.trim()) {
      await handleChat(input);
      setInput("");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleVoice = async (text) => {
    if (text) await handleChat(text);
  };

  const handleChat = async (userText) => {
    try {
      // ✅ Dynamic backend URL
      const res = await axios.post(`${backendURL}/api/chat/message`, {
        message: userText,
      });

      const botReply = res.data.reply || res.data.text;
      onSend(userText, botReply); // update chat UI

      // Speak bot’s reply
      if (botReply) playTTS(botReply);
    } catch (err) {
      console.error("❌ Chat error:", err);
    }
  };

  const playTTS = async (text) => {
    try {
      // ✅ Dynamic backend URL
      const res = await axios.post(`${backendURL}/api/tts/speak`, { text });
      const audioUrl = res.data.audioUrl;

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setIsSpeaking(true);
        audio.play();
        audio.onended = () => setIsSpeaking(false);
      }
    } catch (err) {
      console.error("❌ TTS playback failed:", err);
    }
  };

  return (
    <div className="input-bar slide-up">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Type something..."
      />
      <button className="send-btn" onClick={handleSend}>
        Send
      </button>
      <MicButton onVoice={handleVoice} />
      {isSpeaking && <span className="speaking-indicator">🔊 Speaking...</span>}
    </div>
  );
}
