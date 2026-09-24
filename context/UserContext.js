"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useOrders } from "./OrderContext";
const C = createContext(null),
  UKEY = "ayamku_user_v4",
  AKEY = "ayamku_addresses_v4";
export const STATUS = {
  PENDING_CONFIRMATION: {
    label: "Pesanan sedang menunggu proses konfirmasi",
    short: "Diproses",
    color: "bg-amber-400 text-white",
  },

  SHIPPED: {
    label: "Pesanan sedang diantar",
    short: "Dikirim",
    color: "bg-blue-400 text-white",
  },

  ARRIVED: {
    label: "Pesanan sampai - menunggu bukti serah terima",
    short: "Sampai",
    color: "bg-violet-400 text-white",
  },

  ARRIVED_CONFIRMED: {
    label: "Bukti serah terima sudah diterima",
    short: "Sampai",
    color: "bg-teal-400 text-white",
  },

  COMPLETED: {
    label: "Pesanan selesai",
    short: "Selesai",
    color: "bg-green-400 text-white",
  },

  CANCEL_REQUESTED: {
    label: "Pembatalan pesanan sedang diproses",
    short: "Pembatalan",
    color: "bg-orange-400 text-white",
  },

  CANCELLED: {
    label: "Pesanan batal",
    short: "Dibatalkan",
    color: "bg-red-400 text-white",
  },
};
const read = (k, f) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? f;
  } catch {
    return f;
  }
};
export function UserProvider({ children }) {
  const [user, setUser] = useState(null),
    [addresses, setAddresses] = useState([]),
    [hydrated, setHydrated] = useState(false);
  const {
    orders,
    createOrder: updateCreateOrder,
    updateOrder,
    sendMessage,
  } = useOrders();
  useEffect(() => {
    setUser(read(UKEY, null));
    setAddresses(read(AKEY, []));
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(UKEY, JSON.stringify(user));
  }, [user, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(AKEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);
  function login(data) {
    const next = {
      id: user?.id || `USR-${Date.now()}`,
      fullName: data.fullName.trim(),
      alias: data.alias.trim(),
      phone: data.phone.trim(),
    };
    setUser(next);
    return next;
  }
  function logout() {
    setUser(null);
  }
  function updateProfile(data) {
    setUser((u) => (u ? { ...u, ...data } : u));
  }
  function addAddress(data) {
    const main = data.isMain || !addresses.length;
    const a = { ...data, id: `ADDR-${Date.now()}`, isMain: main };
    setAddresses((xs) =>
      xs.map((x) => (main ? { ...x, isMain: false } : x)).concat(a),
    );
    return a;
  }
  function updateAddress(id, data) {
    setAddresses((xs) =>
      xs
        .map((x) => (x.id === id ? { ...x, ...data } : x))
        .map((x) => (data.isMain ? { ...x, isMain: x.id === id } : x)),
    );
  }
  function deleteAddress(id) {
    setAddresses((xs) => {
      const was = xs.find((x) => x.id === id)?.isMain;
      const rest = xs.filter((x) => x.id !== id);
      return was && rest.length
        ? rest.map((x, i) => (i === 0 ? { ...x, isMain: true } : x))
        : rest;
    });
  }
  function setMainAddress(id) {
    setAddresses((xs) => xs.map((x) => ({ ...x, isMain: x.id === id })));
  }
  function createOrder(data) {
    return updateCreateOrder({
      ...data,
      userId: user?.id,
      customerName: user?.fullName,
      customerAlias: user?.alias,
      phone: user?.phone,
      address: data.address,
    });
  }
  function requestCancellation(id, reason) {
    const o = orders.find((x) => x.id === id);
    if (o?.status !== "PENDING_CONFIRMATION") return;
    updateOrder(id, {
      status: "CANCEL_REQUESTED",
      cancelRequest: {
        reason: reason || "Saya ingin membatalkan pesanan.",
        at: new Date().toISOString(),
      },
    });
  }
  function finishOrder(id) {
    const o = orders.find((x) => x.id === id);
    if (o?.status !== "ARRIVED_CONFIRMED") return false;
    updateOrder(id, {
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
    });
    return true;
  }
  const mainAddress = addresses.find((x) => x.isMain) || addresses[0] || null;
  const messages = orders.flatMap((o) =>
    (o.messages || []).map((m) => ({ ...m, orderId: o.id })),
  );
  return (
    <C.Provider
      value={{
        user,
        addresses,
        orders,
        messages,
        mainAddress,
        hydrated,
        login,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setMainAddress,
        createOrder,
        updateOrder,
        requestCancellation,
        finishOrder,
        sendMessage,
      }}
    >
      {children}
    </C.Provider>
  );
}
export const useUser = () => useContext(C);
