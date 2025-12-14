import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./HomePage.css";

export default function HomePage() {
  const [urls, setUrls] = useState([{ longUrl: "", customCode: "" }]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://shorti24.pages.dev/";

  const generateShortCode = (length = 6) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

  const addMoreInput = () => setUrls([...urls, { longUrl: "", customCode: "" }]);

  const handleShorten = async () => {
    setLoading(true);
    const newLinks = [];

    for (let { longUrl, customCode } of urls) {
      if (!longUrl) continue;
      const shortCode = customCode || generateShortCode();
      const shortUrl = `${BASE_URL}${shortCode}`;

      const { data, error } = await supabase
        .from("short_urls")
        .insert([
          {
            original_url: longUrl,
            short_code: shortCode,
            clicks: 0,
            earnings: 0,
            is_ads_enabled: true,
          },
        ])
        .select("*");

      if (!error) newLinks.push({ ...data[0], shortUrl });
    }

    setLinks([...newLinks, ...links]);
    setUrls([{ longUrl: "", customCode: "" }]);
    setLoading(false);
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  };

  return (
    <div className="homepage premium">
      <header className="hero">
        <h1>Shorti24</h1>
        <p>Fast & Premium URL Shortener — Shorten, Track & Bulk Shorten</p>
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
          </div>
        ))}
        <div className="input-buttons">
          <button onClick={addMoreInput}>+ Add More URLs</button>
          <button onClick={handleShorten}>{loading ? "Processing..." : "Generate Links"}</button>
        </div>
      </div>

      <section className="recent-links">
        {links.map((link) => (
          <div key={link.id} className="link-card">
            <div>
              <a href={`/redirect/${link.short_code}`} target="_blank" rel="noreferrer">
                {link.shortUrl}
              </a>
              <p>Clicks: {link.clicks} | Earnings: ${link.earnings}</p>
            </div>
            <button onClick={() => handleCopy(link.shortUrl)}>Copy</button>
          </div>
        ))}
      </section>

      <footer>
        &copy; {new Date().getFullYear()} Shorti24 — All rights reserved
      </footer>
    </div>
  );
}
