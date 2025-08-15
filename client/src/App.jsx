import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />          {/* Home page */}
        <Route path="/about" element={<Home />} />    {/* About page */}
        <Route path="/dashboard" element={<Home />} /> {/* Dashboard */}
        <Route path="*" element={<NotFound />} />     {/* 404 Page */}
      </Routes>
    </Router>
  );
}

export default App;
