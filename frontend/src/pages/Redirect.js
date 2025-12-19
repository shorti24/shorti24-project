import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);

  // =====================
  // FETCH ORIGINAL URL
  // =====================
  useEffect(() => {
    const fetchUrl = async () => {
      const { data } = await supabase
        .from("links")
        .select("original_url")
        .eq("short_code", code)
        .single();

      if (data?.original_url) {
        setOriginalUrl(data.original_url);
      }
    };

    fetchUrl();
  }, [code]);

  // =====================
  // ADS SCRIPTS
  // =====================
  useEffect(() => {
    // 🔥 POP ADS
    const popScript = document.createElement("script");
    popScript.src = "https://otieu.com/4/10066336";
    popScript.async = true;
    document.body.appendChild(popScript);

    // 🔥 QUGE5 ADS
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
    if (originalUrl) {
      setTimeout(() => {
        window.location.href = originalUrl;
      }, 3000); // ads load time
    }
  }, [originalUrl]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Please wait...</h2>
      <p>Ads loading, you will be redirected shortly</p>

      <div id="banner-ads"></div>
      <div id="social-ads"></div>
    </div>
  );
}
