import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------
   Shop — DummyJSON products (live). 
   Upgraded with a Category Selection screen before viewing products.
------------------------------------------------------------------- */

const CATEGORIES = [
  { slug: "smartphones", name: "Smartphones", icon: "📱" },
  { slug: "laptops", name: "Laptops", icon: "💻" },
  { slug: "fragrances", name: "Fragrances", icon: "🌸" },
  { slug: "skincare", name: "Skincare", icon: "✨" },
  { slug: "groceries", name: "Groceries", icon: "🛒" },
  { slug: "home-decoration", name: "Home Decor", icon: "🏠" },
];

export default function ProductsCard() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [state, setState] = useState({ status: "loading", data: null });
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (!selectedCategory) return;

    let cancelled = false;
    setState({ status: "loading", data: null });

    // Fetch products belonging to the selected category
    fetch(`https://dummyjson.com/products/category/${selectedCategory}?limit=8`)
      .then((r) => r.json())
      .then((raw) => {
        if (cancelled) return;
        setState({ status: "live", data: raw.products });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          status: "error",
          data: [
            { id: 1, title: "Sample Product 1", price: 99, rating: 4.5, images: ["", ""] },
            { id: 2, title: "Sample Product 2", price: 149, rating: 4.7, images: ["", ""] },
          ],
        });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  const S = {
    bg: "#0B0F19",
    card: "#131A2A",
    text: "#FFFFFF",
    muted: "#8B9BB4",
    accent: "#00E5FF", 
    rating: "#FFC107"
  };

  /* =========================================================
     SCREEN 1: CATEGORY SELECTION
  ========================================================= */
  if (!selectedCategory) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 1040,
          borderRadius: 24,
          background: S.bg,
          padding: "40px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.05)",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: S.accent, marginBottom: 8, fontWeight: 700 }}>
            Catalog Explorer
          </div>
          <h2 style={{ fontSize: 32, margin: 0, color: S.text, fontWeight: 800 }}>Select a Product Category</h2>
          <p style={{ color: S.muted, fontSize: 15, marginTop: 8 }}>Choose a domain to explore live items from DummyJSON</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              style={{
                background: S.card,
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: "24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = S.accent;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
              }}
            >
              <span style={{ fontSize: 32 }}>{cat.icon}</span>
              <div>
                <div style={{ color: S.text, fontSize: 16, fontWeight: 700 }}>{cat.name}</div>
                <div style={{ color: S.muted, fontSize: 12, marginTop: 2, textTransform: "uppercase" }}>Browse Live →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     SCREEN 2: PRODUCTS LIST FOR SELECTED CATEGORY
  ========================================================= */
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1040,
        borderRadius: 24,
        background: S.bg,
        padding: "40px",
        boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Store Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              background: "none", border: "none", color: S.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 4
            }}
          >
            ← Back to Categories
          </button>
          <h2 style={{ fontSize: 32, margin: 0, color: S.text, fontWeight: 800, textTransform: "capitalize" }}>
            {selectedCategory.replace("-", " ")} Collection
          </h2>
        </div>
        
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: S.muted, background: "rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: 999 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C853", boxShadow: "0 0 10px #00C853" }}></span>
          DummyJSON Live
        </div>
      </div>

      {state.status === "loading" ? (
        <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: S.muted }}>
          Loading products...
        </div>
      ) : (
        /* Product Grid - Fixed 4 columns */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {state.data.map((p) => {
            const priceInRupees = Math.round(p.price * 83).toLocaleString("en-IN");
            const isHovered = hoveredId === p.id;
            
            const primaryImage = p.images && p.images.length > 0 ? p.images[0] : p.thumbnail;
            const hoverImage = p.images && p.images.length > 1 ? p.images[1] : primaryImage;

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: S.card,
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Image Container with Crossfade Effect */}
                <div style={{
                  width: "100%",
                  height: 180,
                  background: "#FFFFFF", 
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <img 
                    src={primaryImage} 
                    alt={p.title} 
                    style={{ 
                      position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "16px",
                      opacity: isHovered ? 0 : 1, transition: "opacity 0.4s ease-in-out, transform 0.4s ease",
                      transform: isHovered ? "scale(1.1)" : "scale(1)"
                    }} 
                  />
                  <img 
                    src={hoverImage} 
                    alt={`${p.title} alternate angle`} 
                    style={{ 
                      position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "16px",
                      opacity: isHovered ? 1 : 0, transition: "opacity 0.4s ease-in-out, transform 0.4s ease",
                      transform: isHovered ? "scale(1.05)" : "scale(0.95)"
                    }} 
                  />
                </div>

                {/* Product Details - Name stacked on top, price below */}
                <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ 
                      margin: "0 0 8px 0", color: S.text, fontSize: 15, fontWeight: 600, lineHeight: 1.3,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                    }}>
                      {p.title}
                    </h3>
                    
                    <div style={{ color: S.accent, fontSize: 17, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                      ₹{priceInRupees}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: S.muted, fontWeight: 500 }}>
                    <span style={{ color: S.rating }}>★</span> {p.rating} 
                    <span style={{ opacity: 0.5 }}>•</span> {p.category || selectedCategory}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}