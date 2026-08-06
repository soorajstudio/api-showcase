import React, { useState, useEffect } from "react";
import { T } from "../shared/theme";

/* ------------------------------------------------------------------
   Weather — Open-Meteo (live, no key needed).
   Redesigned as a full-bleed atmospheric hero (photo background,
   large editorial temperature type, wavy 7-day forecast line).
------------------------------------------------------------------- */

const LOCATION = { name: "Thrissur, Kerala", lat: 10.52, lon: 76.21 };

const WEATHER_CODES = {
  clear: [0, 1],
  cloudy: [2, 3, 45, 48],
  rain: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  storm: [95, 96, 99],
  snow: [71, 73, 75, 77, 85, 86],
};

// NEW: Function to return a background image based on the current weather condition
function getBackgroundImage(code) {
  if (WEATHER_CODES.clear.includes(code)) {
    return "https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1600&auto=format&fit=crop"; // Sunny sky
  }
  if (WEATHER_CODES.cloudy.includes(code)) {
    return "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1600&auto=format&fit=crop"; // Overcast/Cloudy
  }
  if (WEATHER_CODES.rain.includes(code)) {
    return "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1600&auto=format&fit=crop"; // Rain drops on glass
  }
  if (WEATHER_CODES.storm.includes(code)) {
    return "https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?q=80&w=1600&auto=format&fit=crop"; // Dark storm clouds/lightning
  }
  if (WEATHER_CODES.snow.includes(code)) {
    return "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=1600&auto=format&fit=crop"; // Snow-covered trees
  }
  // Default fallback (the original image)
  return "https://images.unsplash.com/photo-1499956827185-0d63ee78a910?q=80&w=1600&auto=format&fit=crop"; 
}

function codeLabel(code) {
  if (WEATHER_CODES.clear.includes(code)) return "Clear";
  if (WEATHER_CODES.cloudy.includes(code)) return "Cloudy";
  if (WEATHER_CODES.rain.includes(code)) return "Rain";
  if (WEATHER_CODES.storm.includes(code)) return "Storm";
  if (WEATHER_CODES.snow.includes(code)) return "Snow";
  return "—";
}

function conditionHeadline(code) {
  if (WEATHER_CODES.storm.includes(code)) return { main: "Stormy", sub: "with heavy rain" };
  if (WEATHER_CODES.rain.includes(code)) return { main: "Rainy", sub: "showers expected" };
  if (WEATHER_CODES.cloudy.includes(code)) return { main: "Cloudy", sub: "partly overcast skies" };
  if (WEATHER_CODES.snow.includes(code)) return { main: "Snowy", sub: "light snowfall" };
  return { main: "Clear", sub: "mostly sunny skies" };
}

function dayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { weekday: "long" });
}

function buildWavePath(temps, width, height) {
  if (!temps.length) return { d: "", points: [] };
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;
  const stepX = width / (temps.length - 1);
  const points = temps.map((t, i) => {
    const x = i * stepX;
    const y = height - ((t - min) / range) * height * 0.7 - height * 0.15;
    return [x, y];
  });

  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return { d, points };
}

export default function WeatherCard() {
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    )
      .then((r) => r.json())
      .then((raw) => {
        if (cancelled) return;
        setState({
          status: "live",
          data: { current: raw.current_weather, daily: raw.daily },
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          status: "error",
          data: {
            current: { temperature: 23, weathercode: 95, windspeed: 14 },
            daily: {
              time: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              weathercode: [95, 3, 61, 3, 2, 3, 1],
              temperature_2m_max: [28, 26, 27, 24, 23, 30, 25],
              temperature_2m_min: [21, 20, 19, 18, 18, 22, 19],
            },
          },
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          height: 480,
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
        loading conditions…
      </div>
    );
  }

  const { current, daily } = state.data;
  const headline = conditionHeadline(current.weathercode);
  const days = daily.time.slice(0, 7);
  const highs = daily.temperature_2m_max.slice(0, 7);
  const lows = daily.temperature_2m_min.slice(0, 7);

  const chartW = 720;
  const chartH = 90;
  const wave = buildWavePath(highs, chartW, chartH);
  const todayIndex = new Date().getDay() % 7;

  // NEW: Grab the correct image based on the live data
  const currentBgImage = getBackgroundImage(current.weathercode);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 900,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
      }}
    >
      {/* Background photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          // UPDATED: Use the dynamic image variable
          backgroundImage: `url(${currentBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.5s ease-in-out", // Added a smooth fade if it updates
        }}
      />
      {/* Legibility scrim */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(6,10,16,0.35) 0%, rgba(6,10,16,0.55) 55%, rgba(6,10,16,0.88) 100%)",
        }}
      />

      <div style={{ position: "relative", padding: "28px 32px 30px", color: "#fff" }}>
        {/* Top row: location + live badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 46 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, opacity: 0.9 }}>
            <span>📍</span>
            {LOCATION.name}
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
            LIVE · OPEN-METEO
          </div>
        </div>

        {/* Headline + big temp */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 44 }}>
          <div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {headline.main}
            </h2>
            <div style={{ fontSize: 16, opacity: 0.85, marginTop: 6 }}>{headline.sub}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 64, lineHeight: 1 }}>
              {Math.round(current.temperature)}°
            </div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
              {codeLabel(current.weathercode)} · wind {Math.round(current.windspeed)} km/h
            </div>
          </div>
        </div>

        {/* Wavy 7-day forecast */}
        <div style={{ position: "relative" }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height={chartH} style={{ display: "block", overflow: "visible" }}>
            <path d={wave.d} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" />
            {wave.points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === todayIndex ? 5 : 3} fill="#fff" opacity={i === todayIndex ? 1 : 0.6} />
            ))}
          </svg>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            {days.map((d, i) => (
              <div key={d} style={{ textAlign: "center", flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4, whiteSpace: "nowrap" }}>{dayLabel(d)}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15 }}>
                  {Math.round(highs[i])}°
                </div>
                <div style={{ fontSize: 11.5, opacity: 0.6 }}>{Math.round(lows[i])}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}