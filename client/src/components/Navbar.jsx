import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="dw-bg-midnight/80 backdrop-blur-md border-b dw-border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="dw-bg-accent-gold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <span className="dw-text-ink font-heading font-bold text-sm">D</span>
              </div>
              <Link to="/" className="font-heading font-bold text-xl tracking-tight dw-text-ink-light">
                Diwali<span className="dw-accent-gold">Wish</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="dw-text-sm font-medium dw-text-muted hover:dw-accent-gold transition-colors"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-wishes"
                    className="dw-text-sm font-medium dw-text-muted hover:dw-accent-gold transition-colors"
                  >
                    My Wishes
                  </Link>
                  <Link
                    to="/create"
                    className="dw-btn dw-btn--ghost px-4 py-2 text-sm"
                  >
                    Create Wish
                  </Link>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="dw-text-sm font-medium dw-text-muted hover:dw-accent-gold transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="dw-btn dw-btn--ghost px-4 py-2 text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="dw-text-sm dw-text-muted">{user?.name}</span>
                  <button
                    onClick={logout}
                    className="dw-btn dw-btn--ghost px-3 py-1.5 text-sm hover:bg-dc2626/10 hover:text-dc2626"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/create"
                  className="dw-bg-accent-gold dw-text-ink px-5 py-2 rounded-lg font-heading font-semibold text-sm hover:bg-[#e6c866] transition-colors"
                >
                  Create Wish
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
