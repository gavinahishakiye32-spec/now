import React, { useState, useEffect } from "react";
import api from "../api.js";
import { Truck, ClipboardList, Wrench, CheckCircle, FileText } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vehiclesRes, tripsRes, maintenanceRes, fleetRes] = await Promise.all([
          api.get("/vehicles"),
          api.get("/trips/report/daily"),
          api.get("/maintenance"),
          api.get("/reports/fleet-status"),
        ]);
        const vehicles = vehiclesRes.data;
        const trips = tripsRes.data;
        const maintenance = maintenanceRes.data;
        const fleet = fleetRes.data;
        const today = new Date().toISOString().split("T")[0];
        const todayTrips = trips.filter((t) => {
          const d = new Date(t.tripDate).toISOString().split("T")[0];
          return d === today;
        });
        const activeVehicles = fleet.filter((v) => v.availability === "Available").length;
        const underMaintenance = fleet.filter((v) => v.maintenanceStatus === "Under Maintenance").length;
        setStats({ totalVehicles: vehicles.length, totalTripsToday: todayTrips.length, totalMaintenance: maintenance.length, activeVehicles, underMaintenance });
      } catch { setError("Failed to load dashboard data"); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-indigo-600 text-lg font-medium animate-pulse">Loading dashboard...</div></div>;

  const cards = [
    { label: "Total Vehicles", value: stats?.totalVehicles ?? 0, icon: Truck, color: "bg-indigo-50 text-indigo-700" },
    { label: "Trips Today", value: stats?.totalTripsToday ?? 0, icon: ClipboardList, color: "bg-emerald-50 text-emerald-700" },
    { label: "Active Vehicles", value: stats?.activeVehicles ?? 0, icon: CheckCircle, color: "bg-green-50 text-green-700" },
    { label: "Under Maintenance", value: stats?.underMaintenance ?? 0, icon: Wrench, color: "bg-amber-50 text-amber-700" },
    { label: "Maintenance Records", value: stats?.totalMaintenance ?? 0, icon: FileText, color: "bg-violet-50 text-violet-700" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`rounded-xl shadow-sm border p-5 ${card.color}`}>
              <Icon className="w-6 h-6 mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm font-medium opacity-80">{card.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
