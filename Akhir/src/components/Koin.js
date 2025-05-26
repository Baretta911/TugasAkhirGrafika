import * as THREE from "three";

export default function Koin(color = "#FFD700") {
  // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
  const geometry = new THREE.CylinderGeometry(1, 1, 0.3, 32);
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.8,
    roughness: 0.2,
  });
  const mesh = new THREE.Mesh(geometry, material);

  // Putar koin supaya posisi default menghadap kamera
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}
