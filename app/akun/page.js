"use client";
import Link from "next/link";
import { useUser, STATUS } from "@/context/UserContext";
import { formatRupiah } from "@/lib/format";
export default function Account() {
  const { user, orders } = useUser();
  if (!user)
    return (
      <div className="page">
        <div className="container empty">
          <h2>Silakan login.</h2>
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  const mine = orders.filter(
    (o) => o.userId === user.id || o.customerName === user.fullName,
  );
  return (
    <div className="page">
      <div className="container">
        {!mine.length ? (
          <div className="empty">Belum ada pesanan.</div>
        ) : (
          mine.map((o) => (
            <Link
              href={`/akun/pesanan/${o.id}`}
              className="order"
              style={{ display: "block" }}
              key={o.id}
            >
              <div className="order-top">
                <div>
                  <b>{o.id}</b>
                  <br />
                  <small>{new Date(o.createdAt).toLocaleString("id-ID")}</small>
                  <br />
                  <small>
                    Pengantar: <b>{o.courierName || "Belum ditentukan"}</b>
                  </small>
                </div>
                <span
                  className={`self-start rounded-md px-2 py-1 text-xs ${
                    STATUS[o.status]?.color || "bg-gray-500 text-white"
                  }`}
                >
                  {STATUS[o.status]?.short || o.status}
                </span>
              </div>
              <div className="summary-row">
                <span>
                  {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                </span>
                <b>{formatRupiah(o.total)}</b>
              </div>
              {o.status === "ARRIVED_CONFIRMED" && (
                <div className="alert success" style={{ marginTop: 10 }}>
                  Bukti serah terima sudah diupload pengantar. Klik pesanan
                  untuk menekan <b>Pesanan Selesai</b>.
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
