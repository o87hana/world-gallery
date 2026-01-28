import "server-only";
import { createClient } from "@sanity/client";
import { draftMode } from "next/headers";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-12-19";

export async function getServerSanityClient() {
  const { isEnabled: isDraft } = await draftMode();

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !isDraft,
    token: isDraft ? process.env.SANITY_API_READ_TOKEN : undefined,
    perspective: isDraft ? "previewDrafts" : "published",
  });
}
