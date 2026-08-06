import React, { useState, useEffect } from "react";
import { T } from "../shared/theme";

/* ------------------------------------------------------------------
   Football — TheSportsDB (live).
   Rebuilt in the same full-bleed editorial language as WeatherCard:
   a match photo fills the background, the score sits large on top,
   with a scrollable list of previous results below the hero.

   Edit TEAM_NAME below to track a different club.
------------------------------------------------------------------- */

const TEAM_NAME = "Arsenal";

const FALLBACK_EVENTS = [
  {
    idEvent: "1",
    strHomeTeam: "Arsenal",
    strAwayTeam: "Real Betis",
    intHomeScore: "1",
    intAwayScore: "3",
    strLeague: "Club Friendlies",
    strStatus: "FT",
    strThumb: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop",
    strGoalDetails: "Piero Hincapié 32' (Arsenal) · Riquelme 9', Deossa 26', Fornals 43' (Betis)",
  },
  {
    idEvent: "2",
    strHomeTeam: "Tottenham",
    strAwayTeam: "Arsenal",
    intHomeScore: "0",
    intAwayScore: "2",
    strLeague: "English Premier League",
    strStatus: "FT",
    strThumb: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop",
    strGoalDetails: "Bukayo Saka 14', Leandro Trossard 68' (Arsenal)",
  },
  {
    idEvent: "3",
    strHomeTeam: "Arsenal",
    strAwayTeam: "Chelsea",
    intHomeScore: "3",
    intAwayScore: "1",
    strLeague: "English Premier League",
    strStatus: "FT",
    strThumb: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1600&auto=format&fit=crop",
    strGoalDetails: "Gabriel Martinelli 10', Kai Havertz 45', Bukayo Saka 80' (Arsenal) · Cole Palmer 60' (Chelsea)",
  },
];

const DEFAULT_MATCH_PHOTO = "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1600&auto=format&fit=crop";

export default function FootballCard() {
  const [state, setState] = useState({ status: "loading", data: null });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const teamRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${TEAM_NAME}`);
        const teamJson = await teamRes.json();
        const team = teamJson.teams?.[0];
        if (!team) throw new Error("team not found");

        const evRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.idTeam}`);
        const evJson = await evRes.json();
        const events = evJson.results || [];
        if (cancelled) return;
        if (events.length === 0) throw new Error("no events");

        setState({ status: "live", data: { team, events } });
        setSelected(events[0]);
      } catch (e) {
        if (cancelled) return;
        setState({ status: "error", data: { team: { strTeam: TEAM_NAME, strBadge: "" }, events: FALLBACK_EVENTS } });
        setSelected(FALLBACK_EVENTS[0]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading" || !selected) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          height: 560,
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
        loading match data…
      </div>
    );
  }

  const { team, events } = state.data;

  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      <MatchHero match={selected} teamBadge={team?.strBadge} />
      <MatchList events={events} selected={selected} onSelect={setSelected} />
    </div>
  );
}

/* ------------------------------------------------------------------
   Hero — full-bleed photo behind a large scoreline, same visual
   language as WeatherCard (scrim gradient, editorial type, live badge).
------------------------------------------------------------------- */
function MatchHero({ match, teamBadge }) {
  const homeScore = match.intHomeScore;
  const awayScore = match.intAwayScore;
  const hasScore = homeScore !== null && homeScore !== undefined && homeScore !== "";
  const isFinished = hasScore && ["FT", "Match Finished", "AET"].includes(match.strStatus);
  const isLive = hasScore && !isFinished;

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
          backgroundImage: `url(${match.strThumb || DEFAULT_MATCH_PHOTO})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(6,10,16,0.35) 0%, rgba(6,10,16,0.55) 55%, rgba(6,10,16,0.9) 100%)",
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
        {/* Top row: league + status badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 46 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, opacity: 0.9 }}>
            <span>🏟️</span>
            {match.strLeague}
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
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: isLive ? T.live : "rgba(255,255,255,0.6)",
                animation: isLive ? "pulse 1.2s infinite" : "none",
              }}
            />
            {isFinished ? "FULL TIME" : isLive ? "LIVE" : "UPCOMING"}
          </div>
        </div>

        {/* Scoreline */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, marginBottom: 40 }}>
          <TeamCol name={match.strHomeTeam} badge={match.strHomeTeam === TEAM_NAME ? teamBadge : null} />

          <div style={{ textAlign: "center", minWidth: 120 }}>
            {hasScore ? (
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(2.6rem, 5vw, 3.6rem)",
                  lineHeight: 1,
                }}
              >
                {homeScore} <span style={{ opacity: 0.4, fontSize: "0.6em" }}>–</span> {awayScore}
              </div>
            ) : (
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, opacity: 0.85 }}>VS</div>
            )}
          </div>

          <TeamCol name={match.strAwayTeam} badge={match.strAwayTeam === TEAM_NAME ? teamBadge : null} />
        </div>

        {/* Goals / timeline strip */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: 5,
            }}
          >
            Goals & timeline
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.92 }}>
            {match.strGoalDetails || "No goal data recorded for this fixture."}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamCol({ name, badge }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 110 }}>
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {badge ? (
          <img src={badge} alt={name} style={{ width: "68%", height: "68%", objectFit: "contain" }} />
        ) : (
          <span style={{ fontSize: 18, fontWeight: 700 }}>{name?.[0] ?? "?"}</span>
        )}
      </div>
      <div style={{ fontSize: 12.5, textAlign: "center", lineHeight: 1.3, opacity: 0.9 }}>{name}</div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Match list — recent results below the hero, click to swap the hero
------------------------------------------------------------------- */
function MatchList({ events, selected, onSelect }) {
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
        Recent results
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {events.map((ev) => {
          const isSelected = selected?.idEvent === ev.idEvent;
          return (
            <button
              key={ev.idEvent}
              onClick={() => onSelect(ev)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "left",
                background: isSelected ? T.surfaceRaised : "transparent",
                border: `1px solid ${isSelected ? T.accent : T.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>
                {ev.strHomeTeam} <span style={{ color: T.textFaint }}>vs</span> {ev.strAwayTeam}
              </span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: isSelected ? T.accent : T.textMuted,
                }}
              >
                {ev.intHomeScore}–{ev.intAwayScore}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}