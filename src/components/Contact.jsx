import React from "react";
import { T } from "../shared/theme";

/* ------------------------------------------------------------------
   Contact — final section + footer. Edit the email/copy here.
------------------------------------------------------------------- */
export default function Contact() {
  return (
    <>
      <section id="contact" style={{ width: "100%", padding: "90px 24px 70px", textAlign: "center", scrollMarginTop: 68 }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: T.accent,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Get in touch
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)",
            fontWeight: 700,
            color: T.text,
            margin: "0 0 14px",
          }}
        >
          Built this? Or want one like it?
        </h2>
        <p style={{ color: T.textMuted, fontSize: 15.5, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.65 }}>
          This page is a template — swap in your own endpoints and keys to make each section real.
        </p>
        <a
          href="mailto:hello@example.com"
          style={{
            display: "inline-block",
            background: T.accent,
            color: "#0B0E14",
            fontWeight: 600,
            fontSize: 14,
            padding: "12px 26px",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          hello@example.com
        </a>
      </section>

      <footer
        style={{
          width: "100%",
          borderTop: `1px solid ${T.border}`,
          padding: "24px",
          textAlign: "center",
          color: T.textFaint,
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        built with React · open data from Open-Meteo, Quotable, DummyJSON, TheSportsDB & Open Trivia DB
      </footer>
    </>
  );
}
