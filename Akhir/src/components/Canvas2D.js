import React from 'react';
import { Trapesium, Oktagon, HalfHeart } from './shapes2D';

export default function Canvas2D({ objects }) {
  return (
    <svg
      width="600"
      height="400"
      style={{ border: '1px solid black', backgroundColor: '#f0f0f0' }}
    >
      {objects.map(({ id, type, position, rotation, scale, fillColor, strokeColor }) => {
        const transform = `
          translate(${position[0]},${position[1]}) 
          rotate(${rotation}) 
          scale(${scale})
        `;
        let shape = null;
        if (type === 'trapesium')
          shape = <Trapesium fill={fillColor} stroke={strokeColor} />;
        else if (type === 'oktagon')
          shape = <Oktagon fill={fillColor} stroke={strokeColor} />;
        else if (type === 'halfheart')
          shape = <HalfHeart fill={fillColor} stroke={strokeColor} />;

        return (
          <g key={id} transform={transform}>
            {shape}
          </g>
        );
      })}
    </svg>
  );
}
