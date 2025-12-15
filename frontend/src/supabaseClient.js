import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nnxxjeplvwzxoabykfct.supabase.co";
const supabaseAnonKey = "sb_publishable_Qr0L-1bPpSJWIxI_RqdCTg_oGKnr9Id";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
