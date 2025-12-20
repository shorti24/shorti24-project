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
      setError("Invalid link");
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
      if (!url.startsWith("http")) {
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
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // =====================
  // POP-UNDER + REDIRECT
  // =====================
  const handleGetLink = () => {
    if (!originalUrl) return;

    try {
      // 🔥 POP-UNDER ADS (anti adblock friendly)
      const adWin = window.open(
        "https://al5sm.com/tag.min.js?zone=10350229",
        "_blank"
      );

      // If blocked, inject script fallback
      if (!adWin) {
        const s = document.createElement("script");
        s.src = "https://al5sm.com/tag.min.js";
        s.async = true;
        s.dataset.zone = "10350229";
        document.body.appendChild(s);
      }
    } catch (e) {
      console.log("Ad blocked");
    }

    // 🔥 MAIN LINK AFTER ADS
    setTimeout(() => {
      window.location.href = originalUrl;
    }, 1800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "Arial",
      }}
    >
      <h2>Preparing your link...</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && !originalUrl && <p>Loading...</p>}

      {originalUrl && (
        <>
          <p>Please wait a moment</p>
          <button
            onClick={handleGetLink}
            disabled={countdown > 0}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: countdown > 0 ? "#aaa" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: countdown > 0 ? "not-allowed" : "pointer",
            }}
          >
            {countdown > 0 ? `Wait ${countdown}s` : "Get Link"}
          </button>
        </>
      )}
    </div>
  );
}
