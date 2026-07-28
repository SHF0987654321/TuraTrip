"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [4.711, -74.0721];
const DEFAULT_ZOOM = 13;

interface MapPickerProps {
  latitud?: number | null;
  longitud?: number | null;
  direccion?: string | null;
  onSelect: (ubicacion: {
    latitud: number;
    longitud: number;
    direccion?: string | null;
  }) => void;
}

export default function MapPicker({
  latitud,
  longitud,
  direccion,
  onSelect,
}: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [query, setQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const position: [number, number] | null =
    latitud != null && longitud != null
      ? ([latitud, longitud] as [number, number])
      : null;

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: position || DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setMarker(map, lat, lng, direccion || query || null);
      onSelect({
        latitud: lat,
        longitud: lng,
        direccion: direccion || query || null,
      });
    });

    mapRef.current = map;

    return () => {
      if (markerRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (position) {
      map.flyTo(position, 16, { duration: 1.2 });
      setMarker(map, position[0], position[1], direccion || null);
    }
  }, [latitud, longitud, direccion, query]);

  const setMarker = (
    map: L.Map,
    lat: number,
    lng: number,
    label: string | null | undefined
  ) => {
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }
    const marker = L.marker([lat, lng]);
    if (label) {
      marker.bindPopup(label);
    }
    marker.addTo(map);
    markerRef.current = marker;
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query || query.length < 3) {
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "json");
        url.searchParams.set("q", query.trim());
        url.searchParams.set("countrycodes", "co");
        url.searchParams.set("limit", "1");

        const res = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;

        const data = (await res.json()) as Array<{
          lat: string;
          lon: string;
          display_name: string;
        }>;

        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const map = mapRef.current;
          if (map) {
            setMarker(map, lat, lon, data[0].display_name || query);
            map.flyTo([lat, lon], 16, { duration: 1.2 });
          }
          onSelect({
            latitud: lat,
            longitud: lon,
            direccion: data[0].display_name || direccion || query,
          });
        }
      } catch {
        // noop
      } finally {
        timerRef.current = null;
      }
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, direccion, onSelect]);

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[hsl(174_72%_40%)]"
        placeholder="Buscar dirección o lugar..."
      />

      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800"
        style={{ height: 256, width: "100%" }}
      />

      {position && direccion && (
        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
          📍 {direccion}
        </p>
      )}
    </div>
  );
}
