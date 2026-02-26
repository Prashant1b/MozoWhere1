import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function Signup() {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const signup = ctx?.signup;

  const [firstname, setFirstname] = useState("");
  const [emailid, setEmailid] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const after = location.state?.from || "/";

  const close = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (!signup) throw new Error("AuthProvider missing. Wrap app with AuthProvider.");
      await signup(firstname, emailid, password);

      // close overlay & go next
      navigate(after, { replace: true });
    } catch (e2) {
      console.log("SIGNUP ERROR:", e2?.response?.data || e2);
      setErr(
        e2?.response?.data?.message ||
          e2?.message ||
          "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40">
      {/* backdrop */}
      <button
        className="absolute inset-0 cursor-default"
        aria-label="Close signup"
        onClick={close}
      />

      {/* modal */}
      <div className="relative mx-auto mt-16 w-full max-w-md px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Create account</h1>
              <p className="mt-1 text-sm text-gray-600">Signup to start shopping.</p>
            </div>
            <button
              onClick={close}
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-gray-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {err && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Name</label>
              <input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                type="text"
                autoComplete="name"
                placeholder="Prashant"
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                value={emailid}
                onChange={(e) => setEmailid(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="min 6 chars"
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
                required
              />
            </div>

            <button
              disabled={loading}
              className="h-11 w-full rounded-xl bg-black text-white font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ from: after }}
                className="font-semibold text-black underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}