import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getCountry } from "../utils/getCountry";

/* =====================
   ADS CONFIG (EMPTY)
===================== */
const SMART_LINKS = {
  BD: "",
  US: "",
  ALL: "",
};

const POPUP_SCRIPT = "";
const BANNER_SCRIPT = "";
const BANNER_OPTIONS = null;

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

    return () => {
      document.body.removeChild(s);
    };
  }, [src, options]);
}

/* =====================
   AD SLIDER (PLACEHOLDER)
===================== */
function AdSlider({ adUrl }) {
  if (!adUrl) return null;

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
   NON SKIP AD (PLACEHOLDER)
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

  if (!adUrl) {
    return (
      <p style={{ color: "#374151" }}>
        Please wait {sec} seconds...
      </p>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      <iframe
        title="non-skip"
        src={adUrl}
        style={{ width: "100%", height: 300, border: 0, borderRadius: 12 }}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <p style={{ marginTop: 10, color: "#374151" }}>
        Video ends, then you will get the original link ({sec})
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
  const [adUrl, setAdUrl] = useState("");

  /* popup + banner (disabled) */
  useScript(POPUP_SCRIPT);
  useScript(BANNER_SCRIPT, BANNER_OPTIONS);

  /* get country */
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
