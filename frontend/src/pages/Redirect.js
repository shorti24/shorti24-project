import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();
  const [originalUrl, setOriginalUrl] = useState(null);
  const [loading, setLoading] = useState(true);

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

      // clicks update
      await supabase
        .from("short_urls")
        .update({
          clicks: data.clicks + 1,
          total_valid_clicks: data.total_valid_clicks + 1,
          earnings: ((data.total_valid_clicks + 1) / 1000) * data.cpm_rate,
        })
        .eq("id", data.id);

      // 👉 নতুন ট্যাবে ads-banner.html খুলে দাও
      window.open(`/ads-banner.html?url=${encodeURIComponent(data.original_url)}`, "_blank");
    };

    fetchUrl();
  }, [code]);

  if (loading) {
    return <h1>Preparing your link…</h1>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "40vh", color: "#fff", background: "#0f2027" }}>
      <h1>Ads are being shown…</h1>

      {/* ✅ Pop Ads Script (Current Tab) */}
      <script
        type="text/javascript"
        src="https://nervesweedefeat.com/78/02/b6/7802b6afc6dac57681cda3d7f8f60218.js"
      ></script>

      <script>
        {`
          setTimeout(() => {
            if (window._pop && typeof window._pop.open === "function") {
              window._pop.open();
            }
          }, 1000);
        `}
      </script>
    </div>
  );
}