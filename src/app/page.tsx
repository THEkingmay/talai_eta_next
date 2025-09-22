'use client';

import 'leaflet/dist/leaflet.css';
import Button from "@/ui_component/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMap } from 'react-leaflet';

// Dynamic imports for React-Leaflet (ต้องปิด SSR)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then(mod => mod.Tooltip), { ssr: false });
interface User {
  id: string;
  email: string;
  role: string;
}

function CenterButton({ location }: { location: [number, number] }) {
  const map = useMap();
  const centerMap = () => map.flyTo(location, 14);

  return (
    <Button
      label="Center Map"
      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded z-1000"
      onClick={centerMap}
    />
  );
}
// Component: RealtimeLocation
function RealtimeLocation() {
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // โหลด icon จาก leaflet (client only)
  useEffect(() => {
    import("leaflet").then(L => {
      setCustomIcon(
        new L.Icon({
          iconUrl: "/icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -41],
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
        })
      );
    });
  }, []);

  // ใช้ geolocation
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const getLocationEvery5sec = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = [latitude, longitude] as [number, number];
        setLocation(newLocation);

        try {
          await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });
        } catch (err) {
          console.error("Failed to send location to API:", err);
        }
      });
    };

    const intervalId = setInterval(getLocationEvery5sec, 5000);
    getLocationEvery5sec(); // เรียกครั้งแรกทันที
    return () => clearInterval(intervalId);
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!location) return <p>Loading location...</p>;

  return (
    <MapContainer style={{ height: "85vh", width: "100%" }} center={location} zoom={14} scrollWheelZoom={true}>
      <CenterButton location={location} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {customIcon && (
        <Marker 
         position={location} icon={customIcon}        
        >
        <Tooltip 
        className='bg-white text-black font-bold border-2 border-blue-500 rounded'
        direction="top" offset={[0, -15]} opacity={1} permanent>
         คุณอยู่ที่นี่
        </Tooltip>
        </Marker>
      )}
      
    </MapContainer>
  );
}

// Main Page
export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch("/api/user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/logout", { method: "GET" });
      if (res.ok) {
        setUser(null);
        router.push("/auth/loginAndRegister");
      }
    } catch (error) {
      setError("Failed to logout");
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-500 mt-4 text-lg">Loading TALAI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between p-4 border-b border-gray-300" style={{ height: "15vh" }}>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">TALAI ETA</h1>
          <p className="text-lg text-gray-700">
            Logged in as: <span className="font-mono">{user?.email}</span>
          </p>
        </div>
        <div className="flex items-center">
          <Button
            label="location history"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-4"
            onClick={() => router.push("/location-history")}
          />
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            label="Logout"
          />
        </div>
      </div>
      <div className="flex justify-center border-t border-gray-300">
        <RealtimeLocation />
      </div>
    </div>
  );
}
