import React from "react";
import { T } from "../shared/theme";
import { CardShell } from "../shared/primitives";

/* ------------------------------------------------------------------
   TMDB — mocked (needs an API key to call live).
   Swap the img src / text below for real content, or wire up a
   real fetch to https://api.themoviedb.org/3/... once you have a key.
------------------------------------------------------------------- */
export default function TmdbCard() {
  return (
    <CardShell icon="🎬" title="TMDB" badgeKind="mock" badgeText="Auth required" status="static">
      <div style={{ display: "flex", gap: 14 }}>
        <img
          src="https://image.tmdb.org/t/p/w200/m80kPdrmlIRIGVKYYevWexEEB9A.jpg"
          alt="One Piece Film: Red"
          style={{ width: 74, borderRadius: 8, boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }}
        />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>One Piece Film: Red</div>
          <div style={{ color: T.warn, fontSize: 13, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>★ 8.2 / 10</div>
        </div>
      </div>
      <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.6, marginTop: 14 }}>
        Uta — the most beloved singer in the world, whose voice has been described as otherworldly — is renowned for
        concealing her own identity while performing.
      </p>
    </CardShell>
  );
}
