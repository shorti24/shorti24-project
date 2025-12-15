import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [countdown, setCountdown] = useState(10);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);

  // Fetch original URL and increment clicks
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

      await supabase
        .from("short_urls")
        .update({
          clicks: data.clicks + 1,
          total_valid_clicks: data.total_valid_clicks + 1,
          earnings: ((data.total_valid_clicks + 1) / 1000) * data.cpm_rate,
          total_user_earning: ((data.total_valid_clicks + 1) / 1000) * data.cpm_rate,
          total_platform_earning: ((data.total_valid_clicks + 1) / 1000) * data.cpm_rate * 0.3,
        })
        .eq("id", data.id);
    };

    fetchUrl();
  }, [code]);

  // Countdown timer
  useEffect(() => {
    if (!originalUrl) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [originalUrl]);

  // Inject Banner & Social Bar ads during countdown
  useEffect(() => {
    if (!originalUrl) return;

    // Banner ad
    const bannerContainer = document.createElement("div");
    bannerContainer.style.display = "flex";
    bannerContainer.style.justifyContent = "center";
    bannerContainer.style.margin = "20px 0";
    bannerContainer.innerHTML = `
      <script type="text/javascript">
        atOptions = {
          'key' : '5e631078d999c49a9297761881a85126',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://nervesweedefeat.com/5e631078d999c49a9297761881a85126/invoke.js"></script>
    `;

    // Social bar ad
    const socialContainer = document.createElement("div");
    socialContainer.style.display = "flex";
    socialContainer.style.justifyContent = "center";
    socialContainer.style.margin = "20px 0";
    socialContainer.innerHTML = `
      <script type="text/javascript" src="https://nervesweedefeat.com/59/91/44/599144da0922a7186c15f24ecaceef31.js"></script>
    `;

    document.body.appendChild(bannerContainer);
    document.body.appendChild(socialContainer);

    return () => {
      document.body.removeChild(bannerContainer);
      document.body.removeChild(socialContainer);
    };
  }, [originalUrl]);

  const handleGetLink = () => {
    if (!originalUrl) return;

    // Popunder in background tab/window
    const popunder = window.open(
      "https://nervesweedefeat.com/78/02/b6/7802b6afc6dac57681cda3d7f8f60218.js",
      "_blank",
      "width=1,height=1,top=0,left=0,scrollbars=no,resizable=no,noopener,noreferrer"
    );
    if (popunder) popunder.blur();

    // Original URL in new tab (small delay to allow popunder)
    setTimeout(() => {
      let finalUrl = originalUrl;
      if (!/^https?:\/\//i.test(originalUrl)) finalUrl = "https://" + originalUrl;
      window.open(finalUrl, "_blank");
    }, 300);
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fff8e1, #ffd700)",
        color: "#111827",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "25vw",
          maxWidth: "120px",
          aspectRatio: "1",
          borderRadius: "50%",
          border: "8px solid #FFD700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#FFD700",
          marginBottom: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          animation: "pulse 1s infinite",
        }}
      >
        {countdown > 0 ? countdown : "⏱"}
      </div>

      <h1 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Your link is almost ready!</h1>
      <p style={{ color: "#6B7280", fontSize: "1rem", marginBottom: "20px" }}>
        Click "Get Link" after countdown to open your URL
      </p>

      {showButton && (
        <button
          onClick={handleGetLink}
          style={{
            padding: "12px 20px",
            backgroundColor: "#3B82F6",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "all 0.2s",
            width: "100%",
            maxWidth: "300px",
          }}
        >
          Get Link
        </button>
      )}

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
