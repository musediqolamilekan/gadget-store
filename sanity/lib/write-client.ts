import { createClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-01-01";

/**
 * Server-only write client — never expose SANITY_API_WRITE_TOKEN to the browser.
 * Only use this in Server Actions or Route Handlers.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN,
});
