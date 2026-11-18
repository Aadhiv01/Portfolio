import { ImageResponse } from "next/og";

import { content } from "@/content";

export const alt = `${content.profile.name} — ${content.profile.roles[0]}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The card LinkedIn and recruiter messages show. Built once at build time from
   the same content as the page, in the site's palette: chalk, ink, ultramarine. */
export default function OpenGraphImage() {
  const [firstName, ...rest] = content.profile.name.split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f5f7",
          color: "#0d1220",
          padding: "60px 80px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#4c5566",
            fontFamily: "monospace",
          }}
        >
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, lineHeight: 1, fontWeight: 600 }}>
            {firstName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              lineHeight: 1.05,
              fontStyle: "italic",
              color: "#2447e0",
            }}
          >
            {rest.join(" ")}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              lineHeight: 1.3,
              color: "#0d1220",
              maxWidth: 980,
            }}
          >
            {content.profile.headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #d8dce4",
            paddingTop: 24,
            fontSize: 26,
            color: "#4c5566",
            fontFamily: "monospace",
          }}
        >
          <span>{content.profile.roles[0]}</span>
          <span>aadhithyavijayakumar.com</span>
        </div>
      </div>
    ),
    size,
  );
}
