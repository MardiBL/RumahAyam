"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { useOrders } from "@/context/OrderContext";
import { formatRupiah } from "@/lib/format";

const LABEL = {
  PENDING_CONFIRMATION: "Menunggu Konfirmasi",
  CONFIRMED: "Pesanan Dikonfirmasi",
  SHIPPED: "Dikirim",
  ARRIVED: "Sampai",
  ARRIVED_CONFIRMED: "Bukti Diterima",
  COMPLETED: "Selesai",
  CANCEL_REQUESTED: "Pembatalan Menunggu",
  CANCELLED: "Dibatalkan",
};

function formatAddress(address) {
  if (!address) return "Alamat belum tersedia";
  if (typeof address === "string") return address;

  if (typeof address === "object") {
    return [address.address, address.city].filter(Boolean).join(", ") || "Alamat belum tersedia";
  }

  return "Alamat belum tersedia";
}

export default function Admin() {
  const { admin, logout } = useAdmin();
  const {
    orders,
    updateOrder,
    couriers,
    addCourier,
    setCourier,
    removeCourier,
    sendMessage,
  } = useOrders();
  const router = useRouter();
  const [tab, setTab] = useState("orders");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [form, setForm] = useState({ name: "", phone: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!admin) router.replace("/admin/login");
  }, [admin, router]);

  if (!admin) return null;

  const filtered = orders.filter((o) =>
    `${o.id} ${o.customerName} ${o.courierName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const active = orders.filter((o) =>
    [
      "PENDING_CONFIRMATION",
      "CONFIRMED",
      "SHIPPED",
      "ARRIVED",
      "ARRIVED_CONFIRMED",
      "CANCEL_REQUESTED",
    ].includes(o.status)
  ).length;

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const courierWork = couriers.map((c) => ({
    ...c,
    working: orders.some(
      (o) =>
        o.courierId === c.id &&
        ["SHIPPED", "ARRIVED"].includes(o.status)
    ),
  }));

  function confirmOrder(order) {
    if (order.status !== "PENDING_CONFIRMATION") return;

    updateOrder(order.id, {
      status: "CONFIRMED",
      adminConfirmedAt: new Date().toISOString(),
    });
  }

  function add() {
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }

    addCourier({
      ...form,
      code: `AYAM-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setForm({ name: "", phone: "" });
  }

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-layout admin-layout">
          <aside className="dashboard-nav">
            <div className="logo">🐔 AyamKu Admin</div>

            {[
              ["orders", "Pesanan"],
              ["messages", "Pesan"],
              ["couriers", "Pengantar"],
              ["stats", "Penjualan"],
            ].map(([key, title]) => (
              <button
                key={key}
                className={`dash-link ${tab === key ? "active" : ""}`}
                onClick={() => setTab(key)}
              >
                {title}
              </button>
            ))}

            <Link href="/" className="dash-link">Website</Link>

            <button
              className="dash-link"
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
            >
              Logout
            </button>
          </aside>

          <section className="dashboard-main">
            <div className="section-head">
              <div>
                <h1>Dashboard Admin</h1>
                <p>Kelola pesanan, pengantar, pembatalan, dan penjualan.</p>
              </div>
            </div>

            <div className="admin-stats">
              <Stat t="Total Pesanan" v={orders.length} />
              <Stat t="Perlu Tindakan" v={active} />
              <Stat t="Pengantar" v={couriers.length} />
              <Stat t="Total Penjualan" v={formatRupiah(revenue)} />
            </div>

            {tab === "orders" && (
              <>
                <div className="search-row">
                  <input
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari pesanan, pembeli, pengantar..."
                  />
                </div>

                {filtered.map((o) => (
                  <div className="admin-order" key={o.id}>
                    <div className="admin-order-main">
                      <div>
                        <b>{o.id}</b>
                        <small>
                          {o.customerName || "-"} ({o.customerAlias || "-"}) • {o.phone || "-"}
                        </small>
                        <small>{formatAddress(o.address)}</small>
                        <small>
                          Pengantar: <b>{o.courierName || "Belum ditentukan"}</b>
                        </small>
                      </div>

                      <div>
                        <span className="status">{LABEL[o.status] || o.status}</span>
                        <br />
                        <b>{formatRupiah(o.total || 0)}</b>
                      </div>
                    </div>

                    <div className="admin-actions">
                      <button
                        className="btn btn-light"
                        onClick={() => setSelected(selected === o.id ? null : o.id)}
                      >
                        Detail
                      </button>

                      {o.status === "PENDING_CONFIRMATION" && (
                        <button className="btn btn-primary" onClick={() => confirmOrder(o)}>
                          Konfirmasi Pesanan
                        </button>
                      )}

                      {o.status === "CONFIRMED" && (
                        <>
                          <select className="select" id={`c-${o.id}`} defaultValue="">
                            <option value="">Pilih Pengantar</option>
                            {couriers.filter((c) => c.active).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} • {c.phone}
                              </option>
                            ))}
                          </select>

                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              const element = document.getElementById(`c-${o.id}`);
                              const courier = couriers.find((c) => c.id === element?.value);

                              if (!courier) {
                                alert("Pilih pengantar.");
                                return;
                              }

                              updateOrder(o.id, {
                                status: "SHIPPED",
                                courierId: courier.id,
                                courierName: courier.name,
                                shippingConfirmedAt: new Date().toISOString(),
                              });
                            }}
                          >
                            Konfirmasi Pengiriman
                          </button>
                        </>
                      )}

                      {o.status === "CANCEL_REQUESTED" && (
                        <>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              updateOrder(o.id, {
                                status: "CANCELLED",
                                cancelRequest: {
                                  ...o.cancelRequest,
                                  approved: true,
                                },
                              })
                            }
                          >
                            Setujui Pembatalan
                          </button>

                          <button
                            className="btn btn-light"
                            onClick={() =>
                              updateOrder(o.id, {
                                status: "PENDING_CONFIRMATION",
                                cancelRequest: {
                                  ...o.cancelRequest,
                                  approved: false,
                                },
                              })
                            }
                          >
                            Tolak Pembatalan
                          </button>
                        </>
                      )}
                    </div>

                    {selected === o.id && (
                      <div className="admin-expanded">
                        <h3>Detail Pesanan</h3>

                        <div className="order-info">
                          <p><b>Pembeli:</b> {o.customerName || "-"}</p>
                          <p><b>Alias:</b> {o.customerAlias || "-"}</p>
                          <p><b>No. WhatsApp:</b> {o.phone || "-"}</p>
                        </div>

                        <div className="order-address">
                          <h4>Alamat Pengiriman</h4>

                          {typeof o.address === "object" && o.address !== null ? (
                            <>
                              <p><b>Penerima:</b> {o.address.recipient || o.customerName || "-"}</p>
                              <p><b>No. WhatsApp:</b> {o.address.phone || o.phone || "-"}</p>
                              <p><b>Alamat:</b> {o.address.address || "-"}</p>
                              <p><b>Kota:</b> {o.address.city || "-"}</p>
                              {o.address.note && <p><b>Catatan:</b> {o.address.note}</p>}
                            </>
                          ) : (
                            <p>{o.address || "Alamat belum tersedia"}</p>
                          )}
                        </div>

                        <p>
                          <b>Pengantar:</b> {o.courierName || "Belum ditentukan"}
                        </p>

                        <h4>Produk</h4>
                        {(o.items || []).map((item, index) => (
                          <div className="admin-item" key={index}>
                            <span>{item.name} × {item.qty}</span>
                            <b>{formatRupiah((item.price || 0) * (item.qty || 0))}</b>
                          </div>
                        ))}

                        <p><b>Pembayaran:</b> {o.payment || "-"}</p>

                        {o.cancelRequest && (
                          <div className="alert warning">
                            <b>Permintaan pembatalan:</b> {o.cancelRequest.reason || "-"}
                          </div>
                        )}

                        {o.paymentProof?.data && (
                          <div style={{ marginTop: 15 }}>
                            <h4>Bukti Pembayaran QRIS</h4>
                            <img className="proof-image" src={o.paymentProof.data} alt="Bukti pembayaran QRIS" />
                          </div>
                        )}

                        {o.proof && (
                          <div style={{ marginTop: 15 }}>
                            <h4>Bukti Serah Terima</h4>
                            <img className="proof-image" src={o.proof} alt="Bukti serah terima" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {tab === "messages" && (
              <Messages
                orders={orders}
                selected={selected}
                setSelected={setSelected}
                reply={reply}
                setReply={setReply}
                sendMessage={sendMessage}
              />
            )}

            {tab === "couriers" && (
              <CourierTab
                couriers={courierWork}
                form={form}
                setForm={setForm}
                add={add}
                removeCourier={removeCourier}
                setCourier={setCourier}
              />
            )}

            {tab === "stats" && <Stats orders={orders} />}
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ t, v }) {
  return (
    <div className="admin-stat">
      <span>{t}</span>
      <strong>{v}</strong>
    </div>
  );
}

function Messages({ orders, selected, setSelected, reply, setReply, sendMessage }) {
  const order = orders.find((item) => item.id === selected);

  function send() {
    if (!order || !reply.trim()) return;
    sendMessage(order.id, "admin", reply.trim());
    setReply("");
  }

  return (
    <div className="admin-message-layout">
      <div className="panel message-orders">
        {orders.map((item) => (
          <button
            className={`message-order ${selected === item.id ? "active" : ""}`}
            key={item.id}
            onClick={() => setSelected(item.id)}
          >
            <b>{item.id}</b>
            <small>{item.customerName || "-"}</small>
            <span>{(item.messages || []).length} pesan</span>
          </button>
        ))}
      </div>

      <div className="panel admin-chat">
        {order ? (
          <>
            <h3>{order.id} • {order.customerName}</h3>

            <div className="chat-body">
              {(order.messages || []).map((message) => (
                <div className={`chat-bubble ${message.sender}`} key={message.id}>
                  <b>
                    {message.sender === "admin"
                      ? "Admin"
                      : order.customerAlias || order.customerName}
                  </b>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            <div className="chat-compose">
              <textarea
                className="input"
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Balas pesan user..."
              />
              <button className="btn btn-primary" onClick={send}>Balas</button>
            </div>
          </>
        ) : (
          <div className="empty">Pilih pesanan.</div>
        )}
      </div>
    </div>
  );
}

function CourierTab({ couriers, form, setForm, add, removeCourier, setCourier }) {
  return (
    <div>
      <div className="panel">
        <h2>Tambah Pengantar</h2>
        <div className="form-grid">
          <input
            className="input"
            placeholder="Nama pengantar"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Nomor WA"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <button className="btn btn-primary" onClick={add}>Buat Akses</button>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <h2>Data Pengantar</h2>

        {couriers.map((c) => (
          <div className="courier-row" key={c.id}>
            <div>
              <b>{c.name}</b>
              <small>{c.phone}</small>
              <small>Kode: <b>{c.code}</b></small>
            </div>

            <span className={c.working ? "work on" : "work"}>
              {c.working ? "SEDANG BEKERJA" : "TIDAK BEKERJA"}
            </span>

            <div>
              {c.active ? (
                <button className="btn btn-danger" onClick={() => removeCourier(c.id)}>
                  Cabut Akses / Logout
                </button>
              ) : (
                <button className="btn btn-light" onClick={() => setCourier(c.id, { active: true })}>
                  Aktifkan Lagi
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stats({ orders }) {
  const valid = orders.filter((o) => o.status !== "CANCELLED");
  const now = new Date();
  const sum = (fn) => valid.filter((o) => fn(new Date(o.createdAt))).reduce((s, o) => s + (o.total || 0), 0);
  const count = (fn) => valid.filter((o) => fn(new Date(o.createdAt))).length;
  const day = (date) => date.toDateString() === now.toDateString();
  const month = (date) => date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  const year = (date) => date.getFullYear() === now.getFullYear();

  return (
    <div>
      <h2>Penjualan</h2>
      <div className="sales-grid">
        <Stat t="Harian" v={`${count(day)} pesanan • ${formatRupiah(sum(day))}`} />
        <Stat t="Bulanan" v={`${count(month)} pesanan • ${formatRupiah(sum(month))}`} />
        <Stat t="Tahunan" v={`${count(year)} pesanan • ${formatRupiah(sum(year))}`} />
      </div>
      <div className="panel">
        <h3>Catatan</h3>
        <p>Perhitungan menggunakan tanggal pembuatan pesanan pada data demo. Untuk production, statistik sebaiknya dihitung dari database.</p>
      </div>
    </div>
  );
}
