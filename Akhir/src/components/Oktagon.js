import React from "react";

export default function Oktagon({ fill, stroke }) {
  // Polygon oktagon dengan radius ~50
  const points = [
    [30, 0],
    [60, 30],
    [60, 60],
    [30, 90],
    [-30, 90],
    [-60, 60],
    [-60, 30],
    [-30, 0],
  ]
    .map((p) => p.join(","))
    .join(" ");

  return (
    <polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth="3"
    />
  );
}
