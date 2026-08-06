import React, { useState, useEffect } from "react";
import { T } from "./shared/theme";

import TopNav, { NAV_ITEMS } from "./components/TopNav";
import Hero from "./components/Hero";
import Section from "./components/Section";
import Contact from "./components/Contact";

import WeatherCard from "./components/WeatherCard";
import TriviaCard from "./components/TriviaCard";
import ProductsCard from "./components/ProductsCard";
import FootballCard from "./components/FootballCard";
import TmdbCard from "./components/TmdbCard";
import SpotifyCard from "./components/SpotifyCard";
import GeminiCard from "./components/GeminiCard";
import GuardianCard from "./components/GuardianCard";

export default function App() {
  const [active, setActive] = useState("about");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", width: "100%", fontFamily: "'Inter', sans-serif" }}>
      <TopNav active={active} onNavigate={scrollTo} />
      <Hero />

      <Section id="weather" eyebrow="01 · Live API" title="Weather" description="Real-time conditions pulled from Open-Meteo — no API key required." wide>
        <WeatherCard />
      </Section>

      <Section id="trivia" eyebrow="02 · Live API" title="Trivia" description="Multiple-choice questions from Open Trivia DB. Pick an answer to reveal the correct one, or fetch another." tint>
        <TriviaCard />
      </Section>

      <Section id="products" eyebrow="03 · Live API" title="Shop" description="Today's picks, pulled live from the DummyJSON product catalog.">
        <ProductsCard />
      </Section>

      <Section id="football" eyebrow="04 · Live API" title="Football" description="Latest Arsenal fixture from TheSportsDB — kickoff time if upcoming, live score treatment if underway or finished." tint wide>
        <FootballCard />
      </Section>

      <Section id="tmdb" eyebrow="05 · Auth required" title="Movies" description="TMDB requires an API key to call live, so this section shows a faithful interface preview.">
        <TmdbCard />
      </Section>

      <Section id="spotify" eyebrow="06 · OAuth 2.0" title="Music" description="Spotify's real player needs OAuth, but the play button here is fully functional — it plays a demo tone via the Web Audio API." tint wide>
        <SpotifyCard />
      </Section>

      <Section id="gemini" eyebrow="07 · API key" title="AI Chat" description="A working chat interface. No live model key is wired up, so replies come from a small local demo brain — but the thread is fully interactive.">
        <GeminiCard />
      </Section>

      <Section id="guardian" eyebrow="08 · API key" title="News" description="The Guardian's API also requires a key — shown here as a static article preview." tint>
        <GuardianCard />
      </Section>

      <Contact />
    </div>
  );
}