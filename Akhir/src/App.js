import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import Page2D from './components/Page2D';
import Page3D from './components/Page3D';

export default function App() {
  // page: 'menu', '2d', '3d'
  const [page, setPage] = useState('menu');

  return (
    <>
      {page === 'menu' && <MainMenu onSelect={setPage} />}
      {page === '2d' && <Page2D onBack={() => setPage('menu')} />}
      {page === '3d' && <Page3D onBack={() => setPage('menu')} />}
    </>
  );
}
