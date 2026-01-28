import { getServerSanityClient } from "@/lib/sanity.server";
import { PINS_QUERY } from "@/lib/queries";
import { GlobeView } from "@/components/GlobeView";

export default async function TravelPage({ params }: { params: Promise<{ lang: "ja" | "en" }> }) {
  const { lang } = await params;
  const client = await getServerSanityClient();
  const pins = await client.fetch(PINS_QUERY);

  return (
    <div className="-my-10">
      <div className="relative left-1/2 right-1/2 h-[calc(100vh-72px)] w-screen -ml-[50vw] -mr-[50vw] overflow-hidden">
        <GlobeView lang={lang} pins={pins} />
      </div>
    </div>
  );
}
