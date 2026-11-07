import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { adminAPI } from "../services/api";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalWishes: 0,
    totalUsers: 0,
    totalShares: 0,
    totalDownloads: 0,
    topThemes: [],
  });
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getAnalytics(),
      adminAPI.getTemplates(),
      adminAPI.getUsers(),
    ]).then(([a, t, u]) => {
      setStats(a.data);
      setTemplates(t.data);
      setUsers(u.data);
      setLoading(false);
    });
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen dw-bg-maroon py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="dw-text-2xl dw-text-ink font-heading mb-1">
                Admin Panel
              </h1>
              <p className="dw-text-muted">Manage templates, users, and analytics</p>
            </div>
            <button onClick={logout} className="dw-btn dw-btn--ghost">
              Log Out
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="dw-bg-accent-gold w-8 h-8 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="dw-surface-paper border dw-border-dw-border-gold/30 rounded-lg p-6">
                  <p className="dw-text-xs dw-text-muted uppercase tracking-wider mb-1">
                    Total Wishes
                  </p>
                  <p className="dw-text-3xl dw-text-ink font-heading">{stats.totalWishes}</p>
                </div>
                <div className="dw-surface-paper border dw-border-dw-border-gold/30 rounded-lg p-6">
                  <p className="dw-text-xs dw-text-muted uppercase tracking-wider mb-1">
                    Total Users
                  </p>
                  <p className="dw-text-3xl dw-text-ink font-heading">{stats.totalUsers}</p>
                </div>
                <div className="dw-surface-paper border dw-border-dw-border-gold/30 rounded-lg p-6">
                  <p className="dw-text-xs dw-text-muted uppercase tracking-wider mb-1">
                    Shares
                  </p>
                  <p className="dw-text-3xl dw-text-ink font-heading">{stats.totalShares}</p>
                </div>
                <div className="dw-surface-paper border dw-border-dw-border-gold/30 rounded-lg p-6">
                  <p className="dw-text-xs dw-text-muted uppercase tracking-wider mb-1">
                    Downloads
                  </p>
                  <p className="dw-text-3xl dw-text-ink font-heading">{stats.totalDownloads}</p>
                </div>
              </div>

              {/* Templates */}
              <div className="mb-10">
                <h2 className="dw-text-xl dw-text-ink font-heading mb-4">Wish Templates</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b dw-border-default">
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Category</th>
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Message</th>
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Language</th>
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Status</th>
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((t) => (
                        <tr key={t._id} className="border-b dw-border-default/50 hover:bg-[#d4af37]/5 transition-colors">
                          <td className="dw-text-sm dw-text-ink py-3">{t.category}</td>
                          <td className="dw-text-sm dw-text-ink py-3 max-w-xs truncate">{t.message}</td>
                          <td className="dw-text-sm dw-text-ink py-3">{t.language}</td>
                          <td className="dw-text-sm py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                t.isActive
                                  ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30"
                                  : "bg-[#8a7a66]/20 text-[#8a7a66] border border-[#8a7a66]/30"
                              }`}
                            >
                              {t.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="dw-text-sm py-3">
                            <button className="dw-text-xs dw-text-[#d4af37] hover:underline mr-3">
                              Edit
                            </button>
                            <button className="dw-text-xs dw-text-[#dc2626] hover:underline">
                              {t.isActive ? "Disable" : "Enable"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Users */}
              <div>
                <h2 className="dw-text-xl dw-text-ink font-heading mb-4">Users</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b dw-border-default">
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Name</th>
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Email</th>
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Role</th>
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Status</th>
                        <th className="dw-text-xs dw-text-muted uppercase tracking-wider text-left pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b dw-border-default/50 hover:bg-[#d4af37]/5 transition-colors">
                          <td className="dw-text-sm dw-text-ink py-3">{u.name}</td>
                          <td className="dw-text-sm dw-text-ink py-3">{u.email}</td>
                          <td className="dw-text-sm dw-text-ink py-3">
                            <span className={`capitalize ${u.role === "admin" ? "dw-text-[#d4af37] font-medium" : "dw-text-muted"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="dw-text-sm py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                u.isActive
                                  ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30"
                                  : "bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30"
                              }`}
                            >
                              {u.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="dw-text-sm py-3">
                            <button className="dw-text-xs dw-text-[#d4af37] hover:underline">
                              {u.isActive ? "Block" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
