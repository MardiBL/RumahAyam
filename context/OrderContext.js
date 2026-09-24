"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const Ctx = createContext(null);
const KEY = "ayamku_orders_v4";
const COURIERS_KEY = "ayamku_couriers_v4";

const seedOrders = [
  {
    id: "AK-1001",
    userId: "demo-user",
    customerName: "Mardi Migrasi Buulolo",
    customerAlias: "Mardi",
    phone: "081234567890",
    address: {
      label: "Rumah",
      recipient: "Mardi Migrasi Buulolo",
      phone: "081234567890",
      address: "Jl. Melati No. 12",
      city: "Tangerang",
      note: "",
      isMain: true,
      id: "ADDR-DEMO",
    },
    items: [{ name: "Ayam Broiler", qty: 2, price: 32000 }],
    total: 74000,
    shipping: 10000,
    payment: "COD",
    status: "PENDING_CONFIRMATION",
    courierId: null,
    courierName: null,
    cancelRequest: null,
    proof: null,
    paymentProof: null,
    messages: [],
    createdAt: "2026-09-20T08:00:00.000Z",
  },
];

const seedCouriers = [
  {
    id: "kurir-1",
    name: "Andi Pratama",
    phone: "081298765432",
    code: "AYAM-1234",
    active: true,
  },
];

function load(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Gagal membaca ${key}:`, error);
    return fallback;
  }
}

// Kompres foto agar tidak cepat memenuhi localStorage.
export function compressImage(file, maxWidth = 900, quality = 0.6) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("File tidak ditemukan."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      image.onerror = () => reject(new Error("Gambar tidak valid."));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Gagal membaca gambar."));
    reader.readAsDataURL(file);
  });
}

function stripImages(orders) {
  return orders.map((order) => ({
    ...order,
    proof: null,
    paymentProof: null,
  }));
}

function persistOrders(orders) {
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    if (error?.name !== "QuotaExceededError") {
      console.error("Gagal menyimpan orders:", error);
      return false;
    }

    console.warn("localStorage penuh. Mencoba menyimpan versi tanpa foto.");

    try {
      localStorage.setItem(KEY, JSON.stringify(stripImages(orders)));
      return true;
    } catch (secondError) {
      console.error("Storage tetap penuh:", secondError);
      return false;
    }
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(load(KEY, seedOrders));
    setCouriers(load(COURIERS_KEY, seedCouriers));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    persistOrders(orders);
  }, [orders, ready]);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(COURIERS_KEY, JSON.stringify(couriers));
    } catch (error) {
      console.error("Gagal menyimpan data pengantar:", error);
    }
  }, [couriers, ready]);

  const updateOrder = (id, patch) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, ...patch } : order
      )
    );
  };

  const createOrder = (data) => {
    const order = {
      ...data,
      id: `AK-${Date.now().toString().slice(-6)}`,
      status: "PENDING_CONFIRMATION",
      courierId: null,
      courierName: null,
      cancelRequest: null,
      proof: null,
      paymentProof: null,
      messages: [],
      createdAt: new Date().toISOString(),
    };

    setOrders((current) => [order, ...current]);
    return order;
  };

  const sendMessage = (id, sender, text) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? {
              ...order,
              messages: [
                ...(order.messages || []),
                {
                  id: `MSG-${Date.now()}`,
                  sender,
                  text,
                  at: new Date().toISOString(),
                },
              ],
            }
          : order
      )
    );
  };

  const setCourier = (id, patch) => {
    setCouriers((current) =>
      current.map((courier) =>
        courier.id === id ? { ...courier, ...patch } : courier
      )
    );
  };

  const addCourier = (data) => {
    const courier = {
      ...data,
      id: `kurir-${Date.now()}`,
      active: true,
    };

    setCouriers((current) => [...current, courier]);
    return courier;
  };

  const removeCourier = (id) => {
    setCouriers((current) =>
      current.map((courier) =>
        courier.id === id ? { ...courier, active: false } : courier
      )
    );
  };

  const activeCourier = (id) => couriers.find((c) => c.id === id)?.active;

  const value = useMemo(
    () => ({
      orders,
      couriers,
      updateOrder,
      createOrder,
      sendMessage,
      setCourier,
      addCourier,
      removeCourier,
      activeCourier,
      ready,
    }),
    [orders, couriers, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useOrders = () => useContext(Ctx);
