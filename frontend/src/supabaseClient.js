import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("https://nnxxjeplvwzxoabykfct.supabase.co.");
if (!supabaseAnonKey) throw new Error("sb_publishable_Qr0L-1bPpSJWIxI_RqdCTg_oGKnr9Id.");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
