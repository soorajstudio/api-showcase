import React from "react";
import { T } from "../shared/theme";

export default function Section({ id, eyebrow, title, description, tint, wide, children }) {
  return (
    <section
      id={id}
      style={{
        width: "100%",
        // 1. TOP & BOTTOM PADDING OUTSIDE THE CONTENT
        // Reduce from 90px down to 30px or 40px to pull the whole section up
        padding: "35px 24px", 
        borderBottom: `1px solid ${T.border}`,
        background: tint ? T.surface : "transparent",
        scrollMarginTop: 68,
      }}
    >
      <div style={{ maxWidth: wide ? 1040 : 880, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: T.accent,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            // 2. SPACE BELOW "01 · LIVE API"
            marginBottom: 6, 
          }}
        >
          {eyebrow}
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)",
            fontWeight: 700,
            color: T.text,
            // 3. SPACE BELOW "Weather" TITLE
            margin: "0 0 8px", 
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        {description && (
          <p 
            style={{ 
              color: T.textMuted, 
              fontSize: 15.5, 
              lineHeight: 1.5, 
              maxWidth: 620, 
              // 4. SPACE BETWEEN DESCRIPTION TEXT & THE CARD
              // Reduced from 36px to 14px to pull the card closer to the top header
              marginBottom: 14 
            }}
          >
            {description}
          </p>
        )}
        <div>{children}</div>
      </div>
    </section>
  );
}