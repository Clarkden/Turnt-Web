import posthog from "posthog-js";
import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";

let initialized = false;

/**
 * Initialize PostHog on the client. Safe to call multiple times and during SSR
 * (it no-ops on the server and when no key is configured).
 */
export function initPostHog() {
  if (!browser || initialized) return;

  const key = env.PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: env.PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
  });
  initialized = true;
}

/**
 * Capture an analytics event. Never throws — analytics must not be able to
 * break the ticket/checkout flow.
 */
export function capture(event: string, properties?: Record<string, unknown>) {
  if (!browser) return;
  try {
    posthog.capture(event, properties);
  } catch (error) {
    console.warn("posthog capture failed", error);
  }
}

export { posthog };
