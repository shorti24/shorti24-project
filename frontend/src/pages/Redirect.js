import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getCountry } from "../utils/getCountry";

/* =====================
   ADS CONFIG (SMART LINK)
===================== */
const SMART_LINKS = {
  BD: {
    socialBar: "https://pl28257660.effectivegatecpm.com/68/9a/cd/689acdeb2523ed41b19a5d29e214dcfe.js",
    popup: "https://pl28250505.effectivegatecpm.com/03/75/9b/03759b546b28dc8e0d3721a29528b08c.js",
    banner: {
      script: "https://www.highperformanceformat.com/8d3db34cc9b0d836d7457e364bbe0e0f/invoke.js",
      options: { key: "8d3db34cc9b0d836d7457e364bbe0e0f", format: "iframe", height: 90, width: 728, params: {} }
    },
    popunder: "https://www.effectivegatecpm.com/ir2riavk?key=83f4cf0bacd3006f6e9abca3bcdcafff"
  },
  US: {
    socialBar: "https://pl28257660.effectivegatecpm.com/68/9a/cd/689acdeb2523ed41b19a5d29e214dcfe.js",
    popup: "https://pl28250505.effectivegatecpm.com/03/75/9b/03759b546b28dc8e0d3721a29528b08c.js",
    banner: {
      script: "https://www.highperformanceformat.com/8d3db34cc9b0d836d7457e364bbe0e0f/invoke.js",
      options: { key: "8d3db34cc9b0d836d7457e364bbe0e0f", format: "iframe", height: 90, width: 728, params: {} }
    },
    popunder: "https://www.effectivegatecpm.com/ir2riavk?key=83f4cf0bacd3006f6e9abca3bcdcafff"
  },
  ALL: {
    socialBar: "https://pl28257660.effectivegatecpm.com/68/9a/cd/689acdeb2523ed41b19a5d29e214dcfe.js",
    popup: "",
    banner: null,
    popunder: ""
  }
};

/* =====================
   SCRIPT INJECTOR
===================== */
function useScript(src, options) {
  useEffect(() => {
    if (!src) return;
    if (options) window.atOptions = options;
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
    return () => document.body.removeChild(s);
  }, [src, options]);
}

/* =====================
   AD COMPONENTS
===================== */
function AdSlider({ adUrl }) {
  if (!adUrl) return null;
  return (
    <iframe
      title="ads"
      src={adUrl}
      style={{ width: "100%", maxWidth: 900, height: 90, border: 0, borderRadius: 8 }}
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}

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

  if (!adUrl) return <p style={{ color: "#374151" }}>Please wait {sec} seconds...</p>;

  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      <iframe
        title="non-skip"
        src={adUrl}
        style={{ width: "100%", height: 300, border: 0, borderRadius: 12 }}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <p style={{ marginTop: 10, color: "#374151" }}>
        Video ends, then your link will be ready ({sec})
      </p>
    </div>
  );
}

/* =====================
   MAIN REDIRECT COMPONENT
===================== */
export default function Redirect() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [showNonSkip, setShowNonSkip] = useState(false);
  const [canGetLink, setCanGetLink] = useState(false);
  const [adConfig, setAdConfig] = useState(SMART_LINKS.ALL);

  /* Inject Scripts */
  useScript(adConfig.popup);
  useScript(adConfig.banner?.script, adConfig.banner?.options);

  /* GEO-based ad selection */
  useEffect(() => {
    getCountry().then((c) => setAdConfig(SMART_LINKS[c] || SMART_LINKS.ALL));
  }, []);

  /* Fetch original URL from Supabase */
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

  /* Countdown logic */
  useEffect(() => {
    if (loading || showNonSkip) return;
    if (countdown <= 0) {
      setShowNonSkip(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, loading, showNonSkip]);

  /* Fallback safety */
  useEffect(() => {
    const safe = setTimeout(() => setCanGetLink(true), 20000);
    return () => clearTimeout(safe);
  }, []);

  /* Handle Get Link + Popunder */
  const handleGetLink = () => {
    window.open(originalUrl, "_blank");
    if (adConfig.popunder) {
      const pop = window.open(adConfig.popunder, "_blank", "width=1,height=1,left=-1000,top=-1000");
      if (pop) pop.blur();
      window.focus();
    }
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
      {/* Countdown Circle */}
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

      {/* Social Bar / Banner */}
      {!showNonSkip && <AdSlider adUrl={adConfig.socialBar} />}

      {/* Non-skip Popup */}
      {showNonSkip && !canGetLink && (
        <NonSkipAd adUrl={adConfig.popup} onDone={() => setCanGetLink(true)} />
      )}

      {/* Get Link Button */}
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
