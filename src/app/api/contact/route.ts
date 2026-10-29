import { isMailerConfigured, sendPortfolioMail, type Outgoing } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * POST /api/contact — sends one message from the contact form or the
 * booking calendar. Answers 503 when email isn't configured, so the
 * browser can fall back to FormSubmit instead of failing.
 */
export async function POST(request: Request) {
  if (!isMailerConfigured) {
    return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, reason: "bad-request" }, { status: 400 });

  // Honeypot: people never fill this field; bots do. Pretend it worked.
  if (clip(body.company, 200)) return Response.json({ ok: true });

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const subject = clip(body.subject, 200);
  const fields = Array.isArray(body.fields)
    ? (body.fields as unknown[])
        .slice(0, 16)
        .filter((row): row is [unknown, unknown] => Array.isArray(row) && row.length === 2)
        .map(([label, value]) => [clip(label, 80), clip(value, 4000)] as [string, string])
        .filter(([label, value]) => label && value)
    : [];

  if (!name || !EMAIL_RE.test(email) || !subject || fields.length === 0) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const message: Outgoing = { subject, name, email, fields };
  try {
    await sendPortfolioMail(message);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("contact: send failed", err instanceof Error ? err.message : err);
    return Response.json({ ok: false, reason: "send-failed" }, { status: 502 });
  }
}
