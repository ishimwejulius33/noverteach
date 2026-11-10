import {createContext, useContext, useEffect, useMemo, useState,
  type ReactNode
} from "react";
import { apiRequest } from "../api";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) as User : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(token));
  useEffect(() => {
    let active = true;
    async function checkProfile() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const result = await apiRequest<{ user: User }>("/auth/profile");
        if (active) {
          setUser(result.user);
          localStorage.setItem("user", JSON.stringify(result.user));
        }
      } catch {
        if (active) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void checkProfile();
    return () => { active = false; };
  }, [token]);

  async function login(email: string, password: string) {
    const result = await apiRequest<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }

  async function register(name: string, email: string, password: string) {
    const result = await apiRequest<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({
    user, token, loading, login, register, logout
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
