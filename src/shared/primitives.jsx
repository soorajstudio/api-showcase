import React, { useState, useEffect } from "react";
import { T } from "./theme";

/* ------------------------------------------------------------------
   Shared building blocks used by every card in components/.
   Edit here if you want to change the LOOK of every card at once.
   Edit an individual file in components/ to change just ONE api's card.
------------------------------------------------------------------- */

export function StatusStrip({ state }) {
  // state: 'loading' | 'live' | 'error' | 'static'
  const color =
    state === "live" ? T.live : state === "error" ? T.danger : state === "loading" ? T.accent : T.warn;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: color,
        opacity: state === "loading" ? 0.9 : 0.75,
        animation: state === "loading" ? "pulse 1.4s ease-in-out infinite" : "none",
      }}
    />
  );
}

export function Badge({ kind, children }) {
  const styles = {
    live: { bg: T.liveDim, fg: T.live, dot: T.live },
    mock: { bg: T.warnDim, fg: T.warn, dot: T.warn },
  };
  const s = styles[kind] || styles.mock;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",
        padding: "4px 10px 4px 8px",
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          boxShadow: kind === "live" ? `0 0 6px ${s.dot}` : "none",
        }}
      />
      {children}
    </span>
  );
}

export function CardShell({ icon, title, badgeKind, badgeText, status, latencyMs, children }) {
  return (
    <div
      style={{
        position: "relative",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "24px 24px 20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 260,
        maxWidth: 480,
      }}
    >
      <StatusStrip state={status} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          paddingBottom: 14,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: T.text,
          }}
        >
          <span style={{ fontSize: 18 }}>{icon}</span>
          {title}
        </div>
        <Badge kind={badgeKind}>{badgeText}</Badge>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
      <div
        style={{
          marginTop: 16,
          paddingTop: 10,
          borderTop: `1px dashed ${T.border}`,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          color: T.textFaint,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          {status === "loading" && "fetching…"}
          {status === "live" && `resolved · ${latencyMs}ms`}
          {status === "error" && "fallback data"}
          {status === "static" && "no network call"}
        </span>
        <span>{badgeKind === "live" ? "GET" : "n/a"}</span>
      </div>
    </div>
  );
}

export function Skeleton({ lines = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "center" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 14,
            width: `${85 - i * 15}%`,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${T.surfaceRaised} 25%, ${T.border} 50%, ${T.surfaceRaised} 75%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s infinite",
          }}
        />
      ))}
    </div>
  );
}

/* Generic fetch hook with latency + fallback tracking.
   Usage: const { status, data, latencyMs } = useApi(url, transformFn, fallbackData) */
export function useApi(url, transform, fallback) {
  const [state, setState] = useState({ status: "loading", data: null, latencyMs: null });
  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const data = transform(raw);
        setState({ status: "live", data, latencyMs: Math.round(performance.now() - start) });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: "error", data: fallback, latencyMs: null });
      });
    return () => {
      cancelled = true;
    };
  }, [url]);
  return state;
}
