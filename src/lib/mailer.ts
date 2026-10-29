import nodemailer, { type Transporter } from "nodemailer";
import { contact } from "@/data/site";

/**
 * Server-side email for the contact form and the booking calendar.
 *
 * Sends through a Gmail account with an App Password, so delivery does
 * not depend on which domain the site is served from (preview, production
 * or custom). Set in Vercel → Settings → Environment Variables:
 *
 *   GMAIL_USER          the Gmail address that sends
 *   GMAIL_APP_PASSWORD  an App Password for it (2-Step Verification on)
 *   CONTACT_TO          optional; where messages go (defaults to the
 *                       address in site.ts)
 *
 * Without the first two, `isMailerConfigured` is false and the client
 * falls back to FormSubmit.
 */
const user = process.env.GMAIL_USER ?? "";
const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
const to = process.env.CONTACT_TO || contact.email;

export const isMailerConfigured = Boolean(user && pass);

let transport: Transporter | null = null;
const getTransport = () =>
  (transport ??= nodemailer.createTransport({ service: "gmail", auth: { user, pass } }));

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

export type Outgoing = {
  subject: string;
  name: string;
  email: string;
  /** Label / value rows, in order. */
  fields: [string, string][];
};

export async function sendPortfolioMail({ subject, name, email, fields }: Outgoing) {
  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  await getTransport().sendMail({
    from: `"${name.replace(/["<>]/g, "")} via Portfolio" <${user}>`,
    to,
    replyTo: { name: name.replace(/["<>]/g, ""), address: email },
    subject,
    text: fields.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>`,
  });
}
