import React, { useState } from "react";
import { adminUsersApi } from "../../api/adminUsers.api";

export default function AdminCreateAdminPage() {
  const [firstname, setFirstname] = useState("");
  const [emailid, setEmailid] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const res = await adminUsersApi.createAdmin({ firstname, emailid, password });

      // your backend currently sends: "Admin Register sucessfully"
      setMsg(res.data?.message || (typeof res.data === "string" ? res.data : "Admin created"));
      setFirstname("");
      setEmailid("");
      setPassword("");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-gray-900">Create Admin</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new admin account (admin-only action).
        </p>

        {(err || msg) && (
          <div
            className={[
              "mt-4 rounded-xl border p-3 text-sm",
              err ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700",
            ].join(" ")}
          >
            {err || msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
              placeholder="Admin name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              value={emailid}
              onChange={(e) => setEmailid(e.target.value)}
              type="email"
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
              placeholder="min 6 chars"
              required
            />
          </div>

          <button
            disabled={loading}
            className="h-11 w-full rounded-xl bg-black text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}