import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://nnxxjeplvwzxoabykfct.supabase.co",
  "sb_publishable_Qr0L-1bPpSJWIxI_RqdCTg_oGKnr9Id"
);

export const fetchShortUrls = async () => {
  const { data, error } = await supabase.from("short_urls").select("*");
  if (error) throw error;
  return data;
};

export const createShortUrl = async (original_url) => {
  const { data, error } = await supabase.from("short_urls").insert([{ original_url }]).select();
  if (error) throw error;
  return data[0];
};
