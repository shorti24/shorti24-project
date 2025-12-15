import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./HomePage.css";

export default function ShortUrls() {
  const [urls, setUrls] = useState([{ longUrl: "", customCode: "", customMessage: "" }]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const BASE_URL = "https://shorti24.pages.dev/";

  const generateShortCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addMoreInput = () =>
    setUrls([...urls, { longUrl: "", customCode: "", customMessage: "" }]);

  const handleShorten = async () => {
    setLoading(true);
    const newLinks = [];

    for (let { longUrl, customCode, customMessage } of urls) {
      if (!longUrl) continue;
      const shortCode = customCode || generateShortCode();
      const shortUrl = `${BASE_URL}${shortCode}`;

      const { data, error } = await supabase
        .from("short_urls")
        .insert([
          {
            original_url: longUrl,
            short_code: shortCode,
            custom_message: customMessage, // নতুন ফিল্ড
            clicks: 0,
            earnings: 0,
            is_ads_enabled: true,
          },
        ])
        .select("*");

      if (!error && data) newLinks.push({ ...data[0], shortUrl });
    }

    setLinks([...newLinks, ...links]);
    setUrls([{ longUrl: "", customCode: "", customMessage: "" }]);
    setLoading(false);
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`homepage premium ${darkMode ? "dark" : ""}`}>
      <div className="dark-toggle">
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <header className="hero">
        <h1>Shorti24</h1>
        <p>Fast & Premium URL Shortener — Shorten, Track & Bulk Shorten</p>
        <div className="trust-badges">
          <span>Safe & Secure</span>
          <span>Unlimited Links</span>
          <span>High CPM Ads</span>
          <span>Free for Everyone</span>
        </div>
      </header>

      <div className="input-section">
        {urls.map((u, idx) => (
          <div key={idx} className="input-row">
            <input
              type="text"
              placeholder="Enter long URL"
              value={u.longUrl}
              onChange={(e) => handleInputChange(idx, "longUrl", e.target.value)}
            />
            <input
              type="text"
              placeholder="Custom code (optional)"
              value={u.customCode}
              onChange={(e) => handleInputChange(idx, "customCode", e.target.value)}
            />
            <input
              type="text"
              placeholder="Custom message (optional)"
              value={u.customMessage}
              onChange={(e) => handleInputChange(idx, "customMessage", e.target.value)}
            />
          </div>
        ))}
        <div className="input-buttons">
          <button onClick={addMoreInput}>+ Add More URLs</button>
          <button onClick={handleShorten}>
            {loading ? "Processing..." : "Generate Links"}
          </button>
        </div>
      </div>

      <section className="recent-links">
        {links.length === 0 && <div className="empty-state">No links yet</div>}
        {links.map((link) => (
          <div key={link.id} className="link-card">
            <div>
              <a
                href={`/redirect/${link.short_code}`}
                target="_blank"
                rel="noreferrer"
              >
                {link.shortUrl}
              </a>
              <p>Clicks: {link.clicks} | Earnings: ${link.earnings}</p>
              {link.custom_message && (
                <p style={{ color: "#facc15" }}>Message: {link.custom_message}</p>
              )}
            </div>
            <div className="card-buttons">
              <button onClick={() => handleCopy(link.shortUrl)}>Copy</button>
            </div>
          </div>
        ))}
      </section>

      <footer>
        &copy; {new Date().getFullYear()} Shorti24 — All rights reserved
      </footer>
    </div>
  );
}