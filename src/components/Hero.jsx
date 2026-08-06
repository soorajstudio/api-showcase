import React from "react";
import { T } from "../shared/theme";

/* ------------------------------------------------------------------
   Hero — the "About" section at the top of the page.
   Edit the heading/copy here.
------------------------------------------------------------------- */
export default function Hero() {
  return (
    <section
      id="about"
      style={{
        width: "100%",
        padding: "100px 24px 80px",
        textAlign: "center",
        borderBottom: `1px solid ${T.border}`,
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,156,255,0.14), transparent)",
        scrollMarginTop: 68,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: T.textMuted,
          border: `1px solid ${T.border}`,
          borderRadius: 999,
          padding: "6px 14px",
          marginBottom: 24,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.live, animation: "pulse 1.4s infinite" }} />
        6 live endpoints · 3 demo interfaces
      </div>
      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
          fontWeight: 700,
          color: T.text,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        API Interface Console
      </h1>
      <p style={{ color: T.textMuted, fontSize: 16.5, maxWidth: 560, margin: "18px auto 0", lineHeight: 1.6 }}>
        Nine APIs, each with its own dedicated section below. Live tiles fetch real data on load; auth-gated services
        show a faithful interface preview instead. Use the nav above to jump straight to one.
      </p>
    </section>
  );
}
