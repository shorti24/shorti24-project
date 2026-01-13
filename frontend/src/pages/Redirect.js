import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");
  const [clicked, setClicked] = useState(false);
  const [adsStep, setAdsStep] = useState(0); // 0 = none, 1 = ads1 done, 2 = ads2 done

  const ADS2_LINK =
    "https://creeduserbane.com/q2zh71eki?key=14b197e2bcc7866c4c1b4c4561a12ab4";

  // =====================
  // FETCH ORIGINAL URL
  // =====================
  useEffect(() => {
    if (!code) return setError("Invalid link");

    const fetchUrl = async () => {
      const { data } = await supabase
        .from("short_urls")
        .select("original_url")
        .eq("short_code", code)
        .single();

      if (!data?.original_url) return setError("Link not found");

      let url = data.original_url.trim();
      if (!url.startsWith("http")) url = "https://" + url;

      setOriginalUrl(url);
    };

    fetchUrl();
  }, [code]);

  // =====================
  // ADS 1 (OLD TAG ADS)
  // =====================
  const openAds1 = () => {
    const w = window.open("about:blank", "_blank", "noopener,noreferrer");
    if (w) {
      w.document.write(`
        <html>
          <body>
            <script src="https://al5sm.com/tag.min.js" data-zone="10350229"></script>
          </body>
        </html>
      `);
      w.document.close();
    } else {
      const s = document.createElement("script");
      s.src = "https://al5sm.com/tag.min.js";
      s.dataset.zone = "10350229";
      s.async = true;
      document.body.appendChild(s);
    }
  };

  // =====================
  // ADS 2 (NEW SMARTLINK)
  // =====================
  const openAds2 = () => {
    const w = window.open("about:blank", "_blank", "noopener,noreferrer");
    if (w) {
      w.location.href = ADS2_LINK;
    } else {
      window.location.href = ADS2_LINK;
    }
  };

  // =====================
  // ADS BUTTON HANDLER
  // =====================
  const handleAdsClick = () => {
    if (clicked || adsStep >= 2) return;
    setClicked(true);

    if (adsStep === 0) openAds1();
    if (adsStep === 1) openAds2();

    setTimeout(() => {
      setAdsStep((prev) => prev + 1);
      setClicked(false);
    }, 800);
  };

  // =====================
  // MAIN LINK
  // =====================
  const handleMainClick = () => {
    if (adsStep < 2 || !originalUrl) return;
    window.open(originalUrl, "_blank");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h2>Choose your link…</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {originalUrl && (
        <>
          {adsStep < 2 && (
            <button
              onClick={handleAdsClick}
              style={{
                padding: "12px 24px",
                margin: "8px",
                fontSize: "16px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Watch ADS to unlock {adsStep + 1} / 2
            </button>
          )}

          <button
            onClick={handleMainClick}
            disabled={adsStep < 2}
            style={{
              padding: "12px 24px",
              margin: "8px",
              fontSize: "16px",
              background: adsStep >= 2 ? "#007bff" : "#aaa",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: adsStep >= 2 ? "pointer" : "not-allowed",
            }}
          >
            Get Main Link
          </button>
        </>
      )}
    </div>
  );
}
