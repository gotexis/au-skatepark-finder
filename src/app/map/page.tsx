import parks from "@/data/skateparks.json";
import MapView from "@/components/MapView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map — All Skateparks in Australia",
  description: "Interactive map of all 1,200+ skateparks across Australia.",
};

export default function MapPage() {
  const markers = parks.map((p) => ({
    lat: p.lat,
    lng: p.lon,
    label: p.name || `Skatepark ${p.id}`,
    href: `/park/${p.slug}`,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Australia Skatepark Map</h1>
      <p className="text-base-content/60 mb-6">
        {parks.length.toLocaleString()} skateparks shown. Click a marker for details.
      </p>
      <div className="rounded-xl overflow-hidden shadow-lg">
        <MapView markers={markers} zoom={4} height="700px" />
      </div>
    </div>
  );
}
