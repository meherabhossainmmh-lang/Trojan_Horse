"use client";

import { useState, useEffect } from "react";

export interface LatLng {
  lat: number;
  lng: number;
}

export function calculateHaversineDistance(
  coord1: LatLng,
  coord2: LatLng
): number {
  const R = 6371000; // Radius of earth in meters
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

export function useGeolocationProximity(
  hotspots: { id: number; lat: number; lng: number; title: string; category?: string }[],
  thresholdMeters: number = 100
) {
  const [userLocation, setUserLocation] = useState<LatLng>({
    lat: 23.7805,
    lng: 90.38,
  });
  const [nearbyHotspot, setNearbyHotspot] = useState<{
    id: number;
    title: string;
    category?: string;
    distance: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(current);

        let closest: any = null;
        let minDist = thresholdMeters;

        for (const spot of hotspots) {
          const dist = calculateHaversineDistance(current, {
            lat: spot.lat,
            lng: spot.lng,
          });
          if (dist <= thresholdMeters && dist < minDist) {
            minDist = dist;
            closest = {
              id: spot.id,
              title: spot.title,
              category: spot.category,
              distance: Math.round(dist),
            };
          }
        }

        setNearbyHotspot(closest);
      },
      (err) => {
        // Ignore location error or use default Dhaka coordinates
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [hotspots, thresholdMeters]);

  return { userLocation, nearbyHotspot, setUserLocation };
}
