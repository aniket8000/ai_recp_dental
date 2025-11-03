import React, { useState } from "react";
import axios from "axios";
import MicButton from "./MicButton";

export default function InputBar({ onSend }) {
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

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
      // Send user message to backend chat API
      const res = await axios.post("http://localhost:3000/api/chat/message", {
        message: userText,
      });

      const botReply = res.data.reply;
      onSend(userText, botReply); // update chat UI

      // Speak bot’s reply
      if (botReply) playTTS(botReply);
    } catch (err) {
      console.error("❌ Chat error:", err);
    }
  };

  const playTTS = async (text) => {
    try {
      const res = await axios.post("http://localhost:3000/api/tts/speak", {
        text,
      });
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
