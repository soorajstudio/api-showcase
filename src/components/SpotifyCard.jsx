import React, { useState, useRef, useEffect } from "react";
import { T } from "../shared/theme";

/* ------------------------------------------------------------------
   Music — mocked Spotify player (needs OAuth for real playback).
   Rebuilt in the same full-bleed editorial language as Weather and
   Football: album art fills the background, transport controls sit
   large on top, with a clickable track list below the hero.

   Playback is real (Web Audio API demo tones, since we can't legally
   stream actual Spotify audio without OAuth) — each track plays a
   different tone so switching is audibly distinct.

   Edit TRACKS below to change the track list / art / tone frequency.
------------------------------------------------------------------- */

const TRACKS = [
  {
    id: 1,
    title: "WE ARE! (One Piece Opening)",
    artist: "Hiroshi Kitadani",
    art: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop",
    duration: "4:31",
    freq: 392, // G4
    lyrics: [
      "Setting sail past the edge of the map",
      "chasing a rumor no one believed",
      "the horizon keeps moving, so we keep rowing",
      "somewhere out there the treasure is real",
    ],
  },
  {
    id: 2,
    title: "Overtaken",
    artist: "Skillet",
    art: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    duration: "3:48",
    freq: 440, // A4
    lyrics: [
      "Static in my chest, a storm I can't outrun",
      "every wall I build gets taken by the sun",
      "so I'm running through the fire, not away",
      "louder than the noise that told me to stay down",
    ],
  },
  {
    id: 3,
    title: "Midnight City",
    artist: "M83",
    art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
    duration: "4:03",
    freq: 349, // F4
    lyrics: [
      "Neon rivers running down the avenue",
      "a thousand windows and I'm looking for one",
      "the city hums a song it never finishes",
      "and somehow that's the part I love the most",
    ],
  },
  {
    id: 4,
    title: "Redbone",
    artist: "Childish Gambino",
    art: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop",
    duration: "5:27",
    freq: 294, // D4
    lyrics: [
      "Stay woke, the night moves slow tonight",
      "a groove wrapped around a warning",
      "keep one eye open even when it's sweet",
      "comfort has a way of costing you later",
    ],
  },
];

export default function SpotifyCard() {
  const [current, setCurrent] = useState(TRACKS[0]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const intervalRef = useRef(null);

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch (e) {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
  };

  const startTone = (freq) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.00001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      /* audio unavailable, still toggle UI state */
    }
  };

  const togglePlay = () => {
    if (!playing) {
      startTone(current.freq);
      intervalRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.5));
      }, 200);
      setPlaying(true);
    } else {
      stopTone();
      clearInterval(intervalRef.current);
      setPlaying(false);
    }
  };

  const playTrack = (track) => {
    stopTone();
    clearInterval(intervalRef.current);
    setCurrent(track);
    setProgress(0);
    startTone(track.freq);
    intervalRef.current = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.5));
    }, 200);
    setPlaying(true);
  };

  useEffect(() => {
    return () => {
      stopTone();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      <MusicHero track={current} playing={playing} progress={progress} onToggle={togglePlay} />
      <Playlist tracks={TRACKS} current={current} playing={playing} onSelect={playTrack} />
    </div>
  );
}

/* ------------------------------------------------------------------
   Hero — full-bleed album art behind large transport controls
------------------------------------------------------------------- */
function MusicHero({ track, playing, progress, onToggle }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 560,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${track.art})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.4s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(6,10,16,0.3) 0%, rgba(6,10,16,0.5) 50%, rgba(6,10,16,0.92) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          minHeight: 560,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "28px 32px 30px",
          color: "#fff",
        }}
      >
        {/* Top row: source + badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, opacity: 0.9 }}>
            <span>🎵</span>
            Spotify
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
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.warn }} />
            OAUTH 2.0
          </div>
        </div>

        {/* Lyric ticker — original demo lines, synced to progress */}
        <LyricTicker lines={track.lyrics} progress={progress} />

        {/* Track title + big play button */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 3.4vw, 2.4rem)",
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              {track.title}
            </div>
            <div style={{ fontSize: 15, opacity: 0.8 }}>{track.artist}</div>
          </div>

          <button
            onClick={onToggle}
            aria-label={playing ? "Pause" : "Play"}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "none",
              background: "#1db954",
              color: "#0B0E14",
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(29,185,84,0.45)",
            }}
          >
            {playing ? "❚❚" : "▶"}
          </button>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#1db954",
                transition: "width 0.2s linear",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11.5, opacity: 0.65, fontFamily: "'JetBrains Mono', monospace" }}>
            <span>demo tone · no audio key wired up</span>
            <span>{track.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   LyricTicker — shows the four demo lines, highlighting whichever one
   the progress bar is currently "over". These are original placeholder
   lines, not the real song's lyrics (which we can't reproduce).
------------------------------------------------------------------- */
function LyricTicker({ lines, progress }) {
  if (!lines || lines.length === 0) return null;
  const activeIndex = Math.min(lines.length - 1, Math.floor((progress / 100) * lines.length));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "auto 0" }}>
      <div
        style={{
          fontSize: 10,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.55,
          marginBottom: 2,
        }}
      >
        demo lyrics — original placeholder, not the real song
      </div>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: i === activeIndex ? "clamp(1.3rem, 2.6vw, 1.9rem)" : "clamp(1rem, 2vw, 1.3rem)",
            fontWeight: i === activeIndex ? 700 : 500,
            color: i === activeIndex ? "#fff" : "rgba(255,255,255,0.4)",
            transition: "all 0.3s ease",
            lineHeight: 1.3,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Playlist — track queue below the hero, click to swap what's playing
------------------------------------------------------------------- */
function Playlist({ tracks, current, playing, onSelect }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          fontSize: 11,
          color: T.textMuted,
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 10,
        }}
      >
        Up next
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tracks.map((t) => {
          const isSelected = current.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                background: isSelected ? T.surfaceRaised : "transparent",
                border: `1px solid ${isSelected ? T.accent : T.border}`,
                borderRadius: 10,
                padding: "8px 14px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  backgroundImage: `url(${t.art})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: T.text,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: 11.5, color: T.textMuted }}>{t.artist}</div>
              </div>
              {isSelected && playing ? (
                <span style={{ fontSize: 11, color: T.accent, fontFamily: "'JetBrains Mono', monospace" }}>▶ playing</span>
              ) : (
                <span style={{ fontSize: 11.5, color: T.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>{t.duration}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}