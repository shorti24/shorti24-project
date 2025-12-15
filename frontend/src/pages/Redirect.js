import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [countdown, setCountdown] = useState(10);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);

  // Fetch original URL from Supabase
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

      // Update click & earnings
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

  // Countdown before "Get Link"
  useEffect(() => {
    if (!originalUrl) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [originalUrl]);

  // Inject Video Ads (OnClckMn)
  useEffect(() => {
    if (!originalUrl) return;

    const videoScript = document.createElement("script");
    videoScript.async = true;
    videoScript.src = "https://js.onclckmn.com/static/onclicka.js";
    videoScript.setAttribute("data-admpid", "402247"); // আপনার ভিডিও ads এর ID
    document.body.appendChild(videoScript);

    return () => {
      document.body.removeChild(videoScript);
    };
  }, [originalUrl]);

  // Inject Banner & Social Bar
  useEffect(() => {
    if (!originalUrl) return;

    const banner = document.createElement("div");
    banner.innerHTML = `
      <script type="text/javascript">
        atOptions = {
          'key' : '5e631078d999c49a9297761881a85126',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://nervesweedefeat.com/5e631078d999c49a9297761881a85126/invoke.js"></script>
    `;
    banner.style.display = "flex";
    banner.style.justifyContent = "center";
    banner.style.margin = "20px 0";

    const social = document.createElement("div");
    social.innerHTML = `<script type="text/javascript" src="https://nervesweedefeat.com/59/91/44/599144da0922a7186c15f24ecaceef31.js"></script>`;
    social.style.display = "flex";
    social.style.justifyContent = "center";
    social.style.margin = "20px 0";

    document.body.appendChild(banner);
    document.body.appendChild(social);

    return () => {
      document.body.removeChild(banner);
      document.body.removeChild(social);
    };
  }, [originalUrl]);

  // Handle "Get Link" button
  const handleGetLink = () => {
    if (!originalUrl) return;

    // Pop-under on user click
    const popunderScript = document.createElement("script");
    popunderScript.src = "https://js.onclckmn.com/static/onclicka.js"; // আপনার pop-under ID এখানে লাগাতে হবে
    popunderScript.async = true;
    popunderScript.setAttribute("data-admpid", "402245"); // Popunder ID
    document.body.appendChild(popunderScript);

    // Open original link
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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center", background: "linear-gradient(135deg, #fff8e1, #ffd700)" }}>
      <div style={{ width: "25vw", maxWidth: "120px", aspectRatio: "1", borderRadius: "50%", border: "8px solid #FFD700", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "700", color: "#FFD700", marginBottom: "20px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", animation: "pulse 1s infinite" }}>
        {countdown > 0 ? countdown : "⏱"}
      </div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Your link is almost ready!</h1>
      <p style={{ color: "#6B7280", fontSize: "1rem", marginBottom: "20px" }}>Click "Get Link" after countdown to open your URL</p>

      {showButton && (
        <button onClick={handleGetLink} style={{ width: "100%", maxWidth: "300px", padding: "12px 20px", backgroundColor: "#3B82F6", color: "#fff", fontWeight: "600", borderRadius: "8px", border: "none", fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
          Get Link
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
