"use client";
import React, { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

type Marker = { lat: number; lng: number; title?: string };

export const Map: React.FC<{ markers: Marker[] }> = ({ markers }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
    if (!key) {
      console.warn('Google Maps API key ausente: defina NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no .env');
      return;
    }

    setOptions({ key, v: 'weekly' });

    let map: google.maps.Map;
    importLibrary('maps')
      .then(() => {
        map = new google.maps.Map(ref.current as HTMLDivElement, {
          center: markers[0] || { lat: -23.5505, lng: -46.6333 },
          zoom: 12,
        });
        markers.forEach((m) => new google.maps.Marker({ position: m, map, title: m.title }));
      })
      .catch((err) => console.error('Falha ao carregar Google Maps:', err));

    return () => {};
  }, [markers]);

  return <div ref={ref} className="w-full h-64 rounded-xl overflow-hidden border" />;
};