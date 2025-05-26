import React, { useState } from "react";
import Page2D from "./Page2D";
import Page3D from "./Page3D";

const bgGradient = "linear-gradient(135deg, #232526 0%, #414345 100%)";
const glassStyle = {
  background: "rgba(40, 44, 52, 0.85)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.18)",
  padding: "40px 30px",
  display: "inline-block",
  minWidth: 320,
};

const buttonStyle = {
  margin: "20px 10px",
  padding: "18px 40px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#fff",
  background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(0,114,255,0.2)",
  cursor: "pointer",
  letterSpacing: "2px",
  transition: "transform 0.15s, box-shadow 0.15s, background 0.3s",
};
const buttonHover = {
  background: "linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)",
  transform: "scale(1.07)",
  boxShadow: "0 6px 24px rgba(0,114,255,0.35)",
};

export default function MainMenu() {
  const [page, setPage] = useState(null);
  const [hoverBtn, setHoverBtn] = useState("");

  if (!page)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: bgGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={glassStyle}>
          <h1
            style={{
              color: "#fff",
              fontSize: "2.6rem",
              letterSpacing: "3px",
              marginBottom: 40,
              textShadow: "0 2px 16px #0072ff55",
              fontWeight: 700,
              fontFamily: "Segoe UI, Arial, sans-serif",
            }}
          >
            Grafika Komputer
          </h1>
          <div>
            <button
              style={{
                ...buttonStyle,
                ...(hoverBtn === "2d" ? buttonHover : {}),
              }}
              onMouseEnter={() => setHoverBtn("2d")}
              onMouseLeave={() => setHoverBtn("")}
              onClick={() => setPage("2d")}
            >
              Menu 2D
            </button>
            <button
              style={{
                ...buttonStyle,
                ...(hoverBtn === "3d" ? buttonHover : {}),
              }}
              onMouseEnter={() => setHoverBtn("3d")}
              onMouseLeave={() => setHoverBtn("")}
              onClick={() => setPage("3d")}
            >
              Menu 3D
            </button>
          </div>
          <div
            style={{
              marginTop: 32,
              color: "#aaa",
              fontSize: 15,
              letterSpacing: 1,
            }}
          >
            <span style={{ opacity: 0.7 }}>
              <span style={{ color: "#00c6ff" }}>by</span>{" "}
              <b>Kelompok Grafkom</b>
            </span>
          </div>
        </div>
      </div>
    );

  if (page === "2d") return <Page2D onBack={() => setPage(null)} />;
  if (page === "3d") return <Page3D onBack={() => setPage(null)} />;

  return null;
}
