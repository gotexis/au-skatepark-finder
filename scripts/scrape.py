#!/usr/bin/env python3
"""Fetch all skateparks in Australia from OpenStreetMap Overpass API."""
import urllib.request, urllib.parse, json, re, os

QUERY = """
[out:json][timeout:120];
(
  node["sport"="skateboard"](-44.0,112.0,-10.0,154.0);
  way["sport"="skateboard"](-44.0,112.0,-10.0,154.0);
  node["leisure"="skatepark"](-44.0,112.0,-10.0,154.0);
  way["leisure"="skatepark"](-44.0,112.0,-10.0,154.0);
);
out center;
"""

def get_state(lat, lon):
    if -35.95 < lat < -35.1 and 148.7 < lon < 149.45: return "ACT"
    if lat < -39.5 and lon > 143.5: return "TAS"
    if -39.5 < lat < -33.98 and 140.9 < lon < 150.1: return "VIC"
    if -37.6 < lat < -28.1 and 140.9 < lon < 154.0: return "NSW"
    if -33.98 < lat < -28.1 and 150.1 < lon < 154.0: return "NSW"
    if lat > -29.2 and lon > 137.5: return "QLD"
    if -38.1 < lat < -25.9 and 129.0 < lon < 141.0: return "SA"
    if lon < 129.0: return "WA"
    if lat > -26.0 and lon < 138.0: return "NT"
    if lat > -29.2 and lon > 140: return "QLD"
    if -38.1 < lat < -28.1 and lon > 140: return "NSW"
    return "OTHER"

STATE_NAMES = {
    "NSW": "New South Wales", "VIC": "Victoria", "QLD": "Queensland",
    "SA": "South Australia", "WA": "Western Australia", "TAS": "Tasmania",
    "NT": "Northern Territory", "ACT": "Australian Capital Territory"
}

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-') or None

def main():
    url = "https://overpass-api.de/api/interpreter"
    data = urllib.parse.urlencode({"data": QUERY}).encode()
    req = urllib.request.Request(url, data)
    resp = urllib.request.urlopen(req, timeout=120)
    raw = json.loads(resp.read())

    parks, seen, slug_counts = [], set(), {}
    for el in raw["elements"]:
        lat = el.get("lat") or el.get("center", {}).get("lat")
        lon = el.get("lon") or el.get("center", {}).get("lon")
        if not lat or not lon: continue
        key = f"{round(lat,4)},{round(lon,4)}"
        if key in seen: continue
        seen.add(key)
        tags = el.get("tags", {})
        name = tags.get("name", "")
        base = slugify(name) if name else f"skatepark-{el['id']}"
        if base in slug_counts:
            slug_counts[base] += 1
            base = f"{base}-{slug_counts[base]}"
        else:
            slug_counts[base] = 1
        state = get_state(lat, lon)
        parks.append({
            "id": el["id"], "lat": lat, "lon": lon, "name": name, "slug": base,
            "state": state, "state_name": STATE_NAMES.get(state, state),
            "surface": tags.get("surface", ""), "lit": tags.get("lit", ""),
            "opening_hours": tags.get("opening_hours", ""),
            "operator": tags.get("operator", ""),
            "wheelchair": tags.get("wheelchair", ""),
            "description": tags.get("description", ""),
        })

    out = os.path.join(os.path.dirname(__file__), "..", "src", "data", "skateparks.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as f:
        json.dump(parks, f, indent=2)
    print(f"Wrote {len(parks)} skateparks to {out}")

if __name__ == "__main__":
    main()
