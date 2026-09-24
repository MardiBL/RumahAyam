"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Clock3, Ban } from "lucide-react";
import { useState } from "react";
import { useUser, STATUS } from "@/context/UserContext";
import { formatRupiah } from "@/lib/format";
import OrderChat from "@/components/OrderChat";

function normalizeAddress(address) {
  if (!address) return {};
  if (typeof address === "object") return address;
  if (typeof address === "string") return { address };
  return {};
}

export default function Detail() {
  const { id } = useParams();
  const { orders, requestCancellation, finishOrder } = useUser();
  const order = orders.find((item) => item.id === id);
  const [reason, setReason] = useState("");
  const [show, setShow] = useState(false);

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

  const status = STATUS[order.status] || STATUS.PENDING_CONFIRMATION;
  const canCancel = order.status === "PENDING_CONFIRMATION";
  const address = normalizeAddress(order.address);

  function cancel() {
    requestCancellation(order.id, reason || "Saya ingin membatalkan pesanan.");
    setShow(false);
    setReason("");
  }

  function finish() {
    if (!order.proof) {
      alert("Pesanan belum dapat diselesaikan karena bukti serah terima dari pengantar belum ada.");
      return;
    }
    finishOrder(order.id);
  }

  return (
    <div className="page">
      <div className="container">
        <div className="section-head">
          <div>
            <p style={{ margin: 0, color: "#888" }}>Pesanan Saya</p>
            <h1 style={{ margin: "5px 0" }}>{order.id}</h1>
            <p style={{ margin: 0, color: "#888" }}>
              {new Date(order.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
          <Link href="/akun" className="btn btn-light">Kembali</Link>
        </div>

        {order.payment === "QRIS" && (
          <div className="notice success">
            <div>
              <b>Pembayaran Anda dalam proses</b>
              <br />
              <span>Menunggu konfirmasi admin dan pengantaran.</span>
            </div>
          </div>
        )}

        {order.status === "CANCEL_REQUESTED" && (
          <div className="notice warning">
            <b>Pembatalan pesanan sedang diproses</b>
            <br />
            Menunggu respon admin.
          </div>
        )}

        {order.status === "CANCELLED" && (
          <div className="notice danger">
            <b>Pesanan dibatalkan</b>
            <br />
            Pembatalan telah dikonfirmasi admin.
          </div>
        )}

        {canCancel && (
          <div className="panel cancel-panel">
            <div>
              <b>Batalkan Pesanan</b>
              <p>Anda masih dapat meminta pembatalan karena admin belum mengonfirmasi pesanan.</p>
            </div>

            {!show ? (
              <button className="btn btn-danger" onClick={() => setShow(true)}>
                <Ban size={15} /> Batalkan
              </button>
            ) : (
              <div>
                <textarea
                  className="input"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Alasan pembatalan (opsional)"
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="btn btn-light" onClick={() => setShow(false)}>Kembali</button>
                  <button className="btn btn-danger" onClick={cancel}>Kirim Pembatalan</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="order-detail-grid">
          <div>
            <div className="panel">
              <h3>Status Pesanan</h3>
              <div className="status-large">
                <span className={`status-dot ${order.status}`}></span>
                <div>
                  <b>{status.short}</b>
                  <p>{status.label}</p>
                </div>
              </div>

              <div className="timeline">
                <Timeline active title="Pesanan dibuat" />
                <Timeline
                  active={!['PENDING_CONFIRMATION', 'CANCEL_REQUESTED', 'CANCELLED'].includes(order.status)}
                  title="Admin mengonfirmasi pesanan"
                />
                <Timeline
                  active={['SHIPPED', 'ARRIVED', 'ARRIVED_CONFIRMED', 'COMPLETED'].includes(order.status)}
                  title={`Pengiriman${order.courierName ? ` oleh ${order.courierName}` : ""}`}
                />
                <Timeline
                  active={['ARRIVED', 'ARRIVED_CONFIRMED', 'COMPLETED'].includes(order.status)}
                  title="Pesanan sampai"
                />
                <Timeline active={order.status === "COMPLETED"} title="Selesai" />
              </div>
            </div>

            {order.status === "ARRIVED_CONFIRMED" && (
              <div className="panel" style={{ marginTop: 16 }}>
                <h3>Pesanan Sudah Diterima</h3>
                <p>Bukti serah terima dari pengantar sudah tersedia. Anda dapat menekan tombol selesai.</p>
                <button className="btn btn-primary" onClick={finish}>Pesanan Selesai</button>
              </div>
            )}

            {order.proof && (
              <div className="panel" style={{ marginTop: 16 }}>
                <h3>Bukti Serah Terima Pengantar</h3>
                <img className="proof-image" src={order.proof} alt="Bukti serah terima" />
              </div>
            )}

            <div className="panel" style={{ marginTop: 16 }}>
              <h3>Data Pengantaran</h3>
              <p style={{ lineHeight: 1.8, color: "#555" }}>
                <b>Nama Pengantar:</b> {order.courierName || "Belum ditentukan"}
                <br />
                <b>Nomor WhatsApp:</b> {order.courierId ? "Tersedia setelah ditugaskan admin" : "-"}
              </p>
            </div>

            <div className="panel" style={{ marginTop: 16 }}>
              <h3>Alamat Pengiriman</h3>
              <p style={{ lineHeight: 1.8, color: "#555" }}>
                <b>{address.label || "Alamat"}</b>
                <br />
                {address.recipient || order.customerName || "-"} • {address.phone || order.phone || "-"}
                <br />
                {address.address || "Alamat belum tersedia"}
                {address.city ? `, ${address.city}` : ""}
                {address.note ? <><br /><b>Catatan:</b> {address.note}</> : null}
              </p>
            </div>

            <OrderChat orderId={order.id} />
          </div>

          <aside>
            <div className="panel">
              <h3>Ringkasan</h3>
              {(order.items || []).map((item, index) => (
                <div key={index} className="summary-row">
                  <span>{item.name} × {item.qty}</span>
                  <b>{formatRupiah((item.price || 0) * (item.qty || 0))}</b>
                </div>
              ))}
              <div className="summary-row">
                <span>Ongkir</span>
                <span>{formatRupiah(order.shipping || 0)}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatRupiah(order.total || 0)}</span>
              </div>
              <p style={{ fontSize: 12, color: "#777" }}>
                Metode: <b>{order.payment || "-"}</b>
              </p>
            </div>

            {order.paymentProof?.data && (
              <div className="panel" style={{ marginTop: 16 }}>
                <h3>Bukti Pembayaran QRIS</h3>
                <img className="proof-image" src={order.paymentProof.data} alt="Bukti pembayaran" />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Timeline({ active, title }) {
  return (
    <div className={`timeline-item ${active ? "active" : ""}`}>
      <div className="timeline-icon">
        {active ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
      </div>
      <div><b>{title}</b></div>
    </div>
  );
}
