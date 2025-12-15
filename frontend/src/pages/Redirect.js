import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);

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

  // Load Adstra pop-up script
  useEffect(() => {
    if (!originalUrl) return;

    const script = document.createElement("script");
    script.src = "https://nervesweedefeat.com/78/02/b6/7802b6afc6dac57681cda3d7f8f60218.js";
    script.async = true;

    script.onload = () => {
      console.log("Adstra script loaded");
      // Show the "Continue" button after script loads
      setShowButton(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [originalUrl]);

  const handleRedirect = () => {
    let finalUrl = originalUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }
    window.location.href = finalUrl;
  };

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

  // Show "Continue" button after Adstra script loads
  return showButton ? (
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
    }}>
      <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "20px" }}>Your link is ready!</h1>
      <p style={{ fontSize: "18px", opacity: 0.8, marginBottom: "30px" }}>Click below to continue</p>
      <button
        onClick={handleRedirect}
        style={{
          padding: "16px 40px",
          background: "linear-gradient(90deg, #22c55e, #16a34a)",
          color: "#fff",
          fontSize: "20px",
          fontWeight: "600",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-3px)";
          e.target.style.boxShadow = "0 12px 25px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
        }}
      >
        Continue
      </button>
    </div>
  ) : null;
}
