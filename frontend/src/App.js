import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShortUrls from "./pages/ShortUrls";
import Redirect from "./pages/Redirect";

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<ShortUrls />} />

        {/* 🔥 Short link route */}
        <Route path="/:code" element={<Redirect />} />
      </Routes>
    </Router>
  );
}

export default App;
