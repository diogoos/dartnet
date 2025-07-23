"use client"

import {useContext, useEffect, useState} from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

import { geocode } from "@/lib/geocode";
import { cache as geocache } from "@/lib/geocode";
import {ClubContext} from "@/components/app-body";

type Location = {
  name: string;
  lat: number;
  lon: number;
  displayName: string;
}

export default function MembersMap(){
  const club = useContext(ClubContext);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    "use client"

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const fetchAndGeocode = async () => {
      if (club == null) return

      const res = await fetch(`/api/clubs/${club.id}/stats/locations`);
      const locations: string[] = await res.json();

      for (const str of locations) {
        // add a delay only when not using memoized geocoding, to avoid 429s
        if (!geocache.has(str)) await delay(200);

        try {
          const result = await geocode(str);
          if (result) {
            setLocations(prev => [...prev, result]);
          }
        } catch (err) {
          console.error(`Error geocoding "${str}":`, err);
        }
      }
    }

     fetchAndGeocode()
  }, [club]);

  return (
    <div className="w-full h-[500px]">
      <MapContainer
        className="w-full h-full rounded-md"
        style={{zIndex: 1}}
        center={[20 , 0]} zoom={2} scrollWheelZoom={false} maxZoom={10}>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {
          locations.map((loc, idx) => (
            <Marker key={idx} position={[loc.lat, loc.lon]}>
              <Popup>
                <strong>{loc.name}</strong><br />
                {loc.displayName}
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    </div>
  )
}
