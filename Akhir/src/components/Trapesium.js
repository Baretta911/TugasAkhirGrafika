import React from "react";

export default function Trapesium({ fill, stroke }) {
  return (
    <polygon
      points=" -50,50 50,50 35,-50 -35,-50"
      fill={fill}
      stroke={stroke}
      strokeWidth="3"
    />
  );
}
