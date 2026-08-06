import React from "react";
import { T } from "../shared/theme";

/* ------------------------------------------------------------------
   Nav config — id must match a Section's id prop, label is the text
   shown in the top bar. Add/remove/reorder items here to change nav.
------------------------------------------------------------------- */
export const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "weather", label: "Weather" },
  { id: "quote", label: "Quotes" },
  { id: "trivia", label: "Trivia" },
  { id: "products", label: "Shop" },
  { id: "football", label: "Football" },
  { id: "tmdb", label: "Movies" },
  { id: "spotify", label: "Music" },
  { id: "gemini", label: "AI Chat" },
  { id: "guardian", label: "News" },
  { id: "contact", label: "Contact" },
];

export default function TopNav({ active, onNavigate }) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "rgba(11,14,20,0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: T.text,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.live, animation: "pulse 1.4s infinite" }} />
          API Console
        </div>
        <div style={{ display: "flex", gap: 2, overflowX: "auto", scrollbarWidth: "none" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: "none",
                border: "none",
                padding: "8px 12px",
                fontSize: 12.5,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: active === item.id ? T.text : T.textMuted,
                cursor: "pointer",
                whiteSpace: "nowrap",
                borderBottom: `2px solid ${active === item.id ? T.accent : "transparent"}`,
                transition: "color 0.15s ease, border-color 0.15s ease",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
