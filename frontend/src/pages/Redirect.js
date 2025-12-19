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
    console.log("Short code from URL:", code);

    if (!code) {
      setError("No short code found");
      return;
    }

    const fetchUrl = async () => {
      const { data, error } = await supabase
        .from("links")
        .select("original_url")
        .eq("short_code", code)
        .single();

      console.log("Supabase response:", data, error);

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
    const popScript = document.createElement("script");
    popScript.src = "https://otieu.com/4/10066336";
    popScript.async = true;
    document.body.appendChild(popScript);

    const qugeScript = document.createElement("script");
    qugeScript.src = "https://quge5.com/88/tag.min.js";
    qugeScript.async = true;
    qugeScript.setAttribute("data-zone", "194391");
    qugeScript.setAttribute("data-cfasync", "false");
    document.body.appendChild(qugeScript);
  }, []);

  // =====================
  // AUTO REDIRECT
  // =====================
  useEffect(() => {
    if (!originalUrl) return;

    console.log("Redirecting to:", originalUrl);

    const timer = setTimeout(() => {
      window.location.href = originalUrl;
    }, 3000);

    return () => clearTimeout(timer);
  }, [originalUrl]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Please wait...</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && !originalUrl && <p>Loading link...</p>}
      {originalUrl && <p>Redirecting...</p>}

      <div id="banner-ads"></div>
      <div id="social-ads"></div>
    </div>
  );
}
