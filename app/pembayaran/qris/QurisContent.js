"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { useUser } from "@/context/UserContext";
import { compressImage } from "@/context/OrderContext";
import { formatRupiah } from "@/lib/format";

export default function QrisContent() {
  const params = useSearchParams();
  const router = useRouter();

  const { orders, updateOrder } = useUser();

  const id = params.get("order");

  const order = orders.find((item) => item.id === id);

  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================================================
  // PESANAN TIDAK DITEMUKAN
  // =========================================================

  if (!order) {
    return (
      <div className="page">
        <div className="container empty">
          <h2>Pesanan tidak ditemukan.</h2>

          <Link
            href="/akun"
            className="btn btn-primary"
          >
            Pesanan Saya
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // PILIH FOTO PEMBAYARAN
  // =========================================================

  async function choose(event) {
    const selected = event.target.files?.[0];

    if (!selected) {
      return;
    }

    // Validasi tipe file
    if (!selected.type.startsWith("image/")) {
      setError(
        "File harus berupa foto JPG, PNG, atau WebP."
      );

      setFile(null);
      setPreview("");

      return;
    }

    // Validasi ukuran maksimal 8 MB
    if (selected.size > 8 * 1024 * 1024) {
      setError("Ukuran foto maksimal 8 MB.");

      setFile(null);
      setPreview("");

      return;
    }

    try {
      setError("");

      // Kompres foto sebelum disimpan
      const compressed = await compressImage(
        selected,
        900,
        0.6
      );

      setFile(selected);
      setPreview(compressed);
    } catch (err) {
      console.error(
        "Gagal memproses foto:",
        err
      );

      setError(
        "Gagal memproses foto pembayaran."
      );

      setFile(null);
      setPreview("");
    }
  }

  // =========================================================
  // KONFIRMASI PEMBAYARAN
  // =========================================================

  function confirm() {
    // Bukti pembayaran wajib
    if (!file || !preview) {
      setError(
        "Upload foto pembayaran wajib dilakukan sebelum melihat detail pesanan."
      );

      return;
    }

    setSaving(true);

    // Simpan bukti pembayaran
    updateOrder(order.id, {
      paymentProof: {
        name: file.name,
        data: preview,
      },

      status: "PENDING_CONFIRMATION",
    });

    // Masuk ke detail pesanan
    router.push(
      `/akun/pesanan/${order.id}`
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="page">
      <div
        className="container"
        style={{
          maxWidth: 760,
        }}
      >
        <div className="panel">

          {/* ================================
              HEADER
          ================================= */}

          <div className="section-head">
            <div>
              <h1>Pembayaran QRIS</h1>

              <p>
                Scan QRIS berikut menggunakan
                aplikasi pembayaran Anda.
              </p>
            </div>

            <span className="status">
              Wajib upload bukti
            </span>
          </div>

          {/* ================================
              QRIS
          ================================= */}

          <div className="qris-box">

            <div className="fake-qr">
              <div className="qr-title">
                QRIS
              </div>

              <div className="qr-pattern">
                ▦
              </div>

              <small>
                AYAMKU • DEMO QRIS
              </small>
            </div>

            <h3>
              Total Pembayaran
            </h3>

            <div
              className="detail-price"
              style={{
                margin: "6px 0 0",
              }}
            >
              {formatRupiah(order.total)}
            </div>

            <p
              style={{
                color: "#777",
                fontSize: 12,
              }}
            >
              Gunakan QRIS pada aplikasi
              bank/e-wallet yang mendukung.
            </p>
          </div>

          {/* ================================
              UPLOAD BUKTI
          ================================= */}

          <div className="upload-box">

            <h3>
              Upload Foto Bukti Pembayaran{" "}
              <span
                style={{
                  color: "#dc2626",
                }}
              >
                *
              </span>
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: 13,
              }}
            >
              Foto bukti transfer harus jelas
              dan wajib diupload.
            </p>

            {/* Input file disembunyikan */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={choose}
              hidden
            />

            {/* Tombol pilih foto */}
            <button
              type="button"
              className="btn btn-light"
              onClick={() =>
                inputRef.current?.click()
              }
            >
              Pilih Foto Pembayaran
            </button>

            {/* ================================
                PREVIEW FOTO
            ================================= */}

            {preview ? (
              <div className="upload-preview">

                <img
                  src={preview}
                  alt="Bukti pembayaran"
                />

                <div>
                  <b>
                    {file?.name ||
                      "Bukti pembayaran"}
                  </b>

                  <br />

                  <small>
                    Foto sudah diproses
                    dan dikompres.
                  </small>
                </div>
              </div>
            ) : null}

            {/* ================================
                ERROR
            ================================= */}

            {error ? (
              <div className="error-box">
                {error}
              </div>
            ) : null}

          </div>

          {/* ================================
              TOMBOL KONFIRMASI
          ================================= */}

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={confirm}
            disabled={saving}
            style={{
              marginTop: 18,
            }}
          >
            {saving
              ? "Menyimpan..."
              : "Upload & Lihat Detail Pesanan"}
          </button>

        </div>
      </div>
    </div>
  );
}