import React, { useEffect, useState } from 'react';
import GlobalStyle from './globalStyles';
import WebFont from 'webfontloader';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages';

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Shippori Antique']
      }
    });
  }, []);

  const [click] = useState(false);

  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home click={click} />} />
      </Routes>
    </Router>
  );
}

export default App;

