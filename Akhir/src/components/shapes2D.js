import React from 'react';

// Trapesium sama kaki (koordinat relatif)
export function Trapesium({ fill, stroke }) {
  return (
    <polygon
      points="20,5 80,5 70,50 30,50"
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
    />
  );
}

// Oktagon beraturan (64x64)
export function Oktagon({ fill, stroke }) {
  const r = 30;
  const center = 40;
  const points = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 + 22.5) * (Math.PI / 180);
    points.push(
      center + r * Math.cos(angle) + ',' + (center + r * Math.sin(angle))
    );
  }
  return (
    <polygon points={points.join(' ')} fill={fill} stroke={stroke} strokeWidth="2" />
  );
}

// Setengah hati, kira-kira
export function HalfHeart({ fill, stroke }) {
  return (
    <path
      d="M20,40
         C20,20 50,20 50,40
         C50,60 20,60 20,80
         L30,80
         C30,60 60,60 60,40
         C60,20 90,20 90,40
         L90,80
         L20,80 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
    />
  );
}
