// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShortUrls from "./pages/ShortUrls";
import RedirectPage from "./pages/Redirect";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShortUrls />} />
        <Route path="/:code" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
