import React, { useState } from "react";
import { T } from "../shared/theme";
import { useApi } from "../shared/primitives";

/* ------------------------------------------------------------------
   Quote — Quotable (live, with local fallback since it's occasionally flaky)
   Redesigned to match the full-bleed atmospheric style, now with a refresh button.
------------------------------------------------------------------- */

const BG_IMAGE = "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1600&auto=format&fit=crop";

export default function QuoteCard() {
  // NEW: State to trigger a refresh
  const [refreshCount, setRefreshCount] = useState(0);

  // UPDATED: Appended `?t=${refreshCount}` to the URL so it re-fetches when the button is clicked
  const { status, data, latencyMs } = useApi(
    `https://api.quotable.io/random?t=${refreshCount}`,
    (raw) => ({ content: raw.content, author: raw.author }),
    { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" }
  );

  if (status === "loading") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          minHeight: 320,
          borderRadius: 20,
          background: T.surfaceRaised,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.textMuted,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
        }}
      >
        loading quote…
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 900,
        minHeight: 320,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Legibility scrim */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(6,10,16,0.6) 0%, rgba(6,10,16,0.88) 100%)",
        }}
      />

      <div style={{ position: "relative", padding: "32px", color: "#fff", display: "flex", flexDirection: "column", flex: 1 }}>
        
        {/* Top row: Icon + live badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, opacity: 0.9 }}>
            <span>✍️</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Quotable</span>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              letterSpacing: "0.06em",
              padding: "5px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.live }} />
            LIVE API {latencyMs ? `· ${latencyMs}ms` : ""}
          </div>
        </div>

        {/* Quote Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 760 }}>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)", 
              lineHeight: 1.3,
              color: "#fff",
              marginBottom: 24,
              textWrap: "balance",
            }}
          >
            "{data.content}"
          </div>
          <div 
            style={{ 
              color: T.accent, 
              fontWeight: 600, 
              fontSize: 16,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "0.02em",
              marginBottom: 32 // Added margin to space out the button
            }}
          >
            — {data.author}
          </div>

          {/* NEW: Refresh Button */}
          <div>
            <button
              onClick={() => setRefreshCount(c => c + 1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(1px)";
              }}
            >
              <span style={{ fontSize: 16 }}>🔄</span>
              New Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}