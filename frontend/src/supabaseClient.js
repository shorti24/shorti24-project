import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://nnxxjeplvwzxoabykfct.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "sb_publishable_Qr0L-1bPpSJWIxI_RqdCTg_oGKnr9Id";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
