import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Fetch short URL
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

  // Load SOCIAL BAR ad
  useEffect(() => {
    if (!originalUrl) return;

    const socialScript = document.createElement("script");
    socialScript.src =
      "https://nervesweedefeat.com/59/91/44/599144da0922a7186c15f24ecaceef31.js";
    socialScript.async = true;

    document.body.appendChild(socialScript);

    return () => {
      document.body.removeChild(socialScript);
    };
  }, [originalUrl]);

  const handleContinue = () => {
    let finalUrl = originalUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }
    window.location.href = finalUrl;
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Preparing your link…</h1>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Your link is ready</h1>

      {/* 🔥 BANNER AD (300x250) */}
      <div style={styles.adBox}>
        <iframe
          src="https://nervesweedefeat.com/5e631078d999c49a9297761881a85126/invoke.js"
          width="300"
          height="250"
          frameBorder="0"
          scrolling="no"
          title="Ad Banner"
        />
      </div>

      <button onClick={handleContinue} style={styles.button}>
        Continue
      </button>
    </div>
  );
}

/* =====================
   PREMIUM STYLES
===================== */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    textAlign: "center",
    gap: "25px",
    padding: "20px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    letterSpacing: "1px",
  },
  adBox: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  button: {
    padding: "16px 42px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },
  spinner: {
    width: "70px",
    height: "70px",
    border: "7px solid rgba(255,255,255,0.2)",
    borderTop: "7px solid #22c55e",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
