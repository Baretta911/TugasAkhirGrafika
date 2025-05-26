import React, { useState, useEffect, useRef } from "react";
import Trapesium from "./Trapesium";
import Oktagon from "./Oktagon";
import SetengahHati from "./SetengahHati";
import "../style/page2d.css";

const objek2DList = [
  { name: "Trapesium", component: Trapesium },
  { name: "Oktagon", component: Oktagon },
  { name: "Setengah Hati", component: SetengahHati },
];

export default function Page2D({ onBack }) {
  const [selectedObjIndex, setSelectedObjIndex] = useState(0);

  // state untuk transformasi dan warna
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0); // derajat
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [fillColor, setFillColor] = useState("#ff0000");
  const [borderColor, setBorderColor] = useState("#000000");

  // untuk duplikat (array objek)
  const [duplicates, setDuplicates] = useState([]);
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [rotating, setRotating] = useState(false);

  const SelectedComponent = objek2DList[selectedObjIndex].component;

  function duplicateObj() {
    setDuplicates([
      ...duplicates,
      {
        id: Date.now(),
        scale,
        rotation,
        translate: { ...translate },
        fillColor,
        borderColor,
      },
    ]);
  }

  function removeLastDuplicate() {
    setDuplicates((d) => d.slice(0, d.length - 1));
  }

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === "INPUT") return; // ignore input focus
      switch (e.key) {
        case "ArrowUp":
          setTranslate((t) => ({ ...t, y: t.y - 10 }));
          break;
        case "ArrowDown":
          setTranslate((t) => ({ ...t, y: t.y + 10 }));
          break;
        case "ArrowLeft":
          setTranslate((t) => ({ ...t, x: t.x - 10 }));
          break;
        case "ArrowRight":
          setTranslate((t) => ({ ...t, x: t.x + 10 }));
          break;
        case "+":
        case "=":
          setScale((s) => Math.min(s + 0.1, 3));
          break;
        case "-":
        case "_":
          setScale((s) => Math.max(s - 0.1, 0.1));
          break;
        case "[":
          setRotation((r) => (r - 5 + 360) % 360);
          break;
        case "]":
          setRotation((r) => (r + 5) % 360);
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mouse controls
  function handleMouseDown(e) {
    if (e.button === 0) {
      // left click: drag
      setDragging(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else if (e.button === 2) {
      // right click: rotate
      setRotating(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  }
  function handleMouseMove(e) {
    if (dragging) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else if (rotating) {
      const dx = e.clientX - lastMouse.x;
      setRotation((r) => (r + dx) % 360);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  }
  function handleMouseUp() {
    setDragging(false);
    setRotating(false);
  }
  function handleWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) setScale((s) => Math.min(s + 0.1, 3));
    else setScale((s) => Math.max(s - 0.1, 0.1));
  }

  // Prevent context menu on right click
  function handleContextMenu(e) {
    e.preventDefault();
  }

  return (
    <div className="page2d-root">
      <div className="page2d-canvas-wrap">
        <svg
          ref={svgRef}
          width={500}
          height={500}
          className="page2d-svg"
          style={{
            cursor: dragging ? "move" : rotating ? "crosshair" : "pointer",
          }}
          tabIndex={0}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={handleContextMenu}
        >
          {/* Render selected object */}
          <g
            transform={`translate(${translate.x + 250},${
              translate.y + 250
            }) rotate(${rotation}) scale(${scale})`}
          >
            <SelectedComponent fill={fillColor} stroke={borderColor} />
          </g>

          {/* Render duplicates */}
          {duplicates.map((dup) => (
            <g
              key={dup.id}
              transform={`translate(${dup.translate.x + 250},${
                dup.translate.y + 250
              }) rotate(${dup.rotation}) scale(${dup.scale})`}
            >
              <SelectedComponent
                fill={dup.fillColor}
                stroke={dup.borderColor}
              />
            </g>
          ))}
        </svg>
        <span className="page2d-tip">
          Drag = translasi, Scroll = skala, Klik kanan drag = rotasi
        </span>
      </div>

      <div className="page2d-glass">
        <button
          onClick={onBack}
          className="page2d-btn"
          style={{
            background: "linear-gradient(90deg, #232526 0%, #0072ff 100%)",
            marginBottom: 18,
          }}
        >
          Kembali ke Menu Utama
        </button>

        <h2
          style={{
            color: "#00c6ff",
            marginBottom: 10,
            marginTop: 0,
            letterSpacing: 2,
          }}
        >
          Kontrol 2D
        </h2>

        <div className="page2d-list">
          <span className="page2d-label">Pilih Objek 2D</span>
          {objek2DList.map((obj, i) => (
            <button
              key={obj.name}
              onClick={() => setSelectedObjIndex(i)}
              className={`page2d-btn${i === selectedObjIndex ? " active" : ""}`}
            >
              {obj.name}
            </button>
          ))}
        </div>

        <span className="page2d-label">Transformasi</span>
        <label style={{ color: "#fff" }}>
          Skala: {scale.toFixed(2)}
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "#00c6ff" }}
          />
        </label>
        <label style={{ color: "#fff" }}>
          Rotasi (°): {rotation}
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#00c6ff" }}
          />
        </label>
        <label style={{ color: "#fff" }}>
          Translasi X:
          <input
            type="number"
            value={translate.x}
            onChange={(e) =>
              setTranslate({
                ...translate,
                x: parseInt(e.target.value) || 0,
              })
            }
            className="page2d-input"
          />
        </label>
        <label style={{ color: "#fff" }}>
          Translasi Y:
          <input
            type="number"
            value={translate.y}
            onChange={(e) =>
              setTranslate({
                ...translate,
                y: parseInt(e.target.value) || 0,
              })
            }
            className="page2d-input"
          />
        </label>

        <span className="page2d-label">Warna</span>
        <label style={{ color: "#fff" }}>
          Isi:
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            style={{ marginLeft: 8, verticalAlign: "middle" }}
          />
        </label>
        <label style={{ color: "#fff" }}>
          Border:
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            style={{ marginLeft: 8, verticalAlign: "middle" }}
          />
        </label>

        <span className="page2d-label">Aksi</span>
        <button
          onClick={duplicateObj}
          className="page2d-btn"
          style={{ marginRight: 10 }}
        >
          Duplicate
        </button>
        <button onClick={removeLastDuplicate} className="page2d-btn">
          Remove Last Duplicate
        </button>

        <span className="page2d-label">Transformasi (Button)</span>
        <div>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.1, 0.1))}
            className="page2d-btn"
          >
            - Skala
          </button>
          <button
            onClick={() => setScale((s) => Math.min(s + 0.1, 3))}
            className="page2d-btn"
          >
            + Skala
          </button>
        </div>
        <div>
          <button
            onClick={() => setRotation((r) => (r - 5 + 360) % 360)}
            className="page2d-btn"
          >
            - Rotasi
          </button>
          <button
            onClick={() => setRotation((r) => (r + 5) % 360)}
            className="page2d-btn"
          >
            + Rotasi
          </button>
        </div>
        <div>
          <button
            onClick={() => setTranslate((t) => ({ ...t, y: t.y - 10 }))}
            className="page2d-btn"
          >
            ↑
          </button>
          <button
            onClick={() => setTranslate((t) => ({ ...t, y: t.y + 10 }))}
            className="page2d-btn"
          >
            ↓
          </button>
          <button
            onClick={() => setTranslate((t) => ({ ...t, x: t.x - 10 }))}
            className="page2d-btn"
          >
            ←
          </button>
          <button
            onClick={() => setTranslate((t) => ({ ...t, x: t.x + 10 }))}
            className="page2d-btn"
          >
            →
          </button>
        </div>
        <small>
          <ul className="page2d-small-list">
            <li>Keyboard: panah = translasi, + / - = skala, [ / ] = rotasi</li>
            <li>
              Mouse: drag = translasi, scroll = skala, klik kanan drag = rotasi
            </li>
          </ul>
        </small>
      </div>
    </div>
  );
}
