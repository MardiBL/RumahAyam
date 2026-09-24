"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { compressImage } from "@/context/OrderContext";
import { formatRupiah } from "@/lib/format";

export default function QrisPage() {
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

  if (!order) {
    return (
      <div className="page">
        <div className="container empty">
          <h2>Pesanan tidak ditemukan.</h2>
          <Link href="/akun" className="btn btn-primary">Pesanan Saya</Link>
        </div>
      </div>
    );
  }

  async function choose(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("File harus berupa foto JPG, PNG, atau WebP.");
      setFile(null);
      setPreview("");
      return;
    }

    if (selected.size > 8 * 1024 * 1024) {
      setError("Ukuran foto maksimal 8 MB.");
      setFile(null);
      setPreview("");
      return;
    }

    try {
      const compressed = await compressImage(selected, 900, 0.6);
      setFile(selected);
      setPreview(compressed);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Gagal memproses foto pembayaran.");
    }
  }

  function confirm() {
    if (!file || !preview) {
      setError("Upload foto pembayaran wajib dilakukan sebelum melihat detail pesanan.");
      return;
    }

    setSaving(true);

    updateOrder(order.id, {
      paymentProof: {
        name: file.name,
        data: preview,
      },
      status: "PENDING_CONFIRMATION",
    });

    router.push(`/akun/pesanan/${order.id}`);
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="panel">
          <div className="section-head">
            <div>
              <h1>Pembayaran QRIS</h1>
              <p>Scan QRIS berikut menggunakan aplikasi pembayaran Anda.</p>
            </div>
            <span className="status">Wajib upload bukti</span>
          </div>

          <div className="qris-box">
            <div className="fake-qr">
              <div className="qr-title">QRIS</div>
              <div className="qr-pattern">▦</div>
              <small>AYAMKU • DEMO QRIS</small>
            </div>

            <h3>Total Pembayaran</h3>
            <div className="detail-price" style={{ margin: "6px 0 0" }}>
              {formatRupiah(order.total)}
            </div>
            <p style={{ color: "#777", fontSize: 12 }}>
              Gunakan QRIS pada aplikasi bank/e-wallet yang mendukung.
            </p>
          </div>

          <div className="upload-box">
            <h3>
              Upload Foto Bukti Pembayaran{" "}
              <span style={{ color: "#dc2626" }}>*</span>
            </h3>

            <p style={{ color: "#777", fontSize: 13 }}>
              Foto bukti transfer harus jelas dan wajib diupload.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={choose}
              hidden
            />

            <button
              className="btn btn-light"
              onClick={() => inputRef.current?.click()}
            >
              Pilih Foto Pembayaran
            </button>

            {preview ? (
              <div className="upload-preview">
                <img src={preview} alt="Bukti pembayaran" />
                <div>
                  <b>{file?.name || "Bukti pembayaran"}</b>
                  <br />
                  <small>Foto sudah diproses dan dikompres.</small>
                </div>
              </div>
            ) : null}

            {error ? <div className="error-box">{error}</div> : null}
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={confirm}
            disabled={saving}
            style={{ marginTop: 18 }}
          >
            {saving ? "Menyimpan..." : "Upload & Lihat Detail Pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
}
