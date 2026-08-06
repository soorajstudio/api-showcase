import React, { useState, useEffect, useRef } from "react";
import { T } from "../shared/theme";
import { CardShell } from "../shared/primitives";

/* ------------------------------------------------------------------
   Gemini AI — interactive chat with local canned replies.
   No live model key is wired up here. To connect a real model,
   replace pickReply() with a fetch() call to your backend / API.
------------------------------------------------------------------- */
function pickReply(input) {
  const q = input.toLowerCase();
  if (q.includes("react")) {
    return "React is a JavaScript library for building interfaces. You build small reusable components and assemble them into a full UI — like Lego blocks.";
  }
  if (q.includes("api")) {
    return "An API is a contract that lets two programs talk to each other — you send a request, the server sends back structured data, usually JSON.";
  }
  if (q.includes("hello") || q.includes("hi")) {
    return "Hey! Ask me about React, APIs, or anything on this dashboard — I'll do my best with a canned demo brain.";
  }
  if (q.includes("weather")) {
    return "Check the Weather section — it's pulling real live data right now.";
  }
  return "This is a local demo reply since no live model key is configured here — but the input, send button, and message thread are fully wired up.";
}

export default function GeminiCard() {
  const [messages, setMessages] = useState([{ role: "ai", text: 'Ask me anything — try "what is React?"' }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: pickReply(text) }]);
      setThinking(false);
    }, 550 + Math.random() * 400);
  };

  return (
    <CardShell icon="✨" title="Gemini AI" badgeKind="mock" badgeText="API key" status="static">
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          maxHeight: 190,
          paddingRight: 2,
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "ai" ? "flex-start" : "flex-end",
              maxWidth: "85%",
              background: m.role === "ai" ? T.surfaceRaised : T.accentDim,
              color: m.role === "ai" ? T.text : "#dbe4ff",
              padding: "9px 12px",
              borderRadius: m.role === "ai" ? "10px 10px 10px 2px" : "10px 10px 2px 10px",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            {m.text}
          </div>
        ))}
        {thinking && (
          <div
            style={{
              alignSelf: "flex-start",
              background: T.surfaceRaised,
              padding: "9px 12px",
              borderRadius: "10px 10px 10px 2px",
              color: T.textMuted,
              fontSize: 13,
            }}
          >
            <span className="typing-dots">···</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message the demo model…"
          style={{
            flex: 1,
            background: T.surfaceRaised,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "9px 12px",
            color: T.text,
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            background: T.accent,
            border: "none",
            borderRadius: 8,
            padding: "0 16px",
            color: "#0B0E14",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </CardShell>
  );
}
