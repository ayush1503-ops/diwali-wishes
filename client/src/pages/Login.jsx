import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn({ email: e.target.email.value, password: e.target.password.value });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dw-bg-midnight flex items-center justify-center px-4">
      <div className="dw-surface-paper w-full max-w-md p-8 rounded-[var(--dw-radius-xl)] shadow-dw-shadow-xl">
        <div className="text-center mb-8">
          <div className="dw-bg-accent-gold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="dw-text-ink font-heading font-bold">D</span>
          </div>
          <h1 className="dw-text-2xl dw-text-ink font-heading">Welcome Back</h1>
          <p className="dw-text-muted">Log in to your DiwaliWish account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="dw-label block mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="dw-input w-full"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="dw-label block mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="dw-input w-full"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="dw-text-sm dw-text-[#dc2626]">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="dw-bg-accent-gold dw-text-ink w-full py-3 rounded-lg font-heading font-bold hover:bg-[#e6c866] transition-colors shadow-dw-shadow-glow disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center dw-text-sm dw-text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="dw-accent-gold hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
