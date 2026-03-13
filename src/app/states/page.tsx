import parks from "@/data/skateparks.json";
import Link from "next/link";

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

export default function StatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Skateparks by State</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {states.map((s) => {
          const count = parks.filter((p) => p.state === s.code).length;
          return (
            <Link
              key={s.code}
              href={`/state/${s.code.toLowerCase()}`}
              className="card bg-base-200 hover:bg-base-300 transition shadow-lg"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl">{s.name}</h2>
                <p className="text-base-content/60">{s.code}</p>
                <div className="badge badge-primary badge-lg">{count} skateparks</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
