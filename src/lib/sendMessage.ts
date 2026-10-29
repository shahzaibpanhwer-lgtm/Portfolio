import { contact, site } from "@/data/site";

export type Message = {
  subject: string;
  name: string;
  email: string;
  /** Label / value rows, in the order they should read. */
  fields: [string, string][];
};

/**
 * Sends a message, trying the site's own /api/contact first (Gmail,
 * works on any domain) and FormSubmit second. Resolves true only when one
 * of them confirms delivery.
 */
export async function sendMessage(message: Message): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(message),
    });
    if (res.ok) return true;
    // A bad request won't get better elsewhere; anything else, try the backup.
    if (res.status === 400) return false;
  } catch {
    /* network or server down: fall through to the backup */
  }

  try {
    const res = await fetch(site.contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...Object.fromEntries(message.fields),
        name: message.name,
        email: message.email,
        _subject: message.subject,
        _template: "table",
        _captcha: "false",
      }),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean | string } | null;
    /* FormSubmit answers 200 with success "false" for rejected sends. */
    return res.ok && String(data?.success) === "true";
  } catch {
    return false;
  }
}

/** A mailto: link carrying the whole message, for when sending fails. */
export function mailtoHref(message: Message) {
  const body = message.fields.map(([label, value]) => `${label}: ${value}`).join("\n");
  return `mailto:${contact.email}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(body)}`;
}
