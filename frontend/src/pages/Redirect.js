import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);

  // Fetch original URL
  useEffect(() => {
    const fetchUrl = async () => {
      const { data, error } = await supabase
        .from("short_urls")
        .select("*")
        .eq("short_code", code)
        .single();

      if (error || !data) {
        alert("Short URL not found!");
        setLoading(false);
        return;
      }

      setOriginalUrl(data.original_url);
      setLoading(false);

      await supabase
        .from("short_urls")
        .update({
          clicks: data.clicks + 1,
          total_valid_clicks: data.total_valid_clicks + 1,
          earnings: ((data.total_valid_clicks + 1) / 1000) * data.cpm_rate,
          total_user_earning: ((data.total_valid_clicks + 1) / 1000) * data.cpm_rate,
          total_platform_earning: ((data.total_valid_clicks + 1) / 1000) * data.cpm_rate * 0.3,
        })
        .eq("id", data.id);
    };
    fetchUrl();
  }, [code]);

  // Inject video ad immediately
  useEffect(() => {
    if (!originalUrl) return;

    // Video ad container
    const adContainer = document.createElement("div");
    adContainer.id = "video-ad-container";
    adContainer.style.width = "100%";
    adContainer.style.maxWidth = "600px";
    adContainer.style.margin = "50px auto";
    adContainer.style.textAlign = "center";

    document.body.appendChild(adContainer);

    // Inject OnClck video ad script
    const videoAd = document.createElement("script");
    videoAd.src = "https://js.onclckmn.com/static/onclicka.js";
    videoAd.async = true;
    videoAd.setAttribute("data-admpid", "402247");

    // Listen for ad end to show Get Link button
    videoAd.onload = () => {
      // OnClck ad usually fires automatically, but we simulate "ad finished" after 30s
      setTimeout(() => {
        setShowButton(true);
      }, 30000); // 30 seconds
    };

    adContainer.appendChild(videoAd);

    return () => {
      if (adContainer) document.body.removeChild(adContainer);
    };
  }, [originalUrl]);

  const handleGetLink = () => {
    if (!originalUrl) return;

    let finalUrl = originalUrl;
    if (!/^https?:\/\//i.test(originalUrl)) finalUrl = "https://" + originalUrl;
    window.open(finalUrl, "_blank");
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
      {showButton && (
        <button
          onClick={handleGetLink}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "12px 20px",
            backgroundColor: "#3B82F6",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            marginTop: "20px",
          }}
        >
          Get Link
        </button>
      )}
    </div>
  );
}
