import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dw_token");
    const storedUser = localStorage.getItem("dw_user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("dw_token", token);
    localStorage.setItem("dw_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("dw_token");
    localStorage.removeItem("dw_user");
    setUser(null);
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    login(res.data.token, {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    });
    return res.data;
  };

  const signIn = async (data) => {
    const res = await authAPI.login(data);
    login(res.data.token, {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    });
    return res.data;
  };

  const value = {
    user,
    loading,
    login,
    signIn,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;
