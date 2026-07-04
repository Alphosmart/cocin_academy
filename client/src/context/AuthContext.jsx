import { createContext, useContext, useEffect, useMemo, useState } from "react";
import http from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    http.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setBooting(false));
  }, []);

  async function login(email, password, token) {
    const res = await http.post("/auth/login", { email, password, token });
    // 206 => two-factor code required; caller should prompt for it.
    if (res.status === 206 || res.data?.twoFactorRequired) {
      return { twoFactorRequired: true };
    }
    setUser(res.data.user);
    return { user: res.data.user };
  }

  async function logout() {
    await http.post("/auth/logout").catch(() => null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, booting, login, logout }), [user, booting]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
