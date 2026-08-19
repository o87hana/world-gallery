import "server-only";
import { createClient } from "@sanity/client";
import { draftMode } from "next/headers";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-12-19";

export function getPublicSanityClient() {
  return createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" });
}

export function getPreviewSanityClient() {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    throw new Error("SANITY_API_READ_TOKEN is required for preview mode");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: "drafts",
  });
}

export async function getServerSanityContext() {
  const { isEnabled: isDraft } = await draftMode();

  return {
    client: isDraft
      ? getPreviewSanityClient()
      : getPublicSanityClient(),
    isDraft,
  };
}

export async function getServerSanityClient() {
  return (await getServerSanityContext()).client;
}
