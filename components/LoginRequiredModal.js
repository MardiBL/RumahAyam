"use client";
import Link from "next/link";
import { X, LockKeyhole } from "lucide-react";

export default function LoginRequiredModal({ open, onClose, title="Silakan login terlebih dahulu" }) {
  if (!open) return null;
  return <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-card" onClick={e=>e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}><X size={18}/></button>
      <div className="modal-icon"><LockKeyhole size={25}/></div>
      <h3>{title}</h3>
      <p>Anda perlu masuk menggunakan nama lengkap, nama alias, dan nomor WhatsApp aktif sebelum melanjutkan.</p>
      <Link href="/login" className="btn btn-primary btn-block" onClick={onClose}>Masuk / Daftar</Link>
      <button className="btn btn-light btn-block" style={{marginTop:8}} onClick={onClose}>Nanti</button>
    </div>
  </div>;
}
