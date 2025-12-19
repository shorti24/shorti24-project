import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5); // countdown before button is enabled

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

      setOriginalUrl(data.original_url);
    };

    fetchUrl();
  }, [code]);

  // =====================
  // ADS SCRIPT (optional banner)
  // =====================
  useEffect(() => {
    const bannerScript = document.createElement("script");
    bannerScript.src = "https://quge5.com/88/tag.min.js"; // example banner ad
    bannerScript.async = true;
    bannerScript.setAttribute("data-zone", "194391");
    bannerScript.setAttribute("data-cfasync", "false");
    document.body.appendChild(bannerScript);

    return () => {
      document.body.removeChild(bannerScript);
    };
  }, []);

  // =====================
  // COUNTDOWN BEFORE GET LINK BUTTON
  // =====================
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // =====================
  // HANDLE GET LINK CLICK
  // =====================
  const handleGetLink = () => {
    if (!originalUrl) return;

    // Open pop ad in one tab
    window.open("https://al5sm.com/adlink", "_blank"); // replace with your pop ad URL

    // Open original URL in another tab
    window.open(originalUrl, "_blank");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Please wait...</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && !originalUrl && <p>Loading link...</p>}

      {originalUrl && (
        <>
          <p>Click the button below to access your link:</p>
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
              marginTop: "10px",
            }}
          >
            {countdown > 0 ? `Wait ${countdown}s` : "Get Link"}
          </button>
        </>
      )}

      <div id="banner-ads" style={{ marginTop: "20px" }}></div>
      <div id="social-ads" style={{ marginTop: "20px" }}></div>
    </div>
  );
}
