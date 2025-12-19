import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

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
        .from("short_urls") // make sure table name matches
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
  // ADS SCRIPTS
  // =====================
  useEffect(() => {
    // Pop ad
    const popScript = document.createElement("script");
    popScript.src = "https://otieu.com/4/10066336";
    popScript.async = true;
    document.body.appendChild(popScript);

    // Banner / other ads
    const qugeScript = document.createElement("script");
    qugeScript.src = "https://quge5.com/88/tag.min.js";
    qugeScript.async = true;
    qugeScript.setAttribute("data-zone", "194391");
    qugeScript.setAttribute("data-cfasync", "false");
    document.body.appendChild(qugeScript);

    return () => {
      document.body.removeChild(popScript);
      document.body.removeChild(qugeScript);
    };
  }, []);

  // =====================
  // REDIRECT AFTER ADS
  // =====================
  useEffect(() => {
    if (!originalUrl || error) return;

    // prevent multiple redirects
    if (redirecting) return;
    setRedirecting(true);

    // wait 6 seconds before redirecting
    const timer = setTimeout(() => {
      window.location.href = originalUrl; // redirect reliably
    }, 6000);

    return () => clearTimeout(timer);
  }, [originalUrl, error, redirecting]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Please wait...</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && !originalUrl && <p>Loading link...</p>}
      {originalUrl && !redirecting && <p>Loading ads...</p>}
      {originalUrl && redirecting && <p>Redirecting soon...</p>}

      <div id="banner-ads" style={{ marginTop: "20px" }}></div>
      <div id="social-ads" style={{ marginTop: "20px" }}></div>
    </div>
  );
}
