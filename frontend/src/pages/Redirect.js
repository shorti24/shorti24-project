import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");
  const [adsStep, setAdsStep] = useState(0); // 0 = none, 1 = ads1 done, 2 = ads2 done

  const ADS1_LINK = "https://otieu.com/4/10483017";
  const ADS2_LINK =
    "https://creeduserbane.com/ka6yh5bud3?key=efab50234bd8b9d26c62a023984ae46b";

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
  // OPEN ADS FUNCTIONS
  // =====================
  const openAds = (link) => {
    const w = window.open(link, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = link;
  };

  // =====================
  // MAIN LINK
  // =====================
  const handleMainClick = () => {
    if (adsStep < 2 || !originalUrl) return;
    window.open(originalUrl, "_blank");
  };

  // =====================
  // ANIMATION STYLES
  // =====================
  const buttonStyle = {
    padding: "14px 28px",
    margin: "10px",
    fontSize: "18px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    width: "220px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const greenGlow = {
    ...buttonStyle,
    background: "#28a745",
    boxShadow: "0 0 10px #28a745, 0 0 20px #28a745, 0 0 30px #28a745",
  };

  const blueGlow = {
    ...buttonStyle,
    background: "#007bff",
    boxShadow: "0 0 10px #007bff, 0 0 20px #007bff, 0 0 30px #007bff",
  };

  const disabledStyle = {
    ...buttonStyle,
    background: "#aaa",
    cursor: "not-allowed",
    boxShadow: "none",
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
        textAlign: "center",
        padding: "20px",
        background: "radial-gradient(circle at top, #1e1e1e, #111)",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "#ffd700" }}>
        🎮 Unlock Your Link
      </h1>

      {/* Instruction Card */}
      <div
        style={{
          maxWidth: "440px",
          background: "#222",
          border: "2px solid #555",
          borderRadius: "12px",
          padding: "18px",
          marginBottom: "25px",
          textAlign: "left",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#00ffff" }}>📌 Instructions</h3>
        <ol style={{ paddingLeft: "18px", margin: 0 }}>
          <li>Click <strong>ADS 1</strong> and watch the ad</li>
          <li>Return to this page</li>
          <li>Click <strong>ADS 2</strong> and watch the ad</li>
          <li>Main link will unlock automatically</li>
        </ol>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {originalUrl && (
        <>
          {/* ADS BUTTONS */}
          {adsStep < 1 && (
            <button
              style={greenGlow}
              onClick={() => {
                openAds(ADS1_LINK);
                setAdsStep(1);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ▶ Watch ADS 1
            </button>
          )}

          {adsStep < 2 && adsStep >= 1 && (
            <button
              style={greenGlow}
              onClick={() => {
                openAds(ADS2_LINK);
                setAdsStep(2);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ▶ Watch ADS 2
            </button>
          )}

          {/* MAIN LINK */}
          <button
            onClick={handleMainClick}
            disabled={adsStep < 2}
            style={adsStep >= 2 ? blueGlow : disabledStyle}
            onMouseEnter={(e) => (adsStep >= 2 ? (e.currentTarget.style.transform = "scale(1.05)") : null)}
            onMouseLeave={(e) => (adsStep >= 2 ? (e.currentTarget.style.transform = "scale(1)") : null)}
          >
            🔓 Get Main Link
          </button>
        </>
      )}
    </div>
  );
}
