import React from "react";

export default function SetengahHati({ fill, stroke }) {
  return (
    <path
      d="M 0 0 
         A 25 25 0 0 1 25 -25 
         A 25 25 0 0 1 50 0
         L 25 50
         Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="3"
      transform="translate(-25,0)"
    />
  );
}
