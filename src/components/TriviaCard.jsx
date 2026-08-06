import React, { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------
   Trivia — ayiooo.test (Custom Mock API)
   Upgraded with Category Selection, Time-Based Scoring, and Auto-Advance.
------------------------------------------------------------------- */

const QUESTION_BANK = [
  // MOVIES
  { category: "Movies", question: "What movie features a giant ape climbing the Empire State Building?", correct: "King Kong", options: ["King Kong", "Godzilla", "Jurassic Park", "Transformers"] },
  { category: "Movies", question: "Who played Jack in the movie Titanic?", correct: "Leonardo DiCaprio", options: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp", "Tom Cruise"] },
  { category: "Movies", question: "What is the name of the wizarding school in Harry Potter?", correct: "Hogwarts", options: ["Hogwarts", "Narnia", "Middle Earth", "Westeros"] },
  { category: "Movies", question: "Which movie features the quote 'May the Force be with you'?", correct: "Star Wars", options: ["Star Wars", "Star Trek", "The Matrix", "Guardians of the Galaxy"] },
  { category: "Movies", question: "What is the highest-grossing film of all time (as of 2024)?", correct: "Avatar", options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"] },
  { category: "Movies", question: "Who directed the movie 'Jurassic Park'?", correct: "Steven Spielberg", options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "George Lucas"] },
  { category: "Movies", question: "In 'The Matrix', what color is the pill Neo takes to wake up?", correct: "Red", options: ["Red", "Blue", "Green", "Yellow"] },

  // ANIMALS
  { category: "Animals", question: "What is the fastest land animal?", correct: "Cheetah", options: ["Cheetah", "Lion", "Horse", "Ostrich"] },
  { category: "Animals", question: "What is the largest mammal on Earth?", correct: "Blue Whale", options: ["Blue Whale", "Elephant", "Giraffe", "Hippopotamus"] },
  { category: "Animals", question: "Which animal is known as the 'King of the Jungle'?", correct: "Lion", options: ["Lion", "Tiger", "Bear", "Gorilla"] },
  { category: "Animals", question: "How many arms does an octopus have?", correct: "8", options: ["8", "6", "10", "12"] },
  { category: "Animals", question: "What bird is a universal symbol of peace?", correct: "Dove", options: ["Dove", "Eagle", "Owl", "Swan"] },
  { category: "Animals", question: "Which mammal can truly fly?", correct: "Bat", options: ["Bat", "Flying Squirrel", "Lemur", "Sugar Glider"] },
  { category: "Animals", question: "What is the tallest living terrestrial animal?", correct: "Giraffe", options: ["Giraffe", "Elephant", "Camel", "Moose"] },

  // SCIENCE
  { category: "Science", question: "What force pulls objects toward the center of the Earth?", correct: "Gravity", options: ["Gravity", "Magnetism", "Friction", "Inertia"] },
  { category: "Science", question: "What is the chemical symbol for water?", correct: "H2O", options: ["H2O", "O2", "CO2", "HO"] },
  { category: "Science", question: "Which planet is known as the Red Planet?", correct: "Mars", options: ["Mars", "Jupiter", "Venus", "Saturn"] },
  { category: "Science", question: "Who developed the theory of relativity?", correct: "Albert Einstein", options: ["Albert Einstein", "Isaac Newton", "Nikola Tesla", "Galileo"] },
  { category: "Science", question: "What is the center of an atom called?", correct: "Nucleus", options: ["Nucleus", "Proton", "Electron", "Neutron"] },
  { category: "Science", question: "What is the speed of light in a vacuum (approx)?", correct: "300,000 km/s", options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "50,000 km/s"] },
  { category: "Science", question: "What gas makes up most of the Earth's atmosphere?", correct: "Nitrogen", options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Hydrogen"] },

  // NATURE
  { category: "Nature", question: "What is the process by which plants make their own food?", correct: "Photosynthesis", options: ["Photosynthesis", "Respiration", "Digestion", "Germination"] },
  { category: "Nature", question: "What is the hardest natural substance on Earth?", correct: "Diamond", options: ["Diamond", "Gold", "Iron", "Quartz"] },
  { category: "Nature", question: "Which gas do humans need to breathe to survive?", correct: "Oxygen", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"] },
  { category: "Nature", question: "What is the largest ocean on Earth?", correct: "Pacific Ocean", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"] },
  { category: "Nature", question: "What causes tides in the oceans?", correct: "The Moon's Gravity", options: ["The Moon's Gravity", "Earth's Rotation", "Wind", "Sunspots"] },
  { category: "Nature", question: "What is the tallest mountain in the world?", correct: "Mount Everest", options: ["Mount Everest", "K2", "Mount Kilimanjaro", "Denali"] },
  { category: "Nature", question: "What is the fastest growing plant in the world?", correct: "Bamboo", options: ["Bamboo", "Kelp", "Sunflower", "Eucalyptus"] },

  // SPORTS
  { category: "Sports", question: "How often are the Summer Olympics held?", correct: "Every 4 years", options: ["Every 4 years", "Every 2 years", "Every year", "Every 5 years"] },
  { category: "Sports", question: "What sport is known as 'The Beautiful Game'?", correct: "Soccer (Football)", options: ["Soccer (Football)", "Basketball", "Tennis", "Cricket"] },
  { category: "Sports", question: "In tennis, what piece of fruit is found at the top of the Wimbledon men's trophy?", correct: "Pineapple", options: ["Pineapple", "Strawberry", "Apple", "Grape"] },
  { category: "Sports", question: "How many players are on a standard baseball team on the field?", correct: "9", options: ["9", "11", "7", "10"] },
  { category: "Sports", question: "Who holds the record for the most Olympic gold medals?", correct: "Michael Phelps", options: ["Michael Phelps", "Usain Bolt", "Carl Lewis", "Mark Spitz"] },
  { category: "Sports", question: "In which sport would you perform a slam dunk?", correct: "Basketball", options: ["Basketball", "Volleyball", "Tennis", "Gymnastics"] },

  // TECH
  { category: "Tech", question: "What does CPU stand for?", correct: "Central Processing Unit", options: ["Central Processing Unit", "Computer Personal Unit", "Central Process Utility", "Core Processing Unit"] },
  { category: "Tech", question: "What is the main circuit board of a computer called?", correct: "Motherboard", options: ["Motherboard", "Hard Drive", "Processor", "Power Supply"] },
  { category: "Tech", question: "Which of these is a popular programming language?", correct: "Python", options: ["Python", "Cobra", "Viper", "Anaconda"] },
  { category: "Tech", question: "What does 'WWW' stand for in a website address?", correct: "World Wide Web", options: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"] },
  { category: "Tech", question: "Who co-founded Microsoft?", correct: "Bill Gates", options: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Elon Musk"] },
  { category: "Tech", question: "What does HTML stand for?", correct: "HyperText Markup Language", options: ["HyperText Markup Language", "HighText Machine Language", "HyperLoop Machine Language", "HyperText Multiple Language"] },
  { category: "Tech", question: "What is the smallest unit of data in a computer?", correct: "Bit", options: ["Bit", "Byte", "Pixel", "Nibble"] },
];

const DOMAINS = [...new Set(QUESTION_BANK.map((q) => q.category))];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function TriviaCard() {
  // Game States: "category_selection", "loading", "playing", "finished"
  const [gameState, setGameState] = useState("category_selection");
  const [selectedDomain, setSelectedDomain] = useState(null);
  
  // Question & Score State
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastEarned, setLastEarned] = useState(null); // Shows "+10", "+8" etc.
  
  // Interaction & Timer State
  const [revealed, setRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const startTimeRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);

  const QUESTIONS_PER_ROUND = 5;
  const labels = ["A", "B", "C", "D"];

  // Shared UI Colors
  const C = {
    bg: "#FFCC00", 
    text: "#002050", 
    white: "#FFFFFF",
    correct: "#00C853",
    incorrect: "#FF3D00",
  };

  // 1. Start a round based on domain
  const startRound = (domain) => {
    setGameState("loading");
    setSelectedDomain(domain);
    
    // Filter by domain and shuffle
    const domainQuestions = QUESTION_BANK.filter(q => q.category === domain);
    const shuffledBank = shuffleArray(domainQuestions);
    const batch = shuffledBank.slice(0, QUESTIONS_PER_ROUND);
    
    // Shuffle options for each question
    const preparedBatch = batch.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    setTimeout(() => {
      setCurrentQuestions(preparedBatch);
      setQuestionIndex(0);
      setScore(0);
      setLastEarned(null);
      setRevealed(false);
      setSelectedOption(null);
      setGameState("playing");
      startTimeRef.current = Date.now(); // Start the timer for Q1
    }, 600);
  };

  // Reset timer when a new question starts
  useEffect(() => {
    if (gameState === "playing" && !revealed) {
      startTimeRef.current = Date.now();
    }
  }, [questionIndex, gameState, revealed]);

  // Cleanup auto-advance timer if component unmounts
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // 2. Handle Answer & Calculate Time-based Score
  const handleAnswer = (opt) => {
    if (revealed) return; 
    setRevealed(true);
    setSelectedOption(opt);
    
    const activeQuestion = currentQuestions[questionIndex];
    let earnedPoints = 0;

    if (opt === activeQuestion.correct) {
      // Time-based scoring logic
      const elapsedMs = Date.now() - startTimeRef.current;
      if (elapsedMs <= 3000) {
        earnedPoints = 10; // Max points if answered under 3 seconds
      } else {
        // Lose 1 point for every extra second, minimum 1 point
        const extraSeconds = Math.floor((elapsedMs - 3000) / 1000);
        earnedPoints = Math.max(1, 10 - extraSeconds);
      }
      setScore((prev) => prev + earnedPoints);
      setLastEarned(`+${earnedPoints}`);
    } else {
      setLastEarned("0"); // Wrong answer
    }

    // 3. Auto-Advance after 2.5 seconds
    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNext();
    }, 2500);
  };

  const handleNext = () => {
    if (questionIndex + 1 < currentQuestions.length) {
      setQuestionIndex((prev) => prev + 1);
      setRevealed(false);
      setSelectedOption(null);
      setLastEarned(null);
    } else {
      setGameState("finished");
    }
  };

  const handleReturnToMenu = () => {
    setGameState("category_selection");
    setSelectedDomain(null);
  };

  /* =========================================================
     RENDER SCREENS
  ========================================================= */

  // SCREEN 1: CATEGORY SELECTION
  if (gameState === "category_selection") {
    return (
      <div style={{ position: "relative", width: "100%", maxWidth: 900, minHeight: 400, borderRadius: 24, background: C.bg, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", padding: "40px", fontFamily: "'Space Grotesk', sans-serif" }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 200, color: "rgba(0,32,80,0.05)", fontWeight: 900, lineHeight: 1, userSelect: "none" }}>?</div>
        
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-block", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", background: C.text, color: C.white, padding: "6px 12px", borderRadius: 8, marginBottom: 16 }}>ayiooo.test</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", color: C.text, margin: 0, fontWeight: 800 }}>Select a Domain</h2>
          <p style={{ color: C.text, opacity: 0.8, fontSize: 16, marginTop: 8, fontWeight: 600 }}>Answer in under 3 seconds for max points!</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, zIndex: 1, maxWidth: 800, margin: "0 auto", width: "100%" }}>
          {DOMAINS.map(domain => (
            <button
              key={domain}
              onClick={() => startRound(domain)}
              style={{
                background: C.white,
                border: "none",
                borderRadius: 16,
                padding: "20px",
                fontSize: 18,
                fontWeight: 700,
                color: C.text,
                cursor: "pointer",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.1s, box-shadow 0.1s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              onMouseDown={(e) => e.currentTarget.style.transform = "translateY(2px)"}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // SCREEN 2: LOADING
  if (gameState === "loading") {
    return (
      <div style={{ width: "100%", maxWidth: 900, minHeight: 400, borderRadius: 24, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.text, fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        Loading {selectedDomain} Questions...
      </div>
    );
  }

  // SCREEN 3: PLAYING
  if (gameState === "playing") {
    const activeQuestion = currentQuestions[questionIndex];

    return (
      <div style={{ position: "relative", width: "100%", maxWidth: 900, minHeight: 400, borderRadius: 24, background: C.bg, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", padding: "40px", fontFamily: "'Space Grotesk', sans-serif" }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 200, color: "rgba(0,32,80,0.05)", fontWeight: 900, lineHeight: 1, userSelect: "none" }}>?</div>
        
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
          
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, fontWeight: 700, color: C.text }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", background: C.text, color: C.white, padding: "6px 12px", borderRadius: 8 }}>
                ayiooo.test
              </div>
              <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", background: "rgba(0,32,80,0.1)", padding: "6px 12px", borderRadius: 8 }}>
                {activeQuestion.category}
              </div>
            </div>
            <div style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 12 }}>
              <span>Q{questionIndex + 1}/{QUESTIONS_PER_ROUND}</span>
              <span style={{ background: C.white, padding: "4px 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6 }}>
                Score: {score}
                {/* Floating points indicator when answered */}
                {lastEarned && (
                  <span style={{ color: lastEarned === "0" ? C.incorrect : C.correct, fontSize: 14, fontWeight: 900, position: "absolute", top: 30, right: 40, animation: "floatUp 1s forwards" }}>
                    {lastEarned}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Question Box */}
          <div style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: C.text, fontWeight: 800, lineHeight: 1.3, marginBottom: 40, textAlign: "center", maxWidth: 700, alignSelf: "center", minHeight: 80, display: "flex", alignItems: "center" }}>
            {activeQuestion.question}
          </div>

          {/* 2x2 Options Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, flex: 1, alignContent: "center" }}>
            {activeQuestion.options.map((opt, i) => {
              const isCorrect = opt === activeQuestion.correct;
              const isSelected = opt === selectedOption;
              
              let bgColor = C.white;
              let badgeBg = C.text;
              let textColor = C.text;
              let badgeText = C.white;

              if (revealed) {
                if (isCorrect) {
                  bgColor = C.correct; badgeBg = C.white; textColor = C.white; badgeText = C.correct;
                } else if (isSelected && !isCorrect) {
                  bgColor = C.incorrect; badgeBg = C.white; textColor = C.white; badgeText = C.incorrect;
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={revealed}
                  style={{
                    display: "flex", alignItems: "center", textAlign: "left", padding: "8px 16px 8px 8px", borderRadius: 16, border: "none",
                    background: bgColor, color: textColor, fontSize: 16, fontWeight: 700,
                    cursor: revealed ? "default" : "pointer", boxShadow: "0 8px 16px rgba(0,0,0,0.1)", transition: "all 0.2s ease", minHeight: 64,
                  }}
                  onMouseOver={(e) => { if (!revealed) e.currentTarget.style.transform = "translateY(-2px)" }}
                  onMouseOut={(e) => { if (!revealed) e.currentTarget.style.transform = "translateY(0)" }}
                  onMouseDown={(e) => { if (!revealed) e.currentTarget.style.transform = "translateY(2px)" }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: badgeBg, color: badgeText, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, marginRight: 16, flexShrink: 0 }}>
                    {labels[i]}
                  </div>
                  <span style={{ lineHeight: 1.3 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Auto Advance Indicator */}
          <div style={{ height: 24, marginTop: 24, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {revealed && (
              <div style={{ color: C.text, fontSize: 14, fontWeight: 700, opacity: 0.7, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Next question loading...
              </div>
            )}
          </div>
        </div>

        {/* Global style for the floating points animation */}
        <style>{`
          @keyframes floatUp {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-20px); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // SCREEN 4: FINISHED
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 900, minHeight: 400, borderRadius: 24, background: C.bg, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", padding: "40px", fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ position: "absolute", top: -20, right: -20, fontSize: 200, color: "rgba(0,32,80,0.05)", fontWeight: 900, lineHeight: 1, userSelect: "none" }}>?</div>
      
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <h2 style={{ fontSize: 48, color: C.text, margin: "0 0 16px 0", fontWeight: 800 }}>Round Complete!</h2>
        <div style={{ fontSize: 24, color: C.text, marginBottom: 32, fontWeight: 600 }}>
          You scored {score} / {QUESTIONS_PER_ROUND * 10} points
        </div>
        
        <div style={{ width: "100%", maxWidth: 400, background: "rgba(0,32,80,0.1)", height: 16, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ height: "100%", width: `${(score / (QUESTIONS_PER_ROUND * 10)) * 100}%`, background: C.text, transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
        </div>
        
        <button
          onClick={handleReturnToMenu}
          style={{ padding: "16px 32px", borderRadius: 999, background: C.text, color: C.white, border: "none", fontSize: 18, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 16px rgba(0,32,80,0.3)", transition: "transform 0.1s", marginTop: 24 }}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Select New Domain ↻
        </button>
      </div>
    </div>
  );
}