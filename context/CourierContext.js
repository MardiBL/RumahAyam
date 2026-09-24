"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useOrders } from "./OrderContext";

const C = createContext(null);
const SESSION_KEY = "ayamku_courier_session_v5";

export function CourierProvider({ children }) {
  const { couriers, activeCourier, ready: ordersReady } = useOrders();
  const [courierId, setCourierId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!ordersReady || typeof window === "undefined") return;
    const savedId = localStorage.getItem(SESSION_KEY);
    if (savedId && activeCourier(savedId)) {
      setCourierId(savedId);
    } else {
      localStorage.removeItem(SESSION_KEY);
      setCourierId(null);
    }
    setHydrated(true);
  }, [ordersReady, couriers, activeCourier]);

  function login(phone, code) {
    const normalizedPhone = String(phone || "").trim();
    const normalizedCode = String(code || "").trim().toUpperCase();
    const courier = couriers.find((item) => item.phone === normalizedPhone && String(item.code).toUpperCase() === normalizedCode && item.active);
    if (!courier) return false;
    localStorage.setItem(SESSION_KEY, courier.id);
    setCourierId(courier.id);
    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setCourierId(null);
  }

  const courier = couriers.find((item) => item.id === courierId);

  return <C.Provider value={{ courierId, courier, login, logout, hydrated, isLoggedIn: Boolean(hydrated && courier) }}>{children}</C.Provider>;
}

export const useCourier = () => useContext(C);
