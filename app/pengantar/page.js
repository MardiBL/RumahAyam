"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useCourier } from "@/context/CourierContext";
import { compressImage, useOrders } from "@/context/OrderContext";
import { formatRupiah } from "@/lib/format";

const LABEL = {
  SHIPPED: "Sedang Diantar",
  ARRIVED: "Pesanan Sampai",
  ARRIVED_CONFIRMED: "Bukti Serah Terima Diterima",
};

function formatAddress(address) {
  if (!address) {
    return "Alamat belum tersedia";
  }

  if (typeof address === "string") {
    return address;
  }

  if (typeof address === "object") {
    return (
      [address.address, address.city].filter(Boolean).join(", ") ||
      "Alamat belum tersedia"
    );
  }

  return "Alamat belum tersedia";
}

export default function CourierPage() {
  const { courier, logout, hydrated } = useCourier();
  const { orders, updateOrder } = useOrders();
  const router = useRouter();

  const [proof, setProof] = useState({});
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    if (hydrated && !courier) {
      router.replace("/pengantar/login");
    }
  }, [hydrated, courier, router]);

  if (!hydrated) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (!courier) {
    return null;
  }

  const mine = orders.filter(
    (order) =>
      order.courierId === courier.id &&
      !["COMPLETED", "CANCELLED"].includes(order.status)
  );

  const working = mine.some((order) =>
    ["SHIPPED", "ARRIVED"].includes(order.status)
  );

  async function upload(id, file) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran foto maksimal 8 MB.");
      return;
    }

    try {
      // Kompres gambar terlebih dahulu
      const compressedImage = await compressImage(file, 900, 0.6);

      // Setelah selesai baru simpan ke state
      setProof((current) => ({
        ...current,
        [id]: compressedImage,
      }));
    } catch (error) {
      console.error("Gagal memproses foto:", error);
      alert("Gagal memproses foto. Silakan coba lagi.");
    }
  }

  function arrive(order) {
    if (order.status !== "SHIPPED") {
      return;
    }

    updateOrder(order.id, {
      status: "ARRIVED",
      arrivedAt: new Date().toISOString(),
    });
  }

  function received(order) {
    if (!proof[order.id]) {
      alert("Bukti serah terima wajib diupload.");
      return;
    }

    setUploading(order.id);

    updateOrder(order.id, {
      status: "ARRIVED_CONFIRMED",
      proof: proof[order.id],
      proofUploadedAt: new Date().toISOString(),
    });

    setProof((current) => {
      const next = { ...current };
      delete next[order.id];
      return next;
    });

    setUploading(null);
  }

  function handleLogout() {
    logout();
    router.replace("/pengantar/login");
  }

  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-600">
              Dashboard Pengantar
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {courier.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {courier.phone}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Website
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATUS KERJA */}
        <div
          className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${
            working
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-gray-200 bg-white text-gray-600"
          }`}
        >
          Status kerja:{" "}
          <span className="font-extrabold">
            {working ? "SEDANG BEKERJA" : "TIDAK BEKERJA"}
          </span>
        </div>

        {/* EMPTY STATE */}
        {!mine.length && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center text-sm text-gray-500">
            Tidak ada pesanan yang sedang diantar.
          </div>
        )}

        {/* PESANAN */}
        <div className="space-y-5">
          {mine.map((order) => (
            <section
              key={order.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >

              {/* INFORMASI ORDER */}
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 text-sm">

                  <p className="font-bold text-gray-900">
                    {order.id}
                  </p>

                  <p className="text-gray-600">
                    Pembeli: {order.customerName || "-"}
                  </p>

                  <p className="text-gray-600">
                    WhatsApp: {order.phone || "-"}
                  </p>

                  <p className="text-gray-600">
                    Alamat: {formatAddress(order.address)}
                  </p>

                </div>

                <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                  {LABEL[order.status] || order.status}
                </span>
              </div>

              {/* DETAIL ALAMAT */}
              {typeof order.address === "object" &&
                order.address !== null && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">

                    <p>
                      <b>Penerima:</b>{" "}
                      {order.address.recipient ||
                        order.customerName ||
                        "-"}
                    </p>

                    <p className="mt-1">
                      <b>No. WhatsApp:</b>{" "}
                      {order.address.phone ||
                        order.phone ||
                        "-"}
                    </p>

                    <p className="mt-1">
                      <b>Alamat:</b>{" "}
                      {order.address.address || "-"}
                    </p>

                    <p className="mt-1">
                      <b>Kota:</b>{" "}
                      {order.address.city || "-"}
                    </p>

                    {order.address.note && (
                      <p className="mt-1">
                        <b>Catatan:</b>{" "}
                        {order.address.note}
                      </p>
                    )}

                  </div>
                )}

              {/* TOTAL */}
              <div className="my-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                <span className="text-gray-500">
                  Total
                </span>

                <b className="text-lg text-gray-900">
                  {formatRupiah(order.total || 0)}
                </b>
              </div>

              {/* SHIPPED */}
              {order.status === "SHIPPED" && (
                <button
                  type="button"
                  onClick={() => arrive(order)}
                  className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 sm:w-auto"
                >
                  Pesanan Sampai
                </button>
              )}

              {/* ARRIVED */}
              {order.status === "ARRIVED" && (
                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Upload Bukti Serah Terima{" "}
                      <span className="text-red-600">
                        (Wajib)
                      </span>
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        upload(
                          order.id,
                          e.target.files?.[0]
                        )
                      }
                      className="block w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-2 file:font-semibold file:text-red-700"
                    />
                  </div>

                  {/* PREVIEW FOTO */}
                  {proof[order.id] && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <p className="mb-2 text-xs font-semibold text-gray-500">
                        Preview bukti serah terima
                      </p>

                      <img
                        src={proof[order.id]}
                        alt="Preview bukti serah terima"
                        className="max-h-72 w-full rounded-xl object-contain sm:w-72"
                      />
                    </div>
                  )}

                  {/* KONFIRMASI */}
                  <button
                    type="button"
                    onClick={() => received(order)}
                    disabled={uploading === order.id}
                    className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {uploading === order.id
                      ? "Menyimpan..."
                      : "Konfirmasi Diterima"}
                  </button>

                </div>
              )}

              {/* ARRIVED CONFIRMED */}
              {order.status === "ARRIVED_CONFIRMED" && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">

                  <p>
                    Bukti serah terima sudah diterima.
                    Menunggu pembeli menekan{" "}
                    <b>Pesanan Selesai</b>.
                  </p>

                  {order.proof && (
                    <img
                      src={order.proof}
                      alt="Bukti serah terima"
                      className="mt-3 max-h-72 w-full rounded-xl object-contain sm:w-72"
                    />
                  )}

                </div>
              )}

            </section>
          ))}
        </div>
      </div>
    </main>
  );
}