import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [countdown, setCountdown] = useState(10);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupShown, setPopupShown] = useState(false);
  const adsPageUrl = "https://your-ads-page.com"; // Current tab ads page

  // Fetch original URL from Supabase
  useEffect(() => {
    const fetchUrl = async () => {
      const { data, error } = await supabase
        .from("short_urls")
        .select("*")
        .eq("short_code", code)
        .single();

      if (error || !data) {
        alert("Short URL not found!");
        setLoading(false);
        return;
      }

      setOriginalUrl(data.original_url);
      setLoading(false);

      // Increment clicks
      await supabase
        .from("short_urls")
        .update({ clicks: data.clicks + 1 })
        .eq("id", data.id);
    };

    fetchUrl();
  }, [code]);

  // Countdown timer (smooth, ekbar)
  useEffect(() => {
    if (!originalUrl) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPopupShown(true); // Popup ad show korbe
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [originalUrl]);

  // Load top script ad
  useEffect(() => {
    const scriptAd = document.createElement("script");
    scriptAd.src = "https://pl28257660.effectivegatecpm.com/68/9a/cd/689acdeb2523ed41b19a5d29e214dcfe.js";
    scriptAd.async = true;
    document.getElementById("script-ad")?.appendChild(scriptAd);

    return () => {
      document.getElementById("script-ad")?.removeChild(scriptAd);
    };
  }, []);

  // Load popup ad after countdown
  useEffect(() => {
    if (!popupShown) return;

    const popupAd = document.createElement("script");
    popupAd.src = "https://pl28250505.effectivegatecpm.com/03/75/9b/03759b546b28dc8e0d3721a29528b08c.js";
    popupAd.async = true;
    document.getElementById("popup-ad")?.appendChild(popupAd);
  }, [popupShown]);

  // Load banner / iframe ad
  useEffect(() => {
    const container = document.getElementById("banner-ad");
    if (!container) return;

    const optionsScript = document.createElement("script");
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '8d3db34cc9b0d836d7457e364bbe0e0f',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    container.appendChild(optionsScript);

    const bannerScript = document.createElement("script");
    bannerScript.src = "https://www.highperformanceformat.com/8d3db34cc9b0d836d7457e364bbe0e0f/invoke.js";
    bannerScript.async = true;
    container.appendChild(bannerScript);
  }, []);

  // Load social bar (example)
  useEffect(() => {
    const container = document.getElementById("social-bar");
    if (!container) return;

    const socialScript = document.createElement("script");
    socialScript.src = "https://example.com/social-bar.js"; // Replace with actual social bar script
    socialScript.async = true;
    container.appendChild(socialScript);
  }, []);

  // Popunder style handle
  const handleGetLink = () => {
    if (!originalUrl) return;

    // Original URL new tab
    const newWindow = window.open(originalUrl, "_blank");
    if (newWindow) newWindow.blur(); // Popunder style

    window.focus(); // Current tab focus (ads page)
  };

  if (loading)
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#f5f5f5",
      }}>
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "linear-gradient(135deg, #fff8e1, #ffd700)",
      color: "#111827",
      textAlign: "center",
      padding: "40px",
    }}>
      {/* Countdown Circle */}
      <div style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        border: "8px solid #FFD700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2.5rem",
        fontWeight: "700",
        color: "#FFD700",
        marginBottom: "30px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        animation: "pulse 1s infinite",
      }}>
        {countdown > 0 ? countdown : "⏱"}
      </div>

      <h1 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Your link is almost ready!
      </h1>
      <p style={{ color: "#6B7280", fontSize: "1rem", marginBottom: "40px" }}>
        Click "Get Link" after countdown to open your URL
      </p>

      {countdown <= 0 && (
        <button
          onClick={handleGetLink}
          style={{
            padding: "12px 28px",
            backgroundColor: "#3B82F6",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Get Link
        </button>
      )}

      {/* Ads Section */}
      <div id="script-ad" style={{ margin: "20px 0" }}></div>
      <div id="popup-ad" style={{ margin: "20px 0" }}></div>
      <div id="banner-ad" style={{
        margin: "20px 0",
        position: "sticky",
        bottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}></div>
      <div id="social-bar" style={{ margin: "20px 0" }}></div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
