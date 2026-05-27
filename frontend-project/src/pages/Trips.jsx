import React, { useState, useEffect } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ClipboardList, Plus, Save, X, Edit3, Trash2 } from "lucide-react";

const today = () => new Date().toISOString().split("T")[0];
const initialForm = { vehicle: "", driver: "", tripDate: today(), destination: "", fuelConsumed: "", tripCost: "" };

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fetchData = async () => { try { const [t, v] = await Promise.all([api.get("/trips"), api.get("/vehicles")]); setTrips(t.data); setVehicles(v.data); } catch { setError("Failed to load data"); } };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (editId) { await api.put(`/trips/${editId}`, form); setSuccess("Trip updated!"); setEditId(null); }
      else { await api.post("/trips", form); setSuccess("Trip recorded!"); }
      setForm(initialForm); fetchData();
    } catch (err) { setError(err.response?.data?.message || "Operation failed"); }
    finally { setLoading(false); }
  };

  const handleEdit = (t) => {
    if (!isAdmin) return;
    setEditId(t._id); setForm({ vehicle: t.vehicle._id, driver: t.driver, tripDate: new Date(t.tripDate).toISOString().split("T")[0], destination: t.destination, fuelConsumed: t.fuelConsumed, tripCost: t.tripCost });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this trip?")) return;
    try { await api.delete(`/trips/${id}`); setSuccess("Trip deleted."); fetchData(); }
    catch { setError("Failed to delete trip"); }
  };

  const handleCancel = () => { setEditId(null); setForm(initialForm); setError(""); };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><ClipboardList className="w-6 h-6 text-indigo-600" /> Trip Management</h2>

      {isAdmin && (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{editId ? "Edit Trip" : "Record New Trip"}</h3>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-3 text-sm">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded mb-3 text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Vehicle</label>
            <select required value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white">
              <option value="">-- Select Vehicle --</option>
              {vehicles.map((v) => (<option key={v._id} value={v._id}>{v.vehicleName} ({v.plateNumber})</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Driver Name</label>
            <input type="text" required value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="Driver full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Trip Date</label>
            <input type="date" required value={form.tripDate} onChange={(e) => setForm({ ...form, tripDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
            <input type="text" required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="e.g. Musanze District" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Fuel Consumed (L)</label>
            <input type="number" required min="0" step="0.1" value={form.fuelConsumed} onChange={(e) => setForm({ ...form, fuelConsumed: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="e.g. 45.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Trip Cost (RWF)</label>
            <input type="number" required min="0" value={form.tripCost} onChange={(e) => setForm({ ...form, tripCost: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="e.g. 50000" />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2">
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-2 rounded-lg transition-colors disabled:opacity-60 text-sm flex items-center gap-2">
              {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {loading ? "Saving..." : editId ? "Update" : "Record Trip"}
            </button>
            {editId && <button type="button" onClick={handleCancel} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>}
          </div>
        </form>
      </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">All Trips</h3>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">{trips.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold"></th>
                <th className="px-4 py-3 text-left font-semibold">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold">Driver</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Destination</th>
                <th className="px-4 py-3 text-left font-semibold">Fuel (L)</th>
                <th className="px-4 py-3 text-left font-semibold">Cost (RWF)</th>
                {isAdmin && <th className="px-4 py-3 text-left font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 ? (
                <tr><td colSpan={isAdmin ? 8 : 7} className="text-center py-10 text-gray-400">No trips recorded yet.</td></tr>
              ) : (
                trips.map((t, i) => (
                  <tr key={t._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.vehicle?.vehicleName}<div className="text-xs text-gray-500 font-mono">{t.vehicle?.plateNumber}</div></td>
                    <td className="px-4 py-3 text-gray-600">{t.driver}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(t.tripDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{t.destination}</td>
                    <td className="px-4 py-3 text-gray-600">{t.fuelConsumed}</td>
                    <td className="px-4 py-3 font-medium text-emerald-700">{Number(t.tripCost).toLocaleString()}</td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(t)} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                          <button onClick={() => handleDelete(t._id)} className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
