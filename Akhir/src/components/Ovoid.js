import * as THREE from "three";

export default function Ovoid(color = "#ff0000") {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const position = geometry.attributes.position;

  function smoothstep(edge0, edge1, x) {
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
    return t * t * (3 - 2 * t);
  }

  for (let i = 0; i < position.count; i++) {
    let x = position.getX(i);
    let y = position.getY(i);
    let z = position.getZ(i);

    if (y >= 0) {
      // Bagian atas: horizontal makin kecil, vertikal dipadatkan
      const t = smoothstep(0, 1, y);
      const scaleXZ = 1 - 0.8 * t;  // dari 1 ke 0.2 (lebih ramping)
      const scaleY = 1 - 0.25 * t;  // dari 1 ke 0.75 (masih agak dipadatkan)
      x *= scaleXZ;
      z *= scaleXZ;
      y *= scaleY;
    } else {
      // Bagian bawah: melebar dan memanjang lebih jelas
      const t = smoothstep(-1, 0, y);
      const scaleXZ = 1 + 0.6 * (1 - t);  // dari 1.6 ke 1 (lebih melebar)
      const scaleY = 1 + 0.3 * (1 - t);   // dari 1.3 ke 1 (lebih memanjang)
      x *= scaleXZ;
      z *= scaleXZ;
      y *= scaleY;
    }

    position.setXYZ(i, x, y, z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({ color, metalness: 0.2, roughness: 0.7 });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
