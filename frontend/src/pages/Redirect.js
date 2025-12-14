import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [countdown, setCountdown] = useState(10);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [adsProvider, setAdsProvider] = useState(null);
  const [cpmRate, setCpmRate] = useState(0);

  // Fetch original URL + ads provider
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
      setAdsProvider(data.ads_provider);
      setCpmRate(data.cpm_rate);
      setLoading(false);

      // Increment clicks & earnings
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

  const handleGetLink = () => {
    if (!originalUrl) return;

    // Open country-specific popunder
    const adsScripts = {
      HighCPMNetworkUS: "https://highcpm-us.example.com/ad.js",
      HighCPMNetworkUK: "https://highcpm-uk.example.com/ad.js",
      HighCPMNetworkCA: "https://highcpm-ca.example.com/ad.js",
      HighCPMNetworkIN: "https://highcpm-in.example.com/ad.js",
      EffectiveGateCPM: "https://pl28250505.effectivegatecpm.com/03/75/9b/03759b546b28dc8e0d3721a29528b08c.js",
    };

    if (adsProvider && adsScripts[adsProvider]) {
      window.open(adsScripts[adsProvider], "_self");
    }

    // Open original URL
    let finalUrl = originalUrl;
    if (!/^https?:\/\//i.test(originalUrl)) finalUrl = "https://" + originalUrl;
    window.open(finalUrl, "_blank");
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      background: "linear-gradient(135deg, #fff8e1, #ffd700)",
      color: "#111827",
      textAlign: "center",
      padding: "40px"
    }}>
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

      {showButton && (
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
