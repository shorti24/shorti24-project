import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

  // =====================
  // FETCH ORIGINAL URL
  // =====================
  useEffect(() => {
    if (!code) {
      setError("No short code found");
      return;
    }

    const fetchUrl = async () => {
      const { data, error } = await supabase
        .from("short_urls")
        .select("original_url")
        .eq("short_code", code)
        .single();

      if (error || !data?.original_url) {
        setError("Link not found");
        return;
      }

      let url = data.original_url.trim();

      // 🔥 FIX: add https:// if missing
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      setOriginalUrl(url);
    };

    fetchUrl();
  }, [code]);

  // =====================
  // COUNTDOWN
  // =====================
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // =====================
  // HANDLE CLICK
  // =====================
  const handleGetLink = () => {
    if (!originalUrl) return;

    // Pop ad
    const popScript = document.createElement("script");
    popScript.src = "https://al5sm.com/tag.min.js";
    popScript.dataset.zone = "10350229";
    popScript.async = true;
    document.body.appendChild(popScript);

    // Redirect after ad
    setTimeout(() => {
      window.location.href = originalUrl;
    }, 2000);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Please wait...</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && !originalUrl && <p>Loading link...</p>}

      {originalUrl && (
        <>
          <p>Your link is ready</p>
          <button
            onClick={handleGetLink}
            disabled={countdown > 0}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: countdown > 0 ? "not-allowed" : "pointer",
              backgroundColor: countdown > 0 ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {countdown > 0 ? `Wait ${countdown}s` : "Get Link"}
          </button>
        </>
      )}
    </div>
  );
}
