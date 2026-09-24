"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext(null);
const ADMIN_KEY = "ayamku_admin";

export const ADMIN_ACCOUNT = { email: "admin@ayamku.id", password: "admin123", name: "Admin AyamKu" };

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { setAdmin(JSON.parse(localStorage.getItem(ADMIN_KEY)) || null); } catch { setAdmin(null); }
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(ADMIN_KEY, JSON.stringify(admin)); }, [admin, hydrated]);

  function login(email, password) {
    if (email.trim().toLowerCase() !== ADMIN_ACCOUNT.email || password !== ADMIN_ACCOUNT.password) {
      return { ok: false, message: "Email atau password admin salah." };
    }
    const account = { email: ADMIN_ACCOUNT.email, name: ADMIN_ACCOUNT.name };
    setAdmin(account);
    return { ok: true, account };
  }
  function logout() { setAdmin(null); }

  return <AdminContext.Provider value={{ admin, hydrated, login, logout }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin harus digunakan di dalam AdminProvider");
  return context;
}
