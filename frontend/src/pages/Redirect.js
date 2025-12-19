import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");

  // =====================
  // FETCH ORIGINAL URL
  // =====================
  useEffect(() => {
    if (!code) {
      setError("No short code found");
      return;
    }

    const fetchUrl = async () => {
      const { data, error } = await supabase
        .from("short_urls")
        .select("original_url")
        .eq("short_code", code)
        .single();

      if (error || !data?.original_url) {
        setError("Link not found");
        return;
      }

      setOriginalUrl(data.original_url);
    };

    fetchUrl();
  }, [code]);

  // =====================
  // ADS SCRIPT (optional banner/pop)
  // =====================
  useEffect(() => {
    const bannerScript = document.createElement("script");
    bannerScript.src = "https://quge5.com/88/tag.min.js"; // banner ad
    bannerScript.async = true;
    bannerScript.setAttribute("data-zone", "194391");
    bannerScript.setAttribute("data-cfasync", "false");
    document.body.appendChild(bannerScript);

    return () => {
      document.body.removeChild(bannerScript);
    };
  }, []);

  // =====================
  // HANDLE GET LINK CLICK
  // =====================
  const handleGetLink = () => {
    // Open pop ad in a new tab
    window.open("https://al5sm.com/adlink", "_blank");

    // Open original URL in another tab
    if (originalUrl) {
      window.open(originalUrl, "_blank");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Get Your Link</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && !originalUrl && <p>Loading link...</p>}

      {originalUrl && (
        <>
          <p>Click the button below to access your link:</p>
          <button
            onClick={handleGetLink}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            Get Link
          </button>
        </>
      )}

      <div id="banner-ads" style={{ marginTop: "20px" }}></div>
      <div id="social-ads" style={{ marginTop: "20px" }}></div>
    </div>
  );
}
