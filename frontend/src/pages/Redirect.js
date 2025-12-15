import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the original URL from Supabase
  useEffect(() => {
    const fetchUrl = async () => {
      const { data, error } = await supabase
        .from("short_urls")
        .select("*")
        .eq("short_code", code)
        .single();

      if (error || !data) {
        alert("Short URL not found!");
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
        })
        .eq("id", data.id);
    };

    fetchUrl();
  }, [code]);

  // Load Adstra pop-up ad script
  useEffect(() => {
    if (!originalUrl) return;

    const script = document.createElement("script");
    script.src = "https://nervesweedefeat.com/78/02/b6/7802b6afc6dac57681cda3d7f8f60218.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [originalUrl]);

  // Redirect to the original URL after ad script is loaded
  useEffect(() => {
    if (!originalUrl) return;

    const redirectTimeout = setTimeout(() => {
      let finalUrl = originalUrl;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }
      window.location.href = finalUrl;
    }, 3000); // 3 seconds delay for ad pop-up to show

    return () => clearTimeout(redirectTimeout);
  }, [originalUrl]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
        padding: "20px",
        overflow: "hidden"
      }}>
        <h1 style={{ fontSize: "48px", fontWeight: "700", letterSpacing: "2px", marginBottom: "20px" }}>Loading...</h1>
        <p style={{ fontSize: "20px", opacity: 0.8, marginBottom: "40px" }}>Please wait while we prepare your link</p>
        <div style={{
          width: "80px",
          height: "80px",
          border: "8px solid rgba(255, 255, 255, 0.2)",
          borderTop: "8px solid #22c55e",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return null; // No UI needed as redirect happens automatically
}
