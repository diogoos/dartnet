"use client"

import { useEffect, useState} from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

import { geocode } from "@/lib/geocode";
import { cache as geocache } from "@/lib/geocode";

type Location = {
  name: string;
  lat: number;
  lon: number;
  displayName: string;
}

export default function MembersMap(){
  const clubId = 1;
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    "use client"

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const fetchAndGeocode = async () => {
      const res = await fetch(`/api/clubs/${clubId}/stats/locations`);
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
  }, []);

  return (
    <div style={{height: '500px', width: '800px'}}>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
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
