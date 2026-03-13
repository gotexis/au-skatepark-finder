import parks from "@/data/skateparks.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import MapView from "@/components/MapView";
import type { Metadata } from "next";

const stateMap: Record<string, { code: string; name: string; center: [number, number]; zoom: number }> = {
  nsw: { code: "NSW", name: "New South Wales", center: [-33.0, 149.0], zoom: 6 },
  vic: { code: "VIC", name: "Victoria", center: [-37.0, 145.0], zoom: 7 },
  qld: { code: "QLD", name: "Queensland", center: [-23.0, 149.0], zoom: 5 },
  wa: { code: "WA", name: "Western Australia", center: [-31.0, 121.0], zoom: 5 },
  sa: { code: "SA", name: "South Australia", center: [-32.0, 136.0], zoom: 6 },
  tas: { code: "TAS", name: "Tasmania", center: [-42.0, 146.5], zoom: 7 },
  act: { code: "ACT", name: "Australian Capital Territory", center: [-35.3, 149.1], zoom: 11 },
  nt: { code: "NT", name: "Northern Territory", center: [-19.0, 134.0], zoom: 6 },
};

export function generateStaticParams() {
  return Object.keys(stateMap).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const state = stateMap[slug];
  if (!state) return {};
  return {
    title: `Skateparks in ${state.name}`,
    description: `Find all skateparks in ${state.name}, Australia. Browse parks with maps, features and details.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { slug } = await params;
  const state = stateMap[slug];
  if (!state) notFound();

  const stateParks = parks.filter((p) => p.state === state.code);
  const markers = stateParks.map((p) => ({
    lat: p.lat,
    lng: p.lon,
    label: p.name || `Skatepark ${p.id}`,
    href: `/park/${p.slug}`,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/states">States</Link></li>
          <li>{state.name}</li>
        </ul>
      </div>

      <h1 className="text-4xl font-bold mb-2">
        Skateparks in {state.name}
      </h1>
      <p className="text-base-content/60 mb-6">
        {stateParks.length} skateparks found in {state.code}
      </p>

      <div className="rounded-xl overflow-hidden shadow-lg mb-8">
        <MapView markers={markers} center={state.center} zoom={state.zoom} height="400px" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stateParks.map((p) => (
          <Link
            key={p.slug}
            href={`/park/${p.slug}`}
            className="card bg-base-200 hover:bg-base-300 transition shadow"
          >
            <div className="card-body p-4">
              <h3 className="card-title text-base">
                {p.name || `Skatepark ${p.id}`}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {p.surface && <span className="badge badge-sm badge-outline">{p.surface}</span>}
                {p.lit === "yes" && <span className="badge badge-sm badge-warning">💡 Lit</span>}
                {p.wheelchair === "yes" && <span className="badge badge-sm badge-info">♿ Accessible</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
