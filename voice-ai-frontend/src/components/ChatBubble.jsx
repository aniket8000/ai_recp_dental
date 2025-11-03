import React from "react";
import "../App.css";

export default function ChatBubble({ sender, text }) {
  return (
    <div className={`chat-bubble ${sender} pop-in`}>
      <p>{text}</p>
    </div>
  );
}
