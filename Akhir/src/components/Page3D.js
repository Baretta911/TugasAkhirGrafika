import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Limas from "./Limas";
import Ovoid from "./Ovoid";
import Koin from "./Koin";
import "../style/page3d.css";

const objek3DList = [
  { name: "Limas", component: Limas },
  { name: "Ovoid", component: Ovoid },
  { name: "Koin", component: Koin },
];

export default function Page3D({ onBack }) {
  const mountRef = useRef(null);

  // State array objek 3D
  const [objects, setObjects] = useState([
    {
      id: Date.now(),
      typeIndex: 0,
      scale: 1.5, // default skala lebih besar supaya jelas
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 },
      color: "#00ff00",
    },
  ]);

  const [selectedObjId, setSelectedObjId] = useState(objects[0].id);

  // Refs scene, camera, renderer, meshes map
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshMapRef = useRef(new Map());

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(2, 2, 7); // Geser kamera lebih jauh & agak ke atas
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x202020); // Background gelap supaya objek kontras
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting: directional + ambient supaya objek terang dan jelas
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const animate = () => {
      requestAnimationFrame(animate);

      objects.forEach((obj) => {
        const mesh = meshMapRef.current.get(obj.id);
        if (!mesh) return;

        mesh.scale.set(obj.scale, obj.scale, obj.scale);
        mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
        mesh.material.color.set(obj.color);

        if (obj.typeIndex === 0) {
          mesh.rotation.y += 0.01;
        } else if (obj.typeIndex === 1) {
          mesh.rotation.x += 0.01;
          mesh.rotation.y += 0.01;
        } else if (obj.typeIndex === 2) {
          mesh.position.y += 0.5 * Math.sin(Date.now() * 0.005);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
      meshMapRef.current.clear();
    };
  }, [objects]);

  // Sinkronisasi mesh saat objects berubah
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const currentIds = new Set(objects.map((o) => o.id));

    // Hapus mesh yang sudah tidak ada
    meshMapRef.current.forEach((mesh, id) => {
      if (!currentIds.has(id)) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        meshMapRef.current.delete(id);
      }
    });

    // Tambah mesh baru sesuai objek
    objects.forEach((obj) => {
      if (!meshMapRef.current.has(obj.id)) {
        const MeshComp = objek3DList[obj.typeIndex].component;
        const mesh = MeshComp(obj.color);
        meshMapRef.current.set(obj.id, mesh);
        scene.add(mesh);
      }
    });
  }, [objects]);

  const selectedObj = objects.find((o) => o.id === selectedObjId);

  function updateSelectedObj(newProps) {
    setObjects((objs) =>
      objs.map((o) => (o.id === selectedObjId ? { ...o, ...newProps } : o))
    );
  }

  function duplicateSelectedObj() {
    if (!selectedObj) return;
    const newObj = {
      ...selectedObj,
      id: Date.now(),
      position: { ...selectedObj.position, x: selectedObj.position.x + 1 },
    };
    setObjects((objs) => [...objs, newObj]);
    setSelectedObjId(newObj.id);
  }

  function removeSelectedObj() {
    if (!selectedObj) return;
    if (objects.length <= 1) {
      alert("Minimal harus ada 1 objek.");
      return;
    }
    setObjects((objs) => objs.filter((o) => o.id !== selectedObjId));
    setSelectedObjId(objects[0].id);
  }

  function changeSelectedObjType(typeIndex) {
    updateSelectedObj({ typeIndex });
  }

  // --- Keyboard controls ---
  useEffect(() => {
    function handleKeyDown(e) {
      if (!selectedObj) return;
      if (e.target.tagName === "INPUT") return;
      switch (e.key) {
        case "ArrowUp":
          updateSelectedObj({
            position: {
              ...selectedObj.position,
              y: selectedObj.position.y + 0.2,
            },
          });
          break;
        case "ArrowDown":
          updateSelectedObj({
            position: {
              ...selectedObj.position,
              y: selectedObj.position.y - 0.2,
            },
          });
          break;
        case "ArrowLeft":
          updateSelectedObj({
            position: {
              ...selectedObj.position,
              x: selectedObj.position.x - 0.2,
            },
          });
          break;
        case "ArrowRight":
          updateSelectedObj({
            position: {
              ...selectedObj.position,
              x: selectedObj.position.x + 0.2,
            },
          });
          break;
        case "+":
        case "=":
          updateSelectedObj({ scale: Math.min(selectedObj.scale + 0.1, 3) });
          break;
        case "-":
        case "_":
          updateSelectedObj({ scale: Math.max(selectedObj.scale - 0.1, 0.1) });
          break;
        case "[":
          updateSelectedObj({
            rotation: {
              ...selectedObj.rotation,
              y: selectedObj.rotation.y - 0.1,
            },
          });
          break;
        case "]":
          updateSelectedObj({
            rotation: {
              ...selectedObj.rotation,
              y: selectedObj.rotation.y + 0.1,
            },
          });
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedObj]);

  // --- Mouse controls (drag & scroll) ---
  const [dragging, setDragging] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  function handleMouseDown(e) {
    if (!selectedObj) return;
    if (e.button === 0) {
      setDragging(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else if (e.button === 2) {
      setRotating(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  }
  function handleMouseMove(e) {
    if (!selectedObj) return;
    if (dragging) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      updateSelectedObj({
        position: {
          ...selectedObj.position,
          x: selectedObj.position.x + dx * 0.01,
          y: selectedObj.position.y - dy * 0.01,
        },
      });
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else if (rotating) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      updateSelectedObj({
        rotation: {
          ...selectedObj.rotation,
          y: selectedObj.rotation.y + dx * 0.01,
          x: selectedObj.rotation.x + dy * 0.01,
        },
      });
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  }
  function handleMouseUp() {
    setDragging(false);
    setRotating(false);
  }
  function handleWheel(e) {
    if (!selectedObj) return;
    e.preventDefault();
    if (e.deltaY < 0)
      updateSelectedObj({ scale: Math.min(selectedObj.scale + 0.1, 3) });
    else updateSelectedObj({ scale: Math.max(selectedObj.scale - 0.1, 0.1) });
  }
  function handleContextMenu(e) {
    e.preventDefault();
  }

  return (
    <div className="page3d-root">
      <div
        ref={mountRef}
        className="page3d-canvas-wrap"
        tabIndex={0}
        style={{
          cursor: dragging ? "move" : rotating ? "crosshair" : "pointer",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
      ></div>

      <div className="page3d-glass">
        <button
          onClick={onBack}
          className="page3d-btn"
          style={{ marginBottom: 20 }}
        >
          Kembali ke Menu Utama
        </button>

        <h3>Objek 3D (Pilih yang aktif)</h3>
        {objects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => setSelectedObjId(obj.id)}
            className={`page3d-btn${obj.id === selectedObjId ? " active" : ""}`}
            style={{ width: "100%", textAlign: "left" }}
          >
            {objek3DList[obj.typeIndex].name} - ID {obj.id}
          </button>
        ))}

        <h3>Ubah Jenis Objek</h3>
        {objek3DList.map((obj, i) => (
          <button
            key={obj.name}
            onClick={() => changeSelectedObjType(i)}
            className={`page3d-btn${
              i === selectedObj?.typeIndex ? " active" : ""
            }`}
          >
            {obj.name}
          </button>
        ))}

        {selectedObj && (
          <>
            <h3>Transformasi</h3>
            <label>
              Skala: {selectedObj.scale.toFixed(2)}
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.01"
                value={selectedObj.scale}
                onChange={(e) =>
                  updateSelectedObj({ scale: parseFloat(e.target.value) })
                }
                style={{ width: "100%", accentColor: "#00c6ff" }}
              />
            </label>

            <h4>Rotasi (radian)</h4>
            <label>
              X:
              <input
                type="number"
                value={selectedObj.rotation.x}
                step="0.01"
                onChange={(e) =>
                  updateSelectedObj({
                    rotation: {
                      ...selectedObj.rotation,
                      x: parseFloat(e.target.value),
                    },
                  })
                }
                className="page3d-input"
              />
            </label>
            <br />
            <label>
              Y:
              <input
                type="number"
                value={selectedObj.rotation.y}
                step="0.01"
                onChange={(e) =>
                  updateSelectedObj({
                    rotation: {
                      ...selectedObj.rotation,
                      y: parseFloat(e.target.value),
                    },
                  })
                }
                className="page3d-input"
              />
            </label>
            <br />
            <label>
              Z:
              <input
                type="number"
                value={selectedObj.rotation.z}
                step="0.01"
                onChange={(e) =>
                  updateSelectedObj({
                    rotation: {
                      ...selectedObj.rotation,
                      z: parseFloat(e.target.value),
                    },
                  })
                }
                className="page3d-input"
              />
            </label>

            <h4>Translasi (posisi)</h4>
            <label>
              X:
              <input
                type="number"
                value={selectedObj.position.x}
                step="0.1"
                onChange={(e) =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      x: parseFloat(e.target.value),
                    },
                  })
                }
                className="page3d-input"
              />
            </label>
            <br />
            <label>
              Y:
              <input
                type="number"
                value={selectedObj.position.y}
                step="0.1"
                onChange={(e) =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      y: parseFloat(e.target.value),
                    },
                  })
                }
                className="page3d-input"
              />
            </label>
            <br />
            <label>
              Z:
              <input
                type="number"
                value={selectedObj.position.z}
                step="0.1"
                onChange={(e) =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      z: parseFloat(e.target.value),
                    },
                  })
                }
                className="page3d-input"
              />
            </label>

            <h3>Warna</h3>
            <input
              type="color"
              value={selectedObj.color}
              onChange={(e) => updateSelectedObj({ color: e.target.value })}
              style={{ marginLeft: 8, verticalAlign: "middle" }}
            />

            <div style={{ marginTop: 20 }}>
              <button
                onClick={duplicateSelectedObj}
                className="page3d-btn"
                style={{ marginRight: 10 }}
              >
                Duplicate
              </button>
              <button onClick={removeSelectedObj} className="page3d-btn">
                Remove
              </button>
            </div>

            <h3>Transformasi (Button)</h3>
            <div>
              <button
                onClick={() =>
                  updateSelectedObj({
                    scale: Math.max(selectedObj.scale - 0.1, 0.1),
                  })
                }
                className="page3d-btn"
              >
                - Skala
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    scale: Math.min(selectedObj.scale + 0.1, 3),
                  })
                }
                className="page3d-btn"
              >
                + Skala
              </button>
            </div>
            <div>
              <button
                onClick={() =>
                  updateSelectedObj({
                    rotation: {
                      ...selectedObj.rotation,
                      y: selectedObj.rotation.y - 0.1,
                    },
                  })
                }
                className="page3d-btn"
              >
                - Rotasi Y
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    rotation: {
                      ...selectedObj.rotation,
                      y: selectedObj.rotation.y + 0.1,
                    },
                  })
                }
                className="page3d-btn"
              >
                + Rotasi Y
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    rotation: {
                      ...selectedObj.rotation,
                      x: selectedObj.rotation.x - 0.1,
                    },
                  })
                }
                className="page3d-btn"
              >
                - Rotasi X
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    rotation: {
                      ...selectedObj.rotation,
                      x: selectedObj.rotation.x + 0.1,
                    },
                  })
                }
                className="page3d-btn"
              >
                + Rotasi X
              </button>
            </div>
            <div>
              <button
                onClick={() =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      y: selectedObj.position.y + 0.2,
                    },
                  })
                }
                className="page3d-btn"
              >
                ↑
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      y: selectedObj.position.y - 0.2,
                    },
                  })
                }
                className="page3d-btn"
              >
                ↓
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      x: selectedObj.position.x - 0.2,
                    },
                  })
                }
                className="page3d-btn"
              >
                ←
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      x: selectedObj.position.x + 0.2,
                    },
                  })
                }
                className="page3d-btn"
              >
                →
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      z: selectedObj.position.z + 0.2,
                    },
                  })
                }
                className="page3d-btn"
              >
                Z+
              </button>
              <button
                onClick={() =>
                  updateSelectedObj({
                    position: {
                      ...selectedObj.position,
                      z: selectedObj.position.z - 0.2,
                    },
                  })
                }
                className="page3d-btn"
              >
                Z-
              </button>
            </div>
            <small>
              <ul className="page3d-small-list">
                <li>
                  Keyboard: panah = translasi X/Y, + / - = skala, [ / ] = rotasi
                  Y
                </li>
                <li>
                  Mouse: drag = translasi, scroll = skala, klik kanan drag =
                  rotasi
                </li>
              </ul>
            </small>
          </>
        )}
      </div>
    </div>
  );
}
