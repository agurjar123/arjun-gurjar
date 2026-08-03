"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Marker,
  Tooltip,
  ZoomControl,
  useMapEvents,
} from "react-leaflet";
import {
  writeMyLocation,
  subscribeLocations,
  type LiveLocations,
  type Person,
} from "@/lib/firebase";
import {
  checkpoints,
  ARJUN_FALLBACK,
  SEHER_FALLBACK,
  ARJUN_PHOTO,
  SEHER_PHOTO,
} from "@/data/backstage/days";
import { haversineKm, kmToMiles, formatDistance, type LatLng } from "@/lib/distance";

const ZOOM_THRESHOLD = 6; // above this, big dashed lines hide; precise pins remain
const ACCENT = "#c06b4a";

function babyIcon(src: string, initial: string) {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:46px;height:46px;border-radius:9999px;overflow:hidden;border:3px solid ${ACCENT};box-shadow:0 2px 10px rgba(0,0,0,.35);background:${ACCENT};display:flex;align-items:center;justify-content:center;color:#fff;font-family:Georgia,serif;font-weight:600;font-size:18px">
      <span>${initial}</span>
      <img src="${src}" style="position:absolute;width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'" alt="" />
    </div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);
  return null;
}

export default function DistanceMap() {
  const [zoom, setZoom] = useState(2);
  const [live, setLive] = useState<LiveLocations>({});
  const [me, setMe] = useState<Person>("seher");

  // Identity: from the password login (backstage_me); everyone else is Seher.
  useEffect(() => {
    let identity: Person = "seher";
    try {
      const param = new URLSearchParams(window.location.search).get("me");
      if (param === "arjun" || param === "seher") {
        localStorage.setItem("backstage_me", param);
      }
      const stored = localStorage.getItem("backstage_me");
      if (stored === "arjun" || stored === "seher") identity = stored;
    } catch {
      /* ignore */
    }
    setMe(identity);

    const unsub = subscribeLocations(setLive);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => writeMyLocation(identity, pos.coords.latitude, pos.coords.longitude),
        () => {
          /* permission denied — the button below can re-prompt */
        },
        { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 }
      );
    }
    return unsub;
  }, []);

  // Re-prompt for location and overwrite my pin (fixes a stale/wrong location).
  function shareLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => writeMyLocation(me, pos.coords.latitude, pos.coords.longitude),
      () => {},
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
    );
  }

  const her: LatLng = live.seher ?? SEHER_FALLBACK;
  const him: LatLng = live.arjun ?? ARJUN_FALLBACK;

  const miles = useMemo(
    () => formatDistance(kmToMiles(haversineKm(her, him))),
    [her, him]
  );

  const showJourney = zoom < ZOOM_THRESHOLD;
  const route = checkpoints.map((c) => [c.lat, c.lng]) as [number, number][];
  const between: [number, number][] = [
    [her.lat, her.lng],
    [him.lat, him.lng],
  ];

  return (
    <div className="bs-map relative h-[440px] w-full overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
      <MapContainer
        center={[41, -30]}
        zoom={3}
        minZoom={2}
        scrollWheelZoom
        doubleClickZoom
        worldCopyJump
        preferCanvas
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ZoomControl position="bottomright" />
        <ZoomWatcher onZoom={setZoom} />

        {/* Journey + big dashed lines — hidden once zoomed in */}
        {showJourney && (
          <>
            <Polyline
              positions={route}
              pathOptions={{ color: ACCENT, weight: 2, opacity: 0.6, dashArray: "4 10" }}
            />
            <Polyline
              positions={between}
              pathOptions={{ color: ACCENT, weight: 1.5, opacity: 0.4, dashArray: "2 8" }}
            />
            {checkpoints.map((c) => (
              <CircleMarker
                key={c.name}
                center={[c.lat, c.lng]}
                radius={4}
                pathOptions={{ color: ACCENT, fillColor: ACCENT, fillOpacity: 1, weight: 1 }}
              >
                <Tooltip direction="top" offset={[0, -4]}>
                  {c.name}
                </Tooltip>
              </CircleMarker>
            ))}
          </>
        )}

        {/* Precise live pins — always present, the focus when zoomed in */}
        <Marker position={[her.lat, her.lng]} icon={babyIcon(SEHER_PHOTO, "S")}>
          <Tooltip direction="top" offset={[0, -20]}>
            Seher
          </Tooltip>
        </Marker>
        <Marker position={[him.lat, him.lng]} icon={babyIcon(ARJUN_PHOTO, "A")}>
          <Tooltip direction="top" offset={[0, -20]}>
            Arjun
          </Tooltip>
        </Marker>
      </MapContainer>

      {/* Share / correct my location */}
      <button
        onClick={shareLocation}
        className="absolute left-3 top-3 z-[1000] inline-flex items-center gap-1 rounded-full border border-border bg-surface/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted shadow-[var(--shadow-card)] backdrop-blur-sm transition-colors hover:text-accent"
      >
        <MapPin size={11} /> share my location
      </button>

      {/* Distance readout */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-2xl border border-border bg-surface/90 px-4 py-2 shadow-[var(--shadow-card)] backdrop-blur-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          apart right now
        </p>
        <p className="font-serif text-lg font-semibold text-foreground">{miles} mi</p>
      </div>
    </div>
  );
}
