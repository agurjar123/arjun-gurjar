"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLng } from "@/lib/distance";

const ACCENT = "#c06b4a";
const MI_TO_M = 1609.34;

export type Spot = { id?: string; lat: number; lng: number; name: string };

function numIcon(n: number) {
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${ACCENT};color:#fff;font-family:Georgia,serif;font-weight:600;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const pendingIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#fff;border:3px solid ${ACCENT};box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitToCircle({ center, radiusM }: { center: LatLng; radiusM: number }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLng(center.lat, center.lng).toBounds(radiusM * 2);
    map.fitBounds(bounds, { padding: [10, 10] });
  }, [map, center, radiusM]);
  return null;
}

function ClickHandler({
  center,
  radiusM,
  onPick,
}: {
  center: LatLng;
  radiusM: number;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const d = map_distance(center, { lat: e.latlng.lat, lng: e.latlng.lng });
      if (d <= radiusM) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Leaflet's own distance (metres) via a throwaway helper.
function map_distance(a: LatLng, b: LatLng): number {
  return L.latLng(a.lat, a.lng).distanceTo(L.latLng(b.lat, b.lng));
}

export default function SpotsMap({
  center,
  radiusMi,
  spots,
  pending,
  onPick,
  onRemove,
}: {
  center: LatLng;
  radiusMi: number;
  spots: Spot[];
  pending: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
  onRemove: (s: Spot) => void;
}) {
  const radiusM = radiusMi * MI_TO_M;

  return (
    <div className="bs-map h-[380px] w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <FitToCircle center={center} radiusM={radiusM} />
        <ClickHandler center={center} radiusM={radiusM} onPick={onPick} />

        <Circle
          center={[center.lat, center.lng]}
          radius={radiusM}
          pathOptions={{
            color: ACCENT,
            weight: 1.5,
            opacity: 0.5,
            fillColor: ACCENT,
            fillOpacity: 0.06,
            dashArray: "4 8",
          }}
        />

        {spots.map((s, i) => (
          <Marker key={s.id ?? `${s.lat}-${s.lng}`} position={[s.lat, s.lng]} icon={numIcon(i + 1)}>
            <Tooltip direction="top" offset={[0, -14]}>
              <span className="flex items-center gap-1">
                {s.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(s);
                  }}
                  className="text-red-500 underline"
                >
                  remove
                </button>
              </span>
            </Tooltip>
          </Marker>
        ))}

        {pending && <Marker position={[pending.lat, pending.lng]} icon={pendingIcon} />}
      </MapContainer>
    </div>
  );
}
