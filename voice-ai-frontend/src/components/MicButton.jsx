import React, { useState } from "react";
import axios from "axios";

export default function MicButton({ onVoiceResponse }) {
  const [recording, setRecording] = useState(false);

  const handleMic = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn’t support speech recognition. Use Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("🎙 Listening...");
      setRecording(true);
    };

    recognition.onresult = async (event) => {
      const userSpeech = event.results[0][0].transcript;
      console.log("🗣 You said:", userSpeech);
      setRecording(false);

      try {
        const res = await axios.post("http://localhost:3000/api/chat/message", {
          text: userSpeech,
        });

        const aiReply = res.data.text || "Sorry, I didn’t catch that.";
        const ttsUrl = res.data.ttsUrl;

        // send to chat UI
        onVoiceResponse(aiReply);

        // speak out loud
        if (ttsUrl) {
          const audio = new Audio(ttsUrl);
          audio.play();
        }
      } catch (error) {
        console.error("❌ Voice chat failed:", error);
        onVoiceResponse("⚠️ Error connecting to AI server.");
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setRecording(false);
    };

    recognition.onend = () => {
      console.log("🎤 Mic stopped");
      setRecording(false);
    };

    recognition.start();
  };

  return (
    <button
      className={`mic-btn ${recording ? "pulse" : ""}`}
      onClick={handleMic}
      title="Click to speak"
    >
      {recording ? "🛑" : "🎙"}
    </button>
  );
}
