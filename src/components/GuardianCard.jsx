import React from "react";
import { T } from "../shared/theme";
import { CardShell } from "../shared/primitives";

/* ------------------------------------------------------------------
   The Guardian — mocked (needs an API key to call live).
   Swap the text below for real content, or wire up a real fetch to
   https://content.guardianapis.com/... once you have a key.
------------------------------------------------------------------- */
export default function GuardianCard() {
  return (
    <CardShell icon="📰" title="The Guardian" badgeKind="mock" badgeText="API key" status="static">
      <div style={{ color: T.accent, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
        TECHNOLOGY
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: T.text, lineHeight: 1.4, marginBottom: 10 }}>
        New advancements in AI are reshaping web development frameworks
      </div>
      <div style={{ color: T.textMuted, fontSize: 12.5 }}>By Tech Correspondent · Published 2 hours ago</div>
      <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.6, marginTop: 14 }}>
        Developer tooling is shifting fast as generative models get woven directly into build pipelines, editors, and
        design systems — reshaping how teams ship interfaces.
      </p>
    </CardShell>
  );
}
