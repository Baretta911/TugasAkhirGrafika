import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import Limas from './Limas';
import Ovoid from './Ovoid';
import Koin from './Koin';

export default function Canvas3D({ objects }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0x404040));

    // Render each object with its transformations
    objects.forEach(({ type, position, rotation, scale, color, wireframeColor, id }) => {
      let mesh;
      if (type === 'limas') mesh = Limas({ color, wireframeColor });
      else if (type === 'ovoid') mesh = Ovoid({ color, wireframeColor });
      else if (type === 'koin') mesh = Koin({ color, wireframeColor });

      if (mesh) {
        mesh.position.set(...position);
        mesh.rotation.set(...rotation);
        mesh.scale.set(scale, scale, scale);
        mesh.name = `obj-${id}`;
        scene.add(mesh);
      }
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [objects]);

  return <div ref={mountRef} style={{ width: '100%', height: '600px', border: '1px solid black' }} />;
}
