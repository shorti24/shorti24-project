import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");
  const [clicked, setClicked] = useState(false);
  const [firstClickDone, setFirstClickDone] = useState(false);

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
  // BUTTON CLICK HANDLER
  // =====================
  const handleClick = (type) => {
    if (!originalUrl || clicked) return;
    setClicked(true);

    if (type === "ads") {
      // 🔹 ADS
      const adWin = window.open("about:blank", "_blank", "noopener,noreferrer");
      if (adWin) {
        adWin.location.href = "https://al5sm.com/tag.min.js?zone=10350229";
      } else {
        const s = document.createElement("script");
        s.src = "https://al5sm.com/tag.min.js";
        s.async = true;
        s.dataset.zone = "10350229";
        document.body.appendChild(s);
      }
      setFirstClickDone(true);
      setClicked(false); // allow next click
    } else if (type === "main" && firstClickDone) {
      // 🔹 MAIN LINK
      window.open(originalUrl, "_blank");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Arial" }}>
      <h2>Choose your link…</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {originalUrl && (
        <>
          <button
            onClick={() => handleClick("ads")}
            style={{ padding: "12px 24px", margin: "8px", fontSize: "16px", background: "#28a745", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Get ADS
          </button>
          <button
            onClick={() => handleClick("main")}
            style={{ padding: "12px 24px", margin: "8px", fontSize: "16px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: firstClickDone ? "pointer" : "not-allowed" }}
            disabled={!firstClickDone}
          >
            Get Main Link
          </button>
        </>
      )}
    </div>
  );
}
