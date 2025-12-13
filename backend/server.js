const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Helper: generate random short code
const generateShortCode = () => Math.random().toString(36).substring(2, 8);

// --- Create Short URL ---
app.post('/api/create', async (req, res) => {
  try {
    const { url, user_id, is_ads_enabled, expires_at } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });

    const short_code = generateShortCode();

    const { error } = await supabase.from('short_urls').insert({
      short_code,
      original_url: url,
      user_id: user_id || null,
      clicks: 0,
      earnings: 0,
      is_ads_enabled: is_ads_enabled || false,
      created_at: new Date().toISOString(),
      expires_at: expires_at || null
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'DB insert failed' });
    }

    res.json({ short_code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Redirect Short URL ---
app.get('/r/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const { data, error } = await supabase
      .from('short_urls')
      .select('*')
      .eq('short_code', code)
      .single();

    if (error || !data) return res.status(404).send('URL not found');

    // Check expiry
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return res.status(410).send('URL expired');
    }

    // Update click count & earnings
    await supabase
      .from('short_urls')
      .update({
        clicks: data.clicks + 1,
        earnings: data.earnings + (data.is_ads_enabled ? 0.01 : 0) // example earning
      })
      .eq('id', data.id);

    // Ads logic
    if (data.is_ads_enabled) {
      // Redirect to an ads page first
      return res.redirect(`/ads?url=${encodeURIComponent(data.original_url)}`);
    }

    // Normal redirect
    res.redirect(data.original_url);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// --- Optional: Ads page example ---
app.get('/ads', (req, res) => {
  const { url } = req.query;
  // Here you can render a countdown page
  res.send(`
    <h1>Advertisement</h1>
    <p>Redirecting in 5 seconds...</p>
    <script>
      setTimeout(() => { window.location.href = "${url}"; }, 5000);
    </script>
  `);
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
