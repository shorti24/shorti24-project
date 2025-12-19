import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [ready, setReady] = useState(false);

  /* =====================
     FETCH SHORT URL
  ====================== */
  useEffect(() => {
    const fetchUrl = async () => {
      const { data, error } = await supabase
        .from("short_urls")
        .select("*")
        .eq("short_code", code)
        .single();

      if (error || !data) {
        alert("Short URL not found");
        return;
      }

      setOriginalUrl(data.original_url);
      setLoading(false);

      await supabase
        .from("short_urls")
        .update({
          clicks: data.clicks + 1,
          total_valid_clicks: data.total_valid_clicks + 1,
          earnings:
            ((data.total_valid_clicks + 1) / 1000) * data.cpm_rate,
        })
        .eq("id", data.id);
    };

    fetchUrl();
  }, [code]);

  /* =====================
     COUNTDOWN
  ====================== */
  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setReady(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading]);

  /* =====================
     ADS SCRIPTS
     (FROM go.html)
  ====================== */
  useEffect(() => {
    // 🔥 POP ADS (from go.html)
    const popScript = document.createElement("script");
    popScript.type = "text/javascript";
    popScript.src = "https://otieu.com/4/10066336";
    popScript.async = true;
    document.body.appendChild(popScript);

    // 🔥 BANNER ADS
    const bannerEl = document.getElementById("banner-ads");
    if (bannerEl) {
      const bannerConfig = document.createElement("script");
      bannerConfig.innerHTML = `
        atOptions = {
          'key' : '5e631078d999c49a9297761881a85126',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      bannerEl.appendChild(bannerConfig);

      const bannerScript = document.createElement("script");
      bannerScript.src =
        "https://nervesweedefeat.com/5e631078d999c49a9297761881a85126/invoke.js";
      bannerEl.appendChild(bannerScript);
    }

    // 🔥 SOCIAL / NATIVE ADS
    const socialEl = document.getElementById("social-ads");
    if (socialEl) {
      const socialScript = document.createElement("script");
      socialScript.src =
        "https://nervesweedefeat.com/59/91/44/599144da0922a7186c15f24ecaceef31.js";
      socialEl.appendChild(socialScript);
    }
  }, []);

  /* =====================
     GET LINK HANDLER
  ====================== */
  const handleGetLink = () => {
    if (!ready) return;

    // 🔥 Trigger pop ad
    if (window._pop && typeof window._pop.open === "function") {
      window._pop.open();
    }

    // 🔥 Redirect after short delay
    setTimeout(() => {
      let finalUrl = originalUrl;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }
      window.location.href = decodeURIComponent(finalUrl);
    }, 800);
  };

  /* =====================
     UI
  ====================== */
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
      <h1 style={styles.title}>Your Link is Almost Ready</h1>
      <p style={styles.sub}>
        Ads help us keep this service free ❤️
      </p>

      <p style={styles.timer}>
        {ready ? "You can continue now" : `Please wait ${timeLeft}s`}
      </p>

      <div id="banner-ads" style={{ margin: "20px" }}></div>

      <button
        style={{
          ...styles.button,
          opacity: ready ? 1 : 0.6,
          cursor: ready ? "pointer" : "not-allowed",
        }}
        disabled={!ready}
        onClick={handleGetLink}
      >
        Get Link 🔗
      </button>

      <div id="social-ads" style={{ marginTop: "40px" }}></div>
    </div>
  );
}

/* =====================
   STYLES
===================== */
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: "18px",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
  },
  sub: {
    fontSize: "16px",
    opacity: 0.85,
  },
  timer: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#22c55e",
  },
  button: {
    padding: "16px 50px",
    fontSize: "20px",
    fontWeight: "600",
    border: "none",
    borderRadius: "14px",
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
