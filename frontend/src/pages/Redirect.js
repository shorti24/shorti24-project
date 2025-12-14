import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [countdown, setCountdown] = useState(10);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const adsPageUrl = "https://your-ads-page.com"; // Replace with your ads page

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

  // Countdown timer
  useEffect(() => {
    if (!originalUrl) return;
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, originalUrl]);

  const handleGetLink = () => {
    if (!originalUrl) return;
    window.open(originalUrl, "_blank"); // Open original URL
    window.location.href = adsPageUrl; // Redirect to ads page
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
