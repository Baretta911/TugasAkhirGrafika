import * as THREE from "three";

export default function Limas(color = "#00ff00") {
  // Limas segi empat (cone dengan 4 sisi)
  const geometry = new THREE.ConeGeometry(1, 2, 4);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
