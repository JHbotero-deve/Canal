export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");

export async function correo(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.FROM_EMAIL, to, subject, html }),
  }).catch(() => {});
}
