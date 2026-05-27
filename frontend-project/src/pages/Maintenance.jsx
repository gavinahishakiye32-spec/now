import React, { useState, useEffect } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Wrench, Plus, Save, X, Edit3, Trash2 } from "lucide-react";

const today = () => new Date().toISOString().split("T")[0];
const initialForm = { vehicle: "", serviceType: "", maintenanceCost: "", maintenanceDate: today(), vehicleStatus: "Active" };

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fetchData = async () => { try { const [m, v] = await Promise.all([api.get("/maintenance"), api.get("/vehicles")]); setRecords(m.data); setVehicles(v.data); } catch { setError("Failed to load data"); } };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (editId) {
        if (!isAdmin) { setError("Only admins can update records."); setLoading(false); return; }
        await api.put(`/maintenance/${editId}`, form); setSuccess("Record updated!"); setEditId(null);
      } else { await api.post("/maintenance", form); setSuccess("Record added!"); }
      setForm(initialForm); fetchData();
    } catch (err) { setError(err.response?.data?.message || "Operation failed"); }
    finally { setLoading(false); }
  };

  const handleEdit = (r) => {
    if (!isAdmin) return;
    setEditId(r._id); setForm({ vehicle: r.vehicle._id, serviceType: r.serviceType, maintenanceCost: r.maintenanceCost, maintenanceDate: new Date(r.maintenanceDate).toISOString().split("T")[0], vehicleStatus: r.vehicleStatus });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this record?")) return;
    try { await api.delete(`/maintenance/${id}`); setSuccess("Record deleted."); fetchData(); }
    catch { setError("Failed to delete record"); }
  };

  const handleCancel = () => { setEditId(null); setForm(initialForm); setError(""); };

  const statusColor = (s) => {
    if (s === "Active") return "bg-emerald-50 text-emerald-700";
    if (s === "Under Maintenance") return "bg-amber-50 text-amber-700";
    return "bg-red-50 text-red-700";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Wrench className="w-6 h-6 text-indigo-600" /> Maintenance Management</h2>

      {isAdmin && (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{editId ? "Edit Record" : "Add Maintenance Record"}</h3>
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
            <label className="block text-sm font-medium text-gray-600 mb-1">Service Type</label>
            <input type="text" required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="e.g. Oil Change" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cost (RWF)</label>
            <input type="number" required min="0" value={form.maintenanceCost} onChange={(e) => setForm({ ...form, maintenanceCost: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400" placeholder="e.g. 30000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
            <input type="date" required value={form.maintenanceDate} onChange={(e) => setForm({ ...form, maintenanceDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <select value={form.vehicleStatus} onChange={(e) => setForm({ ...form, vehicleStatus: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white">
              <option>Active</option><option>Under Maintenance</option><option>Out of Service</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2">
              {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {loading ? "Saving..." : editId ? "Update" : "Add Record"}
            </button>
            {editId && <button type="button" onClick={handleCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancel</button>}
          </div>
        </form>
      </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Maintenance Records</h3>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">{records.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold"></th>
                <th className="px-4 py-3 text-left font-semibold">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold">Service Type</th>
                <th className="px-4 py-3 text-left font-semibold">Cost (RWF)</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10 text-gray-400">No maintenance records yet.</td></tr>
              ) : (
                records.map((r, i) => (
                  <tr key={r._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{r.vehicle?.vehicleName}<div className="text-xs text-gray-500 font-mono">{r.vehicle?.plateNumber}</div></td>
                    <td className="px-4 py-3 text-gray-600">{r.serviceType}</td>
                    <td className="px-4 py-3 font-medium text-amber-700">{Number(r.maintenanceCost).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(r.maintenanceDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(r.vehicleStatus)}`}>{r.vehicleStatus}</span></td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(r)} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                          <button onClick={() => handleDelete(r._id)} className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                        </div>
                      ) : (<span className="text-xs text-gray-400">View only</span>)}
                    </td>
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
