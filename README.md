# Shorti24 - URL Shortener

## Setup
1. Copy .env.example to .env and add your Supabase credentials.
2. Install dependencies:
   npm install
3. Run locally:
   npm run dev

## Deployment
- Deploy backend folder to Node.js hosting (Render, Vercel, Railway)
- Deploy frontend folder to same server or static hosting
- Free users → ads + countdown
- Paid users → skip ads
- Ads code change → only update iframe src inside <div id="ads">
