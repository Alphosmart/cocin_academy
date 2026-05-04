import { createContext, useContext, useEffect, useMemo, useState } from "react";
import http from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("school_admin_token");
    if (!token) {
      setBooting(false);
      return;
    }
    http.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("school_admin_token"))
      .finally(() => setBooting(false));
  }, []);

  async function login(email, password) {
    const res = await http.post("/auth/login", { email, password });
    localStorage.setItem("school_admin_token", res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem("school_admin_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, booting, login, logout }), [user, booting]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
