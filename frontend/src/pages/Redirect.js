import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ✅ SOCIAL BAR – FIRST PAGE ONLY
  useEffect(() => {
    if (!originalUrl) return;

    const social = document.createElement("script");
    social.src =
      "https://nervesweedefeat.com/59/91/44/599144da0922a7186c15f24ecaceef31.js";
    social.async = true;

    document.body.appendChild(social);

    return () => {
      document.body.removeChild(social);
    };
  }, [originalUrl]);

  // 🔥 POP ADS ONLY ON BUTTON CLICK
  const handleGetLink = () => {
    const pop = document.createElement("script");
    pop.src =
      "https://nervesweedefeat.com/78/02/b6/7802b6afc6dac57681cda3d7f8f60218.js";
    pop.async = true;

    document.body.appendChild(pop);

    setTimeout(() => {
      let finalUrl = originalUrl;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }
      window.location.href = finalUrl;
    }, 1200); // pop open হওয়ার সময়
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Preparing your link…</h1>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Your link is ready</h1>
      <p style={styles.sub}>Click continue to proceed</p>

      <button style={styles.button} onClick={handleGetLink}>
        Get Link
      </button>
    </div>
  );
}

/* =====================
   PREMIUM UI
===================== */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    textAlign: "center",
    gap: "20px",
  },
  title: {
    fontSize: "38px",
    fontWeight: "700",
  },
  sub: {
    opacity: 0.8,
    fontSize: "18px",
  },
  button: {
    padding: "16px 45px",
    fontSize: "20px",
    fontWeight: "600",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(90deg,#22c55e,#16a34a)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  spinner: {
    width: "70px",
    height: "70px",
    border: "7px solid rgba(255,255,255,.2)",
    borderTop: "7px solid #22c55e",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
