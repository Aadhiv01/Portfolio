import Script from "next/script";

import { GA_HOSTS, GA_MEASUREMENT_ID, analyticsSnippet } from "@/lib/analytics";

/** Loads after the page is idle, so it never competes with the first paint. */
export function Analytics() {
  return (
    <Script id="analytics" strategy="lazyOnload">
      {analyticsSnippet(GA_MEASUREMENT_ID, GA_HOSTS)}
    </Script>
  );
}
