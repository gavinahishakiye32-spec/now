import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Truck, LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Truck className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">SwiftWheel FMS</h1>
          <p className="text-gray-500 text-sm mt-1">Fleet Management System</p>
          <p className="text-gray-400 text-xs mt-0.5">Kigali City, Rwanda</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" required autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm placeholder-gray-400"
              placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm placeholder-gray-400"
              placeholder="Enter password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 mt-2 text-sm flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 bg-gray-50 rounded-lg px-4 py-3 text-center border border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Default credentials</p>
          <p className="text-xs text-gray-600 mt-0.5">Username: <span className="font-mono font-bold text-gray-800">admin</span> &nbsp;|&nbsp; Password: <span className="font-mono font-bold text-gray-800">Admin@1234</span></p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">Create one</Link></p>
      </div>
    </div>
  );
}
