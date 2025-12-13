// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate
if (!supabaseUrl) {
  throw new Error("Supabase URL (REACT_APP_SUPABASE_URL) is required.");
}
if (!supabaseAnonKey) {
  throw new Error("Supabase Anon Key (REACT_APP_SUPABASE_ANON_KEY) is required.");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
