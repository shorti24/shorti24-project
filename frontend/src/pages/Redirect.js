import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [customMessage, setCustomMessage] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setCustomMessage(data.custom_message);
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

  const handleGetLink = () => {
    let finalUrl = originalUrl;
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl;
    window.location.href = `/go.html?url=${encodeURIComponent(finalUrl)}`;
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
      {customMessage && <p style={styles.custom}>{customMessage}</p>}
      <p style={styles.sub}>Click the button to continue</p>
      <button style={styles.button} onClick={handleGetLink}>
        Get Link
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    gap: "20px",
    background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  },
  title: { fontSize: "38px", fontWeight: "700" },
  sub: { fontSize: "18px", opacity: 0.85 },
  custom: { fontSize: "20px", fontWeight: "600", color: "#facc15" },
  button: {
    padding: "16px 46px",
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