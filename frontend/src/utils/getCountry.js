export async function getCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.country_code; // BD, US, IN
  } catch {
    return "ALL";
  }
}
