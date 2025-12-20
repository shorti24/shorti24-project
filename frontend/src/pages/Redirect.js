import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [clicked, setClicked] = useState(false);

  // =====================
  // FETCH ORIGINAL URL
  // =====================
  useEffect(() => {
    if (!code) return setError("Invalid link");

    const fetchUrl = async () => {
      const { data } = await supabase
        .from("short_urls")
        .select("original_url")
        .eq("short_code", code)
        .single();

      if (!data?.original_url) return setError("Link not found");

      let url = data.original_url.trim();
      if (!url.startsWith("http")) url = "https://" + url;

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
  // 1 TAB ADS + 1 TAB MAIN
  // =====================
  const handleGetLink = () => {
    if (!originalUrl || clicked) return;
    setClicked(true);

    // 🔥 ADS TAB
    window.open(
      "https://al5sm.com/tag.min.js?zone=10350229",
      "_blank"
    );

    // 🔥 MAIN LINK TAB
    window.open(originalUrl, "_blank");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
      }}
    >
      <h2>Preparing your link…</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {originalUrl && (
        <button
          onClick={handleGetLink}
          disabled={countdown > 0 || clicked}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background:
              countdown > 0 || clicked ? "#aaa" : "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor:
              countdown > 0 || clicked
                ? "not-allowed"
                : "pointer",
          }}
        >
          {countdown > 0 ? `Wait ${countdown}s` : "Get Link"}
        </button>
      )}
    </div>
  );
}
