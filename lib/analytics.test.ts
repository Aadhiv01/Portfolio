import { describe, expect, it } from "vitest";

import { GA_HOSTS, GA_MEASUREMENT_ID, analyticsSnippet } from "./analytics";

interface Run {
  scripts: string[];
  events: string[];
  clickListeners: number;
}

/** Runs the snippet against a stand-in browser, so the guards are exercised for real. */
function run(options: {
  hostname: string;
  doNotTrack?: string;
  globalPrivacyControl?: boolean;
}): Run {
  const result: Run = { scripts: [], events: [], clickListeners: 0 };
  const dataLayer: unknown[] = [];

  const win: Record<string, unknown> = { dataLayer };
  const doc = {
    createElement: () => ({ async: false, src: "" }),
    head: {
      appendChild: (element: { src: string }) => {
        result.scripts.push(element.src);
      },
    },
    addEventListener: () => {
      result.clickListeners += 1;
    },
  };

  new Function("window", "document", "location", "navigator", analyticsSnippet(GA_MEASUREMENT_ID, GA_HOSTS))(
    win,
    doc,
    { hostname: options.hostname },
    { doNotTrack: options.doNotTrack, globalPrivacyControl: options.globalPrivacyControl },
  );

  for (const entry of dataLayer) {
    const call = Array.from(entry as ArrayLike<unknown>);
    if (call[0] === "event") result.events.push(String(call[1]));
  }

  return result;
}

describe("analytics snippet", () => {
  it("loads Google Analytics on the real domain and its www form", () => {
    for (const hostname of GA_HOSTS) {
      const result = run({ hostname });
      expect(result.scripts).toHaveLength(1);
      expect(result.scripts[0]).toContain(`id=${GA_MEASUREMENT_ID}`);
      expect(result.clickListeners).toBe(1);
    }
  });

  it("does nothing on localhost or a preview deployment", () => {
    for (const hostname of ["localhost", "portfolio-git-v2-aadhiv01.vercel.app"]) {
      const result = run({ hostname });
      expect(result.scripts, hostname).toHaveLength(0);
      expect(result.clickListeners, hostname).toBe(0);
    }
  });

  it("stays off when the browser asks not to be tracked", () => {
    expect(run({ hostname: GA_HOSTS[0], doNotTrack: "1" }).scripts).toHaveLength(0);
    expect(run({ hostname: GA_HOSTS[0], globalPrivacyControl: true }).scripts).toHaveLength(0);
  });

  it("uses the owner's measurement ID", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-LLJC91N9QP");
  });
});
