import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getCountry } from "../utils/getCountry";

/* =====================
   ADS CONFIG
===================== */
const SMART_LINKS = {
  BD: "https://www.effectivegatecpm.com/ir2riavk?key=83f4cf0bacd3006f6e9abca3bcdcafff",
  US: "https://www.effectivegatecpm.com/fpxt8394?key=9265ebfce02c04b3093256a4f400a455",
  ALL: "https://www.effectivegatecpm.com/ir2riavk?key=83f4cf0bacd3006f6e9abca3bcdcafff",
};

const POPUP_SCRIPT = "https://pl28250505.effectivegatecpm.com/03/75/9b/03759b546b28dc8e0d3721a29528b08c.js";

const BANNER_SCRIPT = "https://www.highperformanceformat.com/8d3db34cc9b0d836d7457e364bbe0e0f/invoke.js";
const BANNER_OPTIONS = {
  key: "8d3db34cc9b0d836d7457e364bbe0e0f",
  format: "iframe",
  height: 90,
  width: 728,
  params: {},
};

/* =====================
   SCRIPT INJECTOR
===================== */
function useScript(src, options) {
  useEffect(() => {
    if (options) window.atOptions = options;
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
    return () => document.body.removeChild(s);
  }, [src, options]);
}

/* =====================
   AD SLIDER
===================== */
function AdSlider({ adUrl }) {
  return (
    <iframe
      title="ads"
      src={adUrl}
      style={{ width: "100%", maxWidth: 900, height: 260, border: 0, borderRadius: 12 }}
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}

/* =====================
   NON SKIP AD
===================== */
function NonSkipAd({ onDone, adUrl }) {
  const [sec, setSec] = useState(8);

  useEffect(() => {
    if (sec <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec, onDone]);

  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      <iframe
        title="non-skip"
        src={adUrl}
        style={{ width: "100%", height: 300, border: 0, borderRadius: 12 }}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <p style={{ marginTop: 10, color: "#374151" }}>
        <strong>English:</strong> Video ends, then you will get the original link ({sec})
      </p>
    </div>
  );
}

/* =====================
   MAIN REDIRECT
===================== */
export default function Redirect() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [showNonSkip, setShowNonSkip] = useState(false);
  const [canGetLink, setCanGetLink] = useState(false);
  const [adUrl, setAdUrl] = useState(SMART_LINKS.ALL);

  /* popup + banner */
  useScript(POPUP_SCRIPT);
  useScript(BANNER_SCRIPT, BANNER_OPTIONS);

  /* get country + ad */
  useEffect(() => {
    getCountry().then((c) => setAdUrl(SMART_LINKS[c] || SMART_LINKS.ALL));
  }, []);

  /* fetch short url */
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("short_urls")
        .select("*")
        .eq("short_code", code)
        .single();

      if (!data) {
        alert("Invalid short link");
        setLoading(false);
        return;
      }

      setOriginalUrl(data.original_url);
      setLoading(false);

      await supabase
        .from("short_urls")
        .update({ clicks: (data.clicks || 0) + 1 })
        .eq("id", data.id);
    })();
  }, [code]);

  /* countdown */
  useEffect(() => {
    if (loading || showNonSkip) return;
    if (countdown <= 0) {
      setShowNonSkip(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, loading, showNonSkip]);

  /* fallback safety */
  useEffect(() => {
    const safe = setTimeout(() => setCanGetLink(true), 20000);
    return () => clearTimeout(safe);
  }, []);

  const handleGetLink = () => {
    window.open(originalUrl, "_blank");
    window.location.href = adUrl;
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 16,
        background: "linear-gradient(135deg,#fff8e1,#ffd700)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        fontFamily: "system-ui",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            border: "8px solid #FFD700",
            display: "grid",
            placeItems: "center",
            fontSize: 36,
            fontWeight: 800,
            margin: "0 auto",
          }}
        >
          {showNonSkip ? "⏱" : countdown}
        </div>
        <h2>Your link is almost ready</h2>
      </div>

      {!showNonSkip && <AdSlider adUrl={adUrl} />}

      {showNonSkip && !canGetLink && (
        <NonSkipAd adUrl={adUrl} onDone={() => setCanGetLink(true)} />
      )}

      {canGetLink && (
        <button
          onClick={handleGetLink}
          style={{
            padding: "12px 28px",
            background: "#2563EB",
            color: "#fff",
            border: 0,
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Get Link
        </button>
      )}

      <div style={{ minHeight: 100 }} />
    </div>
  );
}
