import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5); // 5s countdown for user-friendly display

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
  // ADS SCRIPTS
  // =====================
  useEffect(() => {
    // Pop ad script (user-friendly)
    const popScript = document.createElement("script");
    popScript.src = "https://al5sm.com/tag.min.js";
    popScript.async = true;
    popScript.dataset.zone = "10350229";
    document.body.appendChild(popScript);

    // Optional: banner/other ads
    const bannerScript = document.createElement("script");
    bannerScript.src = "https://quge5.com/88/tag.min.js";
    bannerScript.async = true;
    bannerScript.setAttribute("data-zone", "194391");
    bannerScript.setAttribute("data-cfasync", "false");
    document.body.appendChild(bannerScript);

    return () => {
      document.body.removeChild(popScript);
      document.body.removeChild(bannerScript);
    };
  }, []);

  // =====================
  // REDIRECT AFTER ADS
  // =====================
  useEffect(() => {
    if (!originalUrl || error) return;

    if (redirecting) return;
    setRedirecting(true);

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          window.location.href = originalUrl; // redirect reliably
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [originalUrl, error, redirecting]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Please wait...</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && !originalUrl && <p>Loading link...</p>}
      {originalUrl && countdown > 0 && <p>Redirecting in {countdown}s...</p>}

      <div id="banner-ads" style={{ marginTop: "20px" }}></div>
      <div id="social-ads" style={{ marginTop: "20px" }}></div>
    </div>
  );
}
