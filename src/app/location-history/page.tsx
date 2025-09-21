'use client'
import Button from "@/ui_component/button";
import { useState , useEffect } from "react"

interface LocationEntry {
  id: string;
  latitude_longitude: [number, number];
  created_at: string;
  user_id: string;
}

export default function LocationHistoryPage() {
  const [locations, setLocations] = useState<LocationEntry[]>([]);
  const [error, setError] = useState<string | null>(null);  
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        async function fetchLocations() {
            try {
                setLoading(true);
                const res = await fetch('/api/location', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    setLocations(data.data || []);
                } else {
                    setError('Failed to fetch locations');
                }       
            } catch (error) {
                console.error('Error fetching locations:', error);
                setError('An error occurred while fetching locations');
            }
            finally {
                setLoading(false);
            }
        }
        fetchLocations();
    }, []);

  if (loading) {
    return <div className="
text-blue-500  
    ">Loading...</div>;
  }
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

  return (  
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Location History</h1>
      <Button label="back" 
        onClick={() => window.history.back()}
      />
      {locations.length === 0 ? (
        <p>No location data available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">      
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Timestamp</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Latitude</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Longitude</th>
                </tr>
            </thead>
            <tbody>
                {locations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b border-gray-300">{new Date(loc.created_at).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b border-gray-300">{loc.latitude_longitude[0]}</td>
                        <td className="py-2 px-4 border-b border-gray-300">{loc.latitude_longitude[1]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        )}
    </div>
  );
}

