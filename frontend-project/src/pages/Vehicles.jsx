import React, { useState, useEffect } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Truck, Plus, Save, X, Edit3, Trash2 } from "lucide-react";

const initialForm = { vehicleName: "", plateNumber: "", model: "", fuelType: "Petrol", capacity: "" };

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fetchVehicles = async () => { try { const res = await api.get("/vehicles"); setVehicles(res.data); } catch { setError("Failed to load vehicles"); } };
  useEffect(() => { fetchVehicles(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (editId) { await api.put(`/vehicles/${editId}`, form); setSuccess("Vehicle updated!"); setEditId(null); }
      else { await api.post("/vehicles", form); setSuccess("Vehicle added!"); }
      setForm(initialForm); fetchVehicles();
    } catch (err) { setError(err.response?.data?.message || "Operation failed"); }
    finally { setLoading(false); }
  };

  const handleEdit = (v) => {
    if (!isAdmin) return;
    setEditId(v._id); setForm({ vehicleName: v.vehicleName, plateNumber: v.plateNumber, model: v.model, fuelType: v.fuelType, capacity: v.capacity });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this vehicle?")) return;
    try { await api.delete(`/vehicles/${id}`); setSuccess("Vehicle deleted."); fetchVehicles(); }
    catch { setError("Failed to delete vehicle"); }
  };

  const handleCancel = () => { setEditId(null); setForm(initialForm); setError(""); };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Truck className="w-6 h-6 text-indigo-600" /> Vehicle Management</h2>

      {isAdmin && (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{editId ? "Edit Vehicle" : "Add New Vehicle"}</h3>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-3 text-sm">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded mb-3 text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Vehicle Name</label>
            <input type="text" required value={form.vehicleName} onChange={(e) => setForm({ ...form, vehicleName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="e.g. Toyota Hilux" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Plate Number</label>
            <input type="text" required value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 font-mono" placeholder="e.g. RAB 123A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Model / Year</label>
            <input type="text" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="e.g. 2022" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Fuel Type</label>
            <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white">
              <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Capacity (kg)</label>
            <input type="number" required min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="e.g. 1000" />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2">
              {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {loading ? "Saving..." : editId ? "Update" : "Add Vehicle"}
            </button>
            {editId && <button type="button" onClick={handleCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancel</button>}
          </div>
        </form>
      </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Registered Vehicles</h3>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">{vehicles.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold"></th>
                <th className="px-4 py-3 text-left font-semibold">Vehicle Name</th>
                <th className="px-4 py-3 text-left font-semibold">Plate Number</th>
                <th className="px-4 py-3 text-left font-semibold">Model</th>
                <th className="px-4 py-3 text-left font-semibold">Fuel Type</th>
                <th className="px-4 py-3 text-left font-semibold">Capacity (kg)</th>
                {isAdmin && <th className="px-4 py-3 text-left font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="text-center py-10 text-gray-400">No vehicles registered yet.</td></tr>
              ) : (
                vehicles.map((v, i) => (
                  <tr key={v._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{v.vehicleName}</td>
                    <td className="px-4 py-3"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">{v.plateNumber}</span></td>
                    <td className="px-4 py-3 text-gray-600">{v.model}</td>
                    <td className="px-4 py-3 text-gray-600">{v.fuelType}</td>
                    <td className="px-4 py-3 text-gray-600">{Number(v.capacity).toLocaleString()}</td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(v)} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                          <button onClick={() => handleDelete(v._id)} className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
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
