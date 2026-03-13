import parks from "@/data/skateparks.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import MapView from "@/components/MapView";
import type { Metadata } from "next";

export function generateStaticParams() {
  return parks.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const park = parks.find((p) => p.slug === slug);
  if (!park) return {};
  const name = park.name || `Skatepark ${park.id}`;
  return {
    title: `${name} — ${park.state_name}`,
    description: `${name} skatepark in ${park.state_name}, Australia. Location, features, surface type and directions.`,
  };
}

export default async function ParkPage({ params }: Props) {
  const { slug } = await params;
  const park = parks.find((p) => p.slug === slug);
  if (!park) notFound();

  const name = park.name || `Skatepark ${park.id}`;
  const nearby = parks
    .filter((p) => p.slug !== park.slug && p.state === park.state)
    .map((p) => ({
      ...p,
      dist: Math.sqrt(
        Math.pow(p.lat - park.lat, 2) + Math.pow(p.lon - park.lon, 2)
      ),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 6);

  const markers = [
    { lat: park.lat, lng: park.lon, label: name },
    ...nearby.map((n) => ({
      lat: n.lat,
      lng: n.lon,
      label: n.name || `Skatepark ${n.id}`,
      href: `/park/${n.slug}`,
    })),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href={`/state/${park.state.toLowerCase()}`}>{park.state_name}</Link></li>
          <li>{name}</li>
        </ul>
      </div>

      <h1 className="text-4xl font-bold mb-2">{name}</h1>
      <p className="text-base-content/60 mb-6">{park.state_name}, Australia</p>

      {/* Map */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-8">
        <MapView markers={markers} center={[park.lat, park.lon]} zoom={14} height="400px" />
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Details</h2>
            <table className="table table-sm">
              <tbody>
                <tr><td className="font-medium">Coordinates</td><td>{park.lat.toFixed(5)}, {park.lon.toFixed(5)}</td></tr>
                {park.surface && <tr><td className="font-medium">Surface</td><td className="capitalize">{park.surface}</td></tr>}
                {park.lit && <tr><td className="font-medium">Lighting</td><td>{park.lit === "yes" ? "✅ Yes" : "❌ No"}</td></tr>}
                {park.opening_hours && <tr><td className="font-medium">Hours</td><td>{park.opening_hours}</td></tr>}
                {park.operator && <tr><td className="font-medium">Operator</td><td>{park.operator}</td></tr>}
                {park.wheelchair && <tr><td className="font-medium">Wheelchair</td><td>{park.wheelchair === "yes" ? "✅ Accessible" : park.wheelchair}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Get Directions</h2>
            <p className="text-base-content/60 mb-3">Open in your preferred maps app:</p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${park.lat},${park.lon}`}
                target="_blank"
                className="btn btn-primary btn-sm"
              >
                📍 Google Maps
              </a>
              <a
                href={`https://maps.apple.com/?daddr=${park.lat},${park.lon}`}
                target="_blank"
                className="btn btn-outline btn-sm"
              >
                🍎 Apple Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {park.description && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">About</h2>
          <p className="text-base-content/80">{park.description}</p>
        </div>
      )}

      {/* Nearby */}
      {nearby.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Nearby Skateparks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearby.map((n) => (
              <Link
                key={n.slug}
                href={`/park/${n.slug}`}
                className="card bg-base-200 hover:bg-base-300 transition shadow"
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-base">
                    {n.name || `Skatepark ${n.id}`}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {n.surface && <span className="badge badge-sm badge-outline">{n.surface}</span>}
                    {n.lit === "yes" && <span className="badge badge-sm badge-warning">💡 Lit</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
