import React, { useState } from "react";
import api from "../api.js";
import { FileText, Printer, Calendar, RefreshCw } from "lucide-react";

const today = () => new Date().toISOString().split("T")[0];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("daily-trips");
  const [date, setDate] = useState(today());
  const [tripReport, setTripReport] = useState(null);
  const [fleetReport, setFleetReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTripReport = async () => {
    setLoading(true); setError("");
    try { const res = await api.get(`/reports/daily-trips?date=${date}`); setTripReport(res.data); }
    catch { setError("Failed to load trip report"); } finally { setLoading(false); }
  };

  const fetchFleetReport = async () => {
    setLoading(true); setError("");
    try { const res = await api.get(`/reports/fleet-status?date=${date}`); setFleetReport(res.data); }
    catch { setError("Failed to load fleet status report"); } finally { setLoading(false); }
  };

  const handleGenerate = () => { activeTab === "daily-trips" ? fetchTripReport() : fetchFleetReport(); };
  const handlePrint = () => { window.print(); };
  const switchTab = (tab) => { setActiveTab(tab); setTripReport(null); setFleetReport(null); setError(""); };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-600" /> Reports</h2>

      <div className="flex gap-2 mb-6">
        <button onClick={() => switchTab("daily-trips")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "daily-trips" ? "bg-indigo-600 text-white shadow" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"}`}>Daily Trip Report</button>
        <button onClick={() => switchTab("fleet-status")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "fleet-status" ? "bg-indigo-600 text-white shadow" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"}`}>Daily Fleet Status</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1"><Calendar className="w-4 h-4 inline mr-1" /> Select Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" />
        </div>
        <button onClick={handleGenerate} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-60 flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> {loading ? "Generating..." : "Generate Report"}
        </button>
        <button onClick={handlePrint} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      {activeTab === "daily-trips" && tripReport && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Daily Trip Report</h3>
                <p className="text-sm text-gray-500 mt-0.5">{new Date(tripReport.date).toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} &nbsp;·&nbsp; {tripReport.trips.length} trip(s)</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-indigo-50 px-4 py-2 rounded-lg text-center min-w-[100px]">
                  <div className="font-bold text-indigo-700 text-lg">{tripReport.totalFuel.toFixed(1)} L</div>
                  <div className="text-indigo-500 text-xs">Total Fuel</div>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-lg text-center min-w-[120px]">
                  <div className="font-bold text-emerald-700 text-lg">{Number(tripReport.totalCost).toLocaleString()}</div>
                  <div className="text-emerald-500 text-xs">Total Cost</div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr><th className="px-4 py-3 text-left font-semibold"></th><th className="px-4 py-3 text-left font-semibold">Vehicle</th><th className="px-4 py-3 text-left font-semibold">Driver</th><th className="px-4 py-3 text-left font-semibold">Destination</th><th className="px-4 py-3 text-left font-semibold">Fuel (L)</th><th className="px-4 py-3 text-left font-semibold">Cost (RWF)</th></tr>
              </thead>
              <tbody>
                {tripReport.trips.length === 0 ? (<tr><td colSpan="6" className="text-center py-10 text-gray-400">No trips recorded on this date.</td></tr>) : (
                  tripReport.trips.map((t, i) => (
                    <tr key={t._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{t.vehicle?.vehicleName}<div className="text-xs text-gray-500 font-mono">{t.vehicle?.plateNumber}</div></td>
                      <td className="px-4 py-3 text-gray-600">{t.driver}</td>
                      <td className="px-4 py-3 text-gray-600">{t.destination}</td>
                      <td className="px-4 py-3 text-gray-600">{t.fuelConsumed}</td>
                      <td className="px-4 py-3 font-medium text-emerald-700">{Number(t.tripCost).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "fleet-status" && fleetReport && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Daily Fleet Status Report</h3>
            <p className="text-sm text-gray-500 mt-0.5">{new Date(date).toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} &nbsp;·&nbsp; {fleetReport.length} vehicle(s)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr><th className="px-4 py-3 text-left font-semibold"></th><th className="px-4 py-3 text-left font-semibold">Vehicle Name</th><th className="px-4 py-3 text-left font-semibold">Plate</th><th className="px-4 py-3 text-left font-semibold">Fuel (L)</th><th className="px-4 py-3 text-left font-semibold">Maintenance Status</th><th className="px-4 py-3 text-left font-semibold">Availability</th></tr>
              </thead>
              <tbody>
                {fleetReport.length === 0 ? (<tr><td colSpan="6" className="text-center py-10 text-gray-400">No vehicles found.</td></tr>) : (
                  fleetReport.map((v, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{v.vehicleName}</td>
                      <td className="px-4 py-3"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">{v.plateNumber}</span></td>
                      <td className="px-4 py-3 text-gray-600">{v.fuelConsumed.toFixed(1)}</td>
                      <td className="px-4 py-3"><span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">{v.maintenanceStatus}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${v.availability === "Available" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{v.availability}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
