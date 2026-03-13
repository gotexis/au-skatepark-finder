import parks from "@/data/skateparks.json";
import Link from "next/link";
import MapView from "@/components/MapView";

const states = [
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "WA", name: "Western Australia" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NT", name: "Northern Territory" },
];

export default function Home() {
  const stateCounts = states.map((s) => ({
    ...s,
    count: parks.filter((p) => p.state === s.code).length,
  }));

  const featured = parks.filter((p) => p.name).slice(0, 12);

  const markers = parks.map((p) => ({
    lat: p.lat,
    lng: p.lon,
    label: p.name || `Skatepark ${p.id}`,
    href: `/park/${p.slug}`,
  }));

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral to-base-300 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4">
            🛹 Every Skatepark in Australia
          </h1>
          <p className="text-xl text-base-content/70 mb-6 max-w-2xl mx-auto">
            {parks.length.toLocaleString()} skateparks and skate spots across all states and territories.
            Find your next session.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/states" className="btn btn-primary btn-lg">
              Browse by State
            </Link>
            <Link href="/map" className="btn btn-outline btn-lg">
              View Map
            </Link>
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Browse by State</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stateCounts.map((s) => (
            <Link
              key={s.code}
              href={`/state/${s.code.toLowerCase()}`}
              className="card bg-base-200 hover:bg-base-300 transition shadow-md"
            >
              <div className="card-body items-center text-center p-4">
                <h3 className="card-title text-lg">{s.code}</h3>
                <p className="text-sm text-base-content/60">{s.name}</p>
                <div className="badge badge-primary badge-lg mt-1">
                  {s.count} parks
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Map Preview */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4">All Skateparks</h2>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <MapView markers={markers} zoom={4} height="500px" />
        </div>
      </section>

      {/* Featured Parks */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Featured Skateparks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/park/${p.slug}`}
              className="card bg-base-200 hover:bg-base-300 transition shadow"
            >
              <div className="card-body p-4">
                <h3 className="card-title text-base">{p.name}</h3>
                <p className="text-sm text-base-content/60">{p.state_name}</p>
                <div className="flex gap-2 flex-wrap mt-1">
                  {p.surface && (
                    <span className="badge badge-sm badge-outline">{p.surface}</span>
                  )}
                  {p.lit === "yes" && (
                    <span className="badge badge-sm badge-warning">💡 Lit</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
