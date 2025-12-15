import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(8);
  const [showButton, setShowButton] = useState(false);

  // Fetch short URL
  useEffect(() => {
    const fetchUrl = async () => {
      const { data, error } = await supabase
        .from("short_urls")
        .select("*")
        .eq("short_code", code)
        .single();

      if (error || !data) {
        alert("Short URL not found!");
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
        })
        .eq("id", data.id);
    };

    fetchUrl();
  }, [code]);

  // Load popup ad script
  useEffect(() => {
    if (!originalUrl) return;

    const script = document.createElement("script");
    script.src = "https://js.onclckmn.com/static/onclicka.js";
    script.async = true;
    script.setAttribute("data-admpid", "402245");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [originalUrl]);

  // Countdown timer
  useEffect(() => {
    if (counter <= 0) {
      setShowButton(true);
      return;
    }

    const timer = setTimeout(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter]);

  const handleGetLink = () => {
    let finalUrl = originalUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    window.location.href = finalUrl;
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
      {!showButton ? (
        <>
          <h2>Please wait</h2>
          <p>Your link will be ready in</p>
          <h1>{counter}</h1>
          <p>seconds</p>
        </>
      ) : (
        <button
          onClick={handleGetLink}
          style={{
            padding: "14px 30px",
            background: "#22c55e",
            color: "#fff",
            fontSize: "18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Get Link
        </button>
      )}
    </div>
  );
}
