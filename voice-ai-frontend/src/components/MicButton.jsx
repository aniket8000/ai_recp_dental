import React, { useState } from "react";
import axios from "axios";

export default function MicButton({ onVoice }) {
  const [recording, setRecording] = useState(false);

  // ✅ Dynamically choose backend (works locally + on deploy)
  const backendURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleMic = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("🎙️ Your browser doesn’t support speech recognition. Try Chrome.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();
    setRecording(true);

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      console.log("🎧 Recognized:", text);

      // Send recognized text to backend (optional, like typing)
      try {
        const res = await axios.post(`${backendURL}/api/chat/message`, {
          text,
        });

        const reply = res.data.text || res.data.reply || "Sorry, I didn’t get that.";
        onVoice(reply);

        // Play reply (AI speaking back)
        if (res.data.ttsUrl) {
          const audio = new Audio(res.data.ttsUrl);
          audio.play();
        }
      } catch (err) {
        console.error("❌ Voice AI error:", err.message);
        onVoice("Server not reachable or failed to respond.");
      }

      setRecording(false);
    };

    recognition.onerror = (err) => {
      console.error("🎤 Speech recognition error:", err);
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };
  };

  return (
    <button
      className={`mic-btn ${recording ? "pulse" : ""}`}
      onClick={handleMic}
      title="Speak to the assistant"
    >
      {recording ? "🎙️ Listening..." : "🎤"}
    </button>
  );
}
