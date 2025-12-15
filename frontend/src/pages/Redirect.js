import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [countdown, setCountdown] = useState(10);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [adsProvider, setAdsProvider] = useState(null);

  // Fetch original URL + ads provider
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
      setAdsProvider(data.ads_provider);
      setLoading(false);

      // Increment clicks
      await supabase
        .from("short_urls")
        .update({
          clicks: data.clicks + 1,
        })
        .eq("id", data.id);
    };

    fetchUrl();
  }, [code]);

  // Countdown timer
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

  // Inject Banner & Social Ads during countdown
  useEffect(() => {
    if (countdown === 0) return;

    const bannerDiv = document.getElementById("banner-ad");
    const socialDiv = document.getElementById("social-ad");

    // Banner
    const bannerScript = document.createElement("script");
    bannerScript.src = "https://nervesweedefeat.com/5e631078d999c49a9297761881a85126/invoke.js";
    bannerScript.async = true;
    bannerDiv.appendChild(bannerScript);

    // Social bar
    const socialScript = document.createElement("script");
    socialScript.src = "https://nervesweedefeat.com/5e631078d999c49a9297761881a85126/invoke.js";
    socialScript.async = true;
    socialDiv.appendChild(socialScript);

    return () => {
      bannerDiv.innerHTML = "";
      socialDiv.innerHTML = "";
    };
  }, [countdown]);

  const handleGetLink = () => {
    if (!originalUrl) return;

    // Popunder Ad (background tab)
    if (adsProvider) {
      window.open(
        "https://nervesweedefeat.com/78/02/b6/7802b6afc6dac57681cda3d7f8f60218.js",
        "_blank",
        "width=1,height=1,left=-1000,top=-1000"
      );
    }

    // Original URL (new tab)
    let finalUrl = originalUrl;
    if (!/^https?:\/\//i.test(originalUrl)) finalUrl = "https://" + originalUrl;
    window.open(finalUrl, "_blank");
  };

  if (loading)
    return (
      <div className="loader">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div className="redirect-container">
      <div className="countdown-circle">{countdown > 0 ? countdown : "⏱"}</div>
      <h1>Your link is almost ready!</h1>
      <p>Click "Get Link" after countdown to open your URL</p>

      {/* Banner & Social ads */}
      {countdown > 0 && (
        <div className="ads-container">
          <div id="banner-ad" className="ad-box"></div>
          <div id="social-ad" className="ad-box"></div>
        </div>
      )}

      {showButton && (
        <button className="get-link-btn" onClick={handleGetLink}>
          Get Link
        </button>
      )}

      <style>{`
        .redirect-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff8e1, #ffd700);
          color: #111827;
          text-align: center;
          padding: 20px;
        }

        .countdown-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 8px solid #FFD700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }

        p {
          font-size: 1rem;
          margin-bottom: 30px;
          color: #6B7280;
        }

        .ads-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 100%;
          max-width: 350px;
          align-items: center;
          margin-bottom: 30px;
        }

        .ad-box {
          width: 100%;
          min-height: 250px;
        }

        .get-link-btn {
          padding: 14px 28px;
          background-color: #3B82F6;
          color: #fff;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }

        .get-link-btn:hover {
          transform: translateY(-3px);
        }

        @media (max-width: 480px) {
          .countdown-circle {
            width: 100px;
            height: 100px;
            font-size: 2rem;
          }
          h1 {
            font-size: 1.5rem;
          }
          .ads-container {
            max-width: 90%;
          }
          .get-link-btn {
            width: 90%;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
