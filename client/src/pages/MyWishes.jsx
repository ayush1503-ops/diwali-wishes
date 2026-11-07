import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { wishAPI } from "../services/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function MyWishes() {
  const { user, logout } = useAuth();
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishAPI
      .getMy()
      .then((res) => {
        setWishes(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen dw-bg-midnight py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="dw-text-2xl dw-text-ink font-heading mb-1">
                My Wishes
              </h1>
              <p className="dw-text-muted">Your saved Diwali greetings</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/create"
                className="dw-bg-accent-gold dw-text-ink px-5 py-2 rounded-lg font-heading font-semibold hover:bg-[#e6c866] transition-colors"
              >
                Create New
              </Link>
              <button
                onClick={logout}
                className="dw-btn dw-btn--ghost px-4 py-2 hover:bg-dc2626/10 hover:text-dc2626"
              >
                Log Out
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="dw-bg-accent-gold w-8 h-8 rounded-full animate-spin" />
            </div>
          ) : wishes.length === 0 ? (
            <div className="text-center py-20">
              <p className="dw-text-muted mb-4">No wishes saved yet.</p>
              <Link
                to="/create"
                className="dw-accent-gold hover:underline font-medium"
              >
                Create your first wish
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishes.map((w) => (
                <Link
                  key={w._id}
                  to={`/wish/${w.shareSlug}`}
                  className="dw-surface-paper border dw-border-default rounded-lg p-6 hover:border-dw-border-gold hover:shadow-dw-shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="dw-text-lg dw-text-ink font-heading">
                      Happy Diwali, {w.recipientName}!
                    </h3>
                    <span className="dw-text-xs dw-text-muted uppercase tracking-wider">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className="dw-text-xs dw-text-muted uppercase tracking-wider">
                      {w.theme}
                    </span>
                    <span className="dw-text-xs dw-text-muted uppercase tracking-wider">
                      {w.zodiacSign}
                    </span>
                  </div>
                  <p className="dw-text-sm dw-text-muted line-clamp-2 mb-4">
                    {w.wishMessage}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="dw-btn dw-btn--ghost dw-text-xs flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        wishAPI.share(w._id);
                      }}
                    >
                      Share
                    </button>
                    <button
                      className="dw-btn dw-btn--primary dw-text-xs flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        wishAPI.download(w._id);
                      }}
                    >
                      Download
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
