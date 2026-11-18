"use client";

import { Check, Copy } from "lucide-react";
import { useState, type MouseEvent, type ReactNode } from "react";

/**
 * A mailto link that copies the address to the clipboard on click, because many
 * people have no mail app configured. If the clipboard is unavailable or the
 * copy fails, the click falls through to the ordinary mailto link, so it still
 * works everywhere. The hero's "Email me" button opens the mail app directly.
 */
export function CopyEmail({
  email,
  className,
  children,
}: {
  email: string;
  className?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard) return;
    event.preventDefault();

    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        window.location.href = `mailto:${email}`;
      });
  };

  return (
    <a href={`mailto:${email}`} onClick={onClick} className={className}>
      <span className="min-w-0 break-words">{children ?? email}</span>
      {copied ? (
        <Check aria-hidden className="size-[0.7em] shrink-0" />
      ) : (
        <Copy aria-hidden className="size-[0.7em] shrink-0 opacity-70" />
      )}
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : "Copy email address"}
      </span>
    </a>
  );
}
