import React, { useEffect, useState } from 'react';
import './App.css';
import WebFont from 'webfontloader';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages';
import { SideNavbar } from './components'

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Shippori Antique']
      }
    });
  }, []);

  const [click, setClick] = useState(false);

  return (
    <Router>
      <SideNavbar click={click} setClick={setClick} />
      <Routes>
        <Route path="/" element={<Home click={click} />} />
      </Routes>
    </Router>
  );
}

export default App;

