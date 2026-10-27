"use client";

import { useState, type FormEvent } from "react";
import { contact, site } from "@/data/site";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: {
  name: string;
  email: string;
  message: string;
}): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please add your name.";
  if (!values.email.trim()) errors.email = "Please add an email address.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "That email address doesn't look right.";
  if (!values.message.trim()) errors.message = "Please add a message.";
  else if (values.message.trim().length < 10)
    errors.message = "A little more detail would help.";
  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [sentName, setSentName] = useState("");

  const set = (key: keyof typeof values) => (v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    /* Honeypot: bots fill hidden fields, people don't. */
    const form = e.currentTarget;
    const trap = (form.elements.namedItem("company") as HTMLInputElement)?.value;
    if (trap) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = form.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...values,
          _subject: `Portfolio enquiry from ${values.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean | string;
      } | null;
      /* FormSubmit answers 200 with success "false" for rejected sends. */
      if (!res.ok || String(data?.success) !== "true") {
        throw new Error(String(res.status));
      }

      setSentName(values.name.trim());
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-line bg-surface/50 p-6 md:p-8"
    >
      <p className="label mb-6">Send a message</p>

      <div className="space-y-5">
        <Field
          id="name"
          label="Name"
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
          disabled={sending}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
          disabled={sending}
        />
        <Field
          id="message"
          label="Message"
          value={values.message}
          onChange={set("message")}
          error={errors.message}
          multiline
          disabled={sending}
        />

        {/* honeypot — hidden from people and from assistive tech */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <button
        type="submit"
        disabled={sending}
        className={cn(
          "group/btn mt-7 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full",
          "bg-accent text-sm font-medium text-bg transition-colors duration-300",
          "hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {sending ? "Sending…" : "Send message"}
        {!sending ? <Arrow /> : null}
      </button>

      {/* Status is announced, not just coloured */}
      <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm">
        {status === "sent" ? (
          <span className="text-accent">
            Thanks for reaching out{sentName ? `, ${sentName}` : ""}! Your
            message has been sent and I&rsquo;ll get back to you soon.
          </span>
        ) : null}
        {status === "error" ? (
          <span className="text-ink-dim">
            Something went wrong. You can email me directly at{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-accent underline underline-offset-4"
            >
              {contact.email}
            </a>
            .
          </span>
        ) : null}
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */

export function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  multiline = false,
  autoComplete,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const describedBy = error ? `${id}-error` : undefined;

  const shared = cn(
    "w-full rounded-lg border bg-bg px-4 py-3 text-sm text-ink",
    "placeholder:text-ink-faint transition-colors duration-300",
    "focus:outline-none focus:ring-2 focus:ring-accent/40",
    "disabled:opacity-60",
    error ? "border-red-500/60" : "border-line focus:border-ink-faint",
  );

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium text-ink-dim"
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={cn(shared, "resize-y")}
          placeholder="What are you working on?"
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={shared}
        />
      )}

      {error ? (
        <p id={describedBy} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
